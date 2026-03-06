<?php
/**
 * OpenAiProvider.php
 *
 * OpenAI provider implementation for AI responses.
 *
 * @package Etch\Services\Ai
 */

declare(strict_types=1);

namespace Etch\Services\Ai\AgentProviders;

use Etch\Helpers\Flag;
use Etch\Services\Ai\AiProviderInterface;
use Etch\Services\Ai\HttpTransport;
use Etch\Services\Ai\ServerSideEventsFramesParser;
use Etch\Services\Ai\WpCurlHttpTransport;
use Etch\Services\SettingsService;
use WP_Error;

/**
 * OpenAiProvider
 *
 * Provides AI responses using the OpenAI Responses API.
 *
 * @phpstan-import-type AiChatMessages from \Etch\Services\Ai\AiProviderInterface
 *
 * @package Etch\Services\Ai
 */
class OpenAiProvider implements AiProviderInterface {

	/**
	 * Name of the wp-config constant that stores the OpenAI API key.
	 *
	 * @var string
	 */
	private const WP_CONFIG_KEY_CONSTANT = 'ETCH_OPENAI_API_KEY';

	/**
	 * The default model to use for the AI service.
	 *
	 * @var string
	 */
	private const DEFAULT_MODEL = 'gpt-5-mini';

	/**
	 * Default system prompt for Etch AI.
	 *
	 * Edit this string for quick local prompt tuning.
	 *
	 * @var string
	 */
	private const ASK_MODE_SYSTEM_PROMPT = "You are a the Etch AI factual data extraction assistant.\nYour task is to help the user with web development tasks inside of the Etch WordPress plugin (https://etchwp.com/) by retrieving and presenting factual data from the provided documentation in Markdown format to answer their questions. Etch is a modern WordPress plugin and we favour modern development best practices and clean code, not hacks.\n\nWhen asked a question:\n0. (Optional): If the user's question is unclear or ambiguous, skip the following steps and ask clarifying questions instead.\n1. Carefully read through the entire Markdown documentation\n2. Identify and extract factual information such as:\n   - UI elements\n   - Usage instructions\n   - Configuration options\n   - Commands and syntax\n   - Data types and structures\n   - Examples and code snippets\n\n3. Present the extracted information clearly and accurately\n4. Maintain the original meaning and context\n5. Preserve code formatting and technical terminology\n6. If asked about specific information, locate and cite the relevant section\n\nDo not:\n- Add interpretations or opinions\n- Make assumptions beyond what's stated in the documentation\n- Modify technical terms or specifications\n- Start your answer with “Based on the documentation provided, here is the factual information…” -> just answer directly\n- Overexplain what you're about to do\n\nOutput parameters:\n- Respond with the requested factual data in a clear format.\n- The tone of the response should be 15% terse and 20% friendly. Don't blab, the user wants a polite answer but expects high signal-to-noise ratio.\n- **Do not** answer with a list, keep the format conversational unless the user asks for 'steps' or a 'list' explicitly\n- If the user's question is unclear, ask clarifying questions.\n- If your reply involves several 'paths' / options reply with the most likely one, then make the assumption clear and ask a follow-up question to clarify.\n- If you do not find the answer in the documentation, let the user know that the answer is not present, and offer suggestions or possible approaches to achieve the desired outcome.\n\nTransparent uncertainty is more valuable than false certainty or untrue statements. The user wants **CONCISE CLARITY** above all else.\n- Always use proper markdown formatting.\n- When you output code snippets, or technical keywords, **always** mark it as such (e.g. using backticks)";

	/**
	 * The API URL for the AI service.
	 *
	 * @var string
	 */
	private const API_URL = 'https://api.openai.com/v1/responses';

	/**
	 * The HTTP transport.
	 *
	 * @var HttpTransport
	 */
	private HttpTransport $transport;

	/**
	 * The API key, or null to resolve at call time.
	 *
	 * @var string|null
	 */
	private ?string $api_key;

	/**
	 * Constructor.
	 *
	 * @param HttpTransport|null $transport Optional HTTP transport (defaults to WpCurlHttpTransport).
	 * @param string|null        $api_key   Optional API key (defaults to settings/wp-config lookup).
	 */
	public function __construct( ?HttpTransport $transport = null, ?string $api_key = null ) {
		$this->transport = $transport ?? new WpCurlHttpTransport();
		$this->api_key   = $api_key;
	}

	/**
	 * Provide an AI response.
	 *
	 * @param array                 $messages The messages to generate an AI response for.
	 * @param array{model?: string} $options The options for the AI provider.
	 *
	 * @phpstan-param AiChatMessages $messages
	 *
	 * @return array{text: string}|WP_Error
	 */
	public function provide_ai_response( array $messages, array $options = array() ): array|WP_Error {
		$api_key = $this->resolve_api_key();
		if ( '' === $api_key ) {
			return new WP_Error( 'etch_ai_missing_api_key', 'OpenAI API key is missing.', array( 'status' => 500 ) );
		}

		$model   = $options['model'] ?? self::DEFAULT_MODEL;
		$payload = $this->build_payload( $messages, $model );

		$encoded_payload = wp_json_encode( $payload );
		if ( false === $encoded_payload ) {
			return new WP_Error( 'json_encode_failed', 'Failed to encode payload', array( 'status' => 500 ) );
		}

		$result = $this->transport->post(
			self::API_URL,
			array(
				'Content-Type'  => 'application/json',
				'Authorization' => 'Bearer ' . $api_key,
			),
			$encoded_payload
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$parser = new OpenAiResponseParser();

		return $parser->parse( $result['status'], $result['body'] );
	}

	/**
	 * Stream an AI response.
	 *
	 * @param array         $messages The messages to generate an AI response for.
	 * @param callable      $on_delta The callback to call with each text delta.
	 * @param callable|null $on_error The callback to call on error events.
	 * @param callable|null $on_reasoning The callback to call with reasoning deltas.
	 *
	 * @phpstan-param AiChatMessages $messages
	 *
	 * @return ?WP_Error Returns WP_Error on failure, null on success.
	 */
	public function stream_ai_response( array $messages, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null ): ?WP_Error {
		if ( count( $messages ) === 0 ) {
			return new WP_Error( 'etch_ai_invalid_messages', 'At least one message is required', array( 'status' => 400 ) );
		}

		$api_key = $this->resolve_api_key();
		if ( '' === $api_key ) {
			return new WP_Error( 'etch_ai_missing_api_key', 'OpenAI API key is missing.', array( 'status' => 500 ) );
		}

		$payload = $this->build_payload( $messages, self::DEFAULT_MODEL, true );

		$encoded_payload = wp_json_encode( $payload );
		if ( false === $encoded_payload ) {
			return new WP_Error( 'json_encode_failed', 'Failed to encode payload', array( 'status' => 500 ) );
		}

		$sse_buffer      = '';
		$parser          = new ServerSideEventsFramesParser();
		$event_processor = new OpenAiStreamEventProcessor();

		return $this->transport->stream(
			self::API_URL,
			array(
				'Content-Type'  => 'application/json',
				'Accept'        => 'text/event-stream',
				'Authorization' => 'Bearer ' . $api_key,
			),
			$encoded_payload,
			function ( string $chunk ) use ( &$sse_buffer, $parser, $event_processor, $on_delta, $on_error, $on_reasoning ) {
				$this->handle_sse_chunk( $sse_buffer, $parser, $event_processor, $chunk, $on_delta, $on_error, $on_reasoning );
			}
		);
	}

	/**
	 * Handle an SSE chunk and process the streaming events.
	 *
	 * @param string                       &$sse_buffer The SSE buffer to process.
	 * @param ServerSideEventsFramesParser $parser The SSE frames parser.
	 * @param OpenAiStreamEventProcessor   $event_processor The event processor.
	 * @param string                       $chunk The chunk to process.
	 * @param callable                     $on_delta The callback for text deltas.
	 * @param callable|null                $on_error Optional callback for errors.
	 * @param callable|null                $on_reasoning Optional callback for reasoning.
	 *
	 * @return void
	 */
	private function handle_sse_chunk( string &$sse_buffer, ServerSideEventsFramesParser $parser, OpenAiStreamEventProcessor $event_processor, string $chunk, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null ): void {
		$sse_buffer .= $chunk;
		$frames = $parser->extract_frames( $sse_buffer );
		foreach ( $frames as $frame ) {
			if ( '[DONE]' === $frame ) {
				continue;
			}

			$event = json_decode( $frame, true );
			if ( ! is_array( $event ) ) {
				continue;
			}

			$event_processor->process( $event, $on_delta, $on_error, $on_reasoning );
		}
	}

	/**
	 * Resolve the API key from the injected value, settings, or wp-config.
	 *
	 * @return string
	 */
	private function resolve_api_key(): string {
		if ( null !== $this->api_key ) {
			return $this->api_key;
		}

		$settings = SettingsService::get_instance();
		$api_key  = $settings->get_decrypted_setting( 'ai_api_key' );

		if ( ! empty( $api_key ) && is_string( $api_key ) ) {
			return $api_key;
		}

		$config_key = defined( self::WP_CONFIG_KEY_CONSTANT ) ? constant( self::WP_CONFIG_KEY_CONSTANT ) : null;
		if ( is_string( $config_key ) && '' !== trim( $config_key ) ) {
			return trim( $config_key );
		}

		return '';
	}

	/**
	 * Build the payload for the OpenAI API.
	 *
	 * @param array  $messages The messages to build the payload from.
	 * @param string $model The model to use for the AI service.
	 * @param bool   $stream Whether to stream the response.
	 *
	 * @phpstan-param AiChatMessages $messages
	 *
	 * @return array<string, mixed> The payload.
	 */
	private function build_payload( array $messages, string $model, bool $stream = false ): array {
		$builder = new OpenAiPayloadBuilder();

		return $builder->build(
			$messages,
			$model,
			self::ASK_MODE_SYSTEM_PROMPT,
			array(
				'stream'             => $stream,
				'reasoning_enabled'  => Flag::is_on( 'ENABLE_AI_REASONING' ),
			)
		);
	}
}
