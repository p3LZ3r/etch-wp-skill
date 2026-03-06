<?php
/**
 * OpenAiPayloadBuilder.php
 *
 * Builds payloads for the OpenAI Responses API.
 *
 * @package Etch\Services\Ai\AgentProviders
 */

declare(strict_types=1);

namespace Etch\Services\Ai\AgentProviders;

/**
 * OpenAiPayloadBuilder
 *
 * @phpstan-import-type AiChatMessages from \Etch\Services\Ai\AiProviderInterface
 *
 * @package Etch\Services\Ai\AgentProviders
 */
class OpenAiPayloadBuilder {

	/**
	 * Build the payload for the OpenAI API.
	 *
	 * @param array  $messages      The messages to build the payload from.
	 * @param string $model         The model to use.
	 * @param string $system_prompt The system prompt.
	 * @param array  $options       Optional flags: 'stream' (bool), 'reasoning_enabled' (bool).
	 *
	 * @phpstan-param AiChatMessages $messages
	 * @phpstan-param array{stream?: bool, reasoning_enabled?: bool} $options
	 *
	 * @return array<string, mixed> The payload.
	 */
	public function build( array $messages, string $model, string $system_prompt, array $options = array() ): array {
		$stream             = ! empty( $options['stream'] );
		$reasoning_enabled  = ! empty( $options['reasoning_enabled'] );

		$payload = array(
			'model'        => $model,
			'instructions' => $system_prompt,
			'stream'       => $stream,
			'tools'        => array(
				array(
					'type'    => 'web_search',
					'filters' => array(
						'allowed_domains' => array( 'docs.etchwp.com' ),
					),
				),
			),
		);

		$payload = array_merge( $payload, $this->get_model_params( $model, $reasoning_enabled ) );
		$payload['input'] = $this->build_input_from_messages( $messages );

		return $payload;
	}

	/**
	 * Build the input array from messages.
	 *
	 * @param array $messages The messages to build input from.
	 *
	 * @phpstan-param AiChatMessages $messages
	 * @phpstan-return list<array{role: string, content: string}>
	 *
	 * @return array The input.
	 */
	public function build_input_from_messages( array $messages ): array {
		$input = array();

		foreach ( $messages as $m ) {
			$role    = trim( $m['role'] );
			$content = trim( $m['content'] );

			if ( '' === $role || '' === $content ) {
				continue;
			}

			$input[] = array(
				'role'    => $role,
				'content' => $content,
			);
		}

		return $input;
	}

	/**
	 * Get model-specific parameters.
	 *
	 * @param string $model             The model name.
	 * @param bool   $reasoning_enabled Whether reasoning summary is enabled.
	 *
	 * @return array<string, mixed> The model parameters.
	 */
	private function get_model_params( string $model, bool $reasoning_enabled ): array {
		if ( 'gpt-5-mini' === $model ) {
			return array(
				'text'      => array(
					'verbosity' => 'low',
				),
				'reasoning' => $reasoning_enabled
					? array(
						'effort'  => 'medium',
						'summary' => 'detailed',
					)
					: array(
						'effort' => 'medium',
					),
			);
		}
		return array();
	}
}
