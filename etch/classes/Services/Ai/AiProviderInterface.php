<?php
/**
 * AiProviderInterface.php
 *
 * This file contains the AiProviderInterface interface which defines the methods for an AI provider.
 *
 * @package Etch\Services\Ai
 */

declare(strict_types=1);
namespace Etch\Services\Ai;

use WP_Error;

/**
 * Contract for an AI provider.
 *
 * This interface defines the methods for an AI provider contract.
 *
 * @phpstan-type AiChatMessage array{role: string, content: string}
 * @phpstan-type AiChatMessages array<AiChatMessage>
 *
 * @package Etch\Services\Ai
 */
interface AiProviderInterface {

	/**
	 * Provide an AI response.
	 *
	 * @param array $messages The messages to generate an AI response for.
	 * @param array $options  The options for the AI provider.
	 *
	 * @phpstan-param AiChatMessages $messages
	 * @phpstan-param array<string, mixed> $options
	 * @phpstan-return array{text: string}|WP_Error
	 *
	 * @return array|WP_Error The AI response or a WP_Error if the request fails.
	 */
	public function provide_ai_response( array $messages, array $options = array() ): array|WP_Error;

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
	public function stream_ai_response( array $messages, callable $on_delta, ?callable $on_error = null, ?callable $on_reasoning = null ): ?WP_Error;
}
