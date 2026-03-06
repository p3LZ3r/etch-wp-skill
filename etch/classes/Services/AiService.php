<?php
/**
 * AiService.php
 *
 * Entry point for AI operations. Delegates to the configured provider.
 *
 * PHP version 8.2+
 *
 * @category  Plugin
 * @package   Etch\Services
 */

declare(strict_types=1);

namespace Etch\Services;

use Etch\Helpers\Flag;
use Etch\Services\Ai\AiProviderInterface;
use WP_Error;

/**
 * AiService
 *
 * @phpstan-import-type AiChatMessages from \Etch\Services\Ai\AiProviderInterface
 * @package Etch\Services
 */
class AiService {

	/**
	 * The allowed message roles.
	 *
	 * @var array<string>
	 */
	private const ALLOWED_ROLES = array( 'user', 'assistant' );

	/**
	 * The AI provider instance.
	 *
	 * @var AiProviderInterface
	 */
	private AiProviderInterface $ai_provider;

	/**
	 * Whether AI reasoning is enabled.
	 *
	 * @var bool
	 */
	private bool $reasoning_enabled;

	/**
	 * Constructor.
	 *
	 * @param AiProviderInterface $ai_provider       The AI provider instance.
	 * @param bool|null           $reasoning_enabled Whether reasoning is enabled (defaults to ENABLE_AI_REASONING flag).
	 */
	public function __construct( AiProviderInterface $ai_provider, ?bool $reasoning_enabled = null ) {
		$this->ai_provider       = $ai_provider;
		$this->reasoning_enabled = $reasoning_enabled ?? Flag::is_on( 'ENABLE_AI_REASONING' );
	}

	/**
	 * Generate an AI response.
	 *
	 * @param array $messages The messages to generate an AI response for.
	 *
	 * @phpstan-param array<int, mixed> $messages
	 *
	 * @return array{text: string}|WP_Error The AI response or a WP_Error if the request fails.
	 */
	public function generate_ai_response( array $messages ): array|WP_Error {
		$validated = $this->validate_messages( $messages );
		if ( is_wp_error( $validated ) ) {
			return $validated;
		}

		return $this->ai_provider->provide_ai_response( $validated, array() );
	}

	/**
	 * Stream an AI response.
	 *
	 * @param array         $messages          The messages to generate an AI response for.
	 * @param callable      $on_delta          Function to call for each text delta: function(string $delta): void.
	 * @param callable|null $on_error          Optional function to call on error events: function(array $event): void.
	 * @param callable|null $on_reasoning      Optional function to call for reasoning text: function(string $text): void.
	 * @param callable|null $on_reasoning_done Optional function to call when a reasoning block completes: function(): void.
	 *
	 * @phpstan-param array<int, mixed> $messages
	 *
	 * @return ?WP_Error Returns WP_Error on failure, null on success.
	 */
	public function stream_ai_response( array $messages, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null, ?callable $on_reasoning_done = null ): ?WP_Error {
		$validated = $this->validate_messages( $messages );
		if ( is_wp_error( $validated ) ) {
			return $validated;
		}

		$provider_on_reasoning = null;
		if ( $this->reasoning_enabled && ( null !== $on_reasoning || null !== $on_reasoning_done ) ) {
			$provider_on_reasoning = static function ( ?string $reasoning ) use ( $on_reasoning, $on_reasoning_done ): void {
				if ( null === $reasoning ) {
					if ( null !== $on_reasoning_done ) {
						$on_reasoning_done();
					}
				} elseif ( null !== $on_reasoning ) {
					$on_reasoning( $reasoning );
				}
			};
		}

		return $this->ai_provider->stream_ai_response( $validated, $on_delta, $on_error, $provider_on_reasoning );
	}

	/**
	 * Validate the messages array.
	 *
	 * @param array $messages The messages to validate.
	 *
	 * @phpstan-param array<int, mixed> $messages
	 * @phpstan-return AiChatMessages|WP_Error
	 *
	 * @return array|WP_Error The validated messages or an error.
	 */
	private function validate_messages( array $messages ): array|WP_Error {
		if ( count( $messages ) === 0 ) {
			return new WP_Error( 'etch_ai_invalid_messages', 'At least one message is required.', array( 'status' => 400 ) );
		}

		$validated = array();
		foreach ( $messages as $message ) {
			$result = $this->validate_message( $message );
			if ( is_wp_error( $result ) ) {
				return $result;
			}
			$validated[] = $result;
		}

		return $validated;
	}

	/**
	 * Validate a single message and return its normalized form.
	 *
	 * @param mixed $message The message to validate.
	 * @return array{role: string, content: string}|WP_Error The validated message or an error.
	 */
	private function validate_message( mixed $message ): array|WP_Error {
		if ( ! is_array( $message ) ) {
			return new WP_Error( 'etch_ai_invalid_message', 'Message must be an array.', array( 'status' => 400 ) );
		}

		$role = trim( (string) ( $message['role'] ?? '' ) );
		if ( ! in_array( $role, self::ALLOWED_ROLES, true ) ) {
			return new WP_Error( 'etch_ai_invalid_message', 'Message role must be user or assistant.', array( 'status' => 400 ) );
		}

		$content = $message['content'] ?? null;
		if ( ! is_string( $content ) || '' === trim( $content ) ) {
			return new WP_Error( 'etch_ai_invalid_message', 'Message must have content.', array( 'status' => 400 ) );
		}

		return array(
			'role'    => $role,
			'content' => trim( $content ),
		);
	}
}
