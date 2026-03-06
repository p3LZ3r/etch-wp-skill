<?php
/**
 * OpenAiStreamEventProcessor.php
 *
 * Routes decoded OpenAI streaming events to the appropriate callbacks.
 *
 * @package Etch\Services\Ai\AgentProviders
 */

declare(strict_types=1);

namespace Etch\Services\Ai\AgentProviders;

/**
 * OpenAiStreamEventProcessor
 *
 * @package Etch\Services\Ai\AgentProviders
 */
class OpenAiStreamEventProcessor {

	/**
	 * Process a streaming event from OpenAI.
	 *
	 * @param array{type?: string, delta?: string, error?: array<string, mixed>} $event        The decoded event.
	 * @param callable                                                           $on_delta     Callback for text deltas.
	 * @param callable|null                                                      $on_error     Optional callback for errors.
	 * @param callable|null                                                      $on_reasoning Optional callback for reasoning.
	 *
	 * @return void
	 */
	public function process( array $event, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null ): void {
		$type = $event['type'] ?? '';

		if ( 'response.output_text.delta' === $type ) {
			$delta = $event['delta'] ?? null;
			if ( is_string( $delta ) && '' !== $delta ) {
				$on_delta( $delta );
			}
		} elseif ( 'response.reasoning_summary_text.delta' === $type && null !== $on_reasoning ) {
			$delta = $event['delta'] ?? null;
			if ( is_string( $delta ) && '' !== $delta ) {
				$on_reasoning( $delta );
			}
		} elseif ( 'response.reasoning_summary_text.done' === $type && null !== $on_reasoning ) {
			$on_reasoning( null );
		} elseif ( 'response.error' === $type && null !== $on_error ) {
			$on_error( $event );
		}
	}
}
