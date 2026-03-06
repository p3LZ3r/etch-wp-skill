<?php
/**
 * FakeAiProvider.php
 *
 * A fake AI provider for testing AiService behavior.
 *
 * @package Etch\Services\Tests
 */

declare(strict_types=1);

namespace Etch\Services\Tests;

use Etch\Services\Ai\AiProviderInterface;
use WP_Error;

/**
 * FakeAiProvider
 *
 * Implements AiProviderInterface with configurable behavior for testing.
 * Configured with deltas/errors to emit, then actually calls the callbacks.
 *
 * @phpstan-import-type AiChatMessages from AiProviderInterface
 */
class FakeAiProvider implements AiProviderInterface {

	/**
	 * The deltas to stream.
	 *
	 * @var array<string>
	 */
	private array $deltas;

	/**
	 * The error to return, if any.
	 *
	 * @var WP_Error|null
	 */
	private ?WP_Error $error;

	/**
	 * Reasoning events to emit (string for text, null for "done").
	 *
	 * @var array<string|null>
	 */
	private array $reasoning_events;

	/**
	 * The messages that were received (for assertion).
	 *
	 * @phpstan-var AiChatMessages|null
	 * @var array|null
	 */
	private ?array $received_messages = null;

	/**
	 * The reasoning callback received by the provider (for assertion).
	 *
	 * @var callable|null|false False means not yet called.
	 */
	private mixed $received_reasoning_callback = false;

	/**
	 * Constructor.
	 *
	 * @param array<string>      $deltas           The deltas to emit when streaming.
	 * @param WP_Error|null      $error            Optional error to return instead of streaming.
	 * @param array<string|null> $reasoning_events Reasoning events to emit (string = text, null = done).
	 */
	public function __construct( array $deltas = array(), ?WP_Error $error = null, array $reasoning_events = array() ) {
		$this->deltas           = $deltas;
		$this->error            = $error;
		$this->reasoning_events = $reasoning_events;
	}

	/**
	 * Provide an AI response.
	 *
	 * @param array $messages The messages.
	 * @param array $options  The options.
	 *
	 * @phpstan-param AiChatMessages $messages
	 * @phpstan-param array<string, mixed> $options
	 *
	 * @return array{text: string}|WP_Error
	 */
	public function provide_ai_response( array $messages, array $options = array() ): array|WP_Error {
		$this->received_messages = $messages;

		if ( null !== $this->error ) {
			return $this->error;
		}

		return array( 'text' => implode( '', $this->deltas ) );
	}

	/**
	 * Stream an AI response.
	 *
	 * @param array         $messages     The messages.
	 * @param callable      $on_delta     The delta callback.
	 * @param callable|null $on_error     The error callback.
	 * @param callable|null $on_reasoning The reasoning callback.
	 *
	 * @phpstan-param AiChatMessages $messages
	 *
	 * @return ?WP_Error
	 */
	public function stream_ai_response( array $messages, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null ): ?WP_Error {
		$this->received_messages          = $messages;
		$this->received_reasoning_callback = $on_reasoning;

		if ( null !== $this->error ) {
			return $this->error;
		}

		foreach ( $this->deltas as $delta ) {
			$on_delta( $delta );
		}

		if ( null !== $on_reasoning ) {
			foreach ( $this->reasoning_events as $event ) {
				$on_reasoning( $event );
			}
		}

		return null;
	}

	/**
	 * Get the messages that were received by the provider.
	 *
	 * @phpstan-return AiChatMessages|null
	 * @return array|null
	 */
	public function get_received_messages(): ?array {
		return $this->received_messages;
	}

	/**
	 * Whether the provider received a non-null reasoning callback.
	 *
	 * @return bool
	 */
	public function received_reasoning_callback(): bool {
		return null !== $this->received_reasoning_callback && false !== $this->received_reasoning_callback;
	}
}
