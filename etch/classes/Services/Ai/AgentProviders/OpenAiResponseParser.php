<?php
/**
 * OpenAiResponseParser.php
 *
 * Parses OpenAI API responses into a normalized result.
 *
 * @package Etch\Services\Ai\AgentProviders
 */

declare(strict_types=1);

namespace Etch\Services\Ai\AgentProviders;

use WP_Error;

/**
 * OpenAiResponseParser
 *
 * @package Etch\Services\Ai\AgentProviders
 */
class OpenAiResponseParser {

	/**
	 * Parse an OpenAI API response.
	 *
	 * @param int    $status The HTTP status code.
	 * @param string $body   The raw response body.
	 *
	 * @return array{text: string}|WP_Error
	 */
	public function parse( int $status, string $body ): array|WP_Error {
		$data = json_decode( $body, true );

		if ( ! is_array( $data ) ) {
			return new WP_Error( 'etch_ai_invalid_response', 'Invalid response from AI provider', array( 'status' => 502 ) );
		}

		if ( $status < 200 || $status >= 300 ) {
			$provider_message_error = ! empty( $data['error']['message'] ) ? $data['error']['message'] : '';

			return new WP_Error(
				'etch_ai_provider_error',
				"OpenAI Error: Provider request failed. \n\r" . $provider_message_error,
				array(
					'status'   => 502,
					'provider' => $data,
				)
			);
		}

		$text = $data['output_text'] ?? null;
		$output = $data['output'] ?? null;

		if ( null === $text && is_array( $output ) ) {
			$text = $this->extract_output_text( $output );
		}

		if ( ! is_string( $text ) || '' === trim( $text ) ) {
			return new WP_Error(
				'etch_ai_empty_response',
				'Provider returned no text.',
				array(
					'status'   => 502,
					'provider' => $data,
				)
			);
		}

		return array( 'text' => $text );
	}

	/**
	 * Extracts the first output_text value from an array of output items.
	 *
	 * @param array<mixed> $output The output array from the Responses API response.
	 * @return string|null The extracted text, or null if none found.
	 */
	private function extract_output_text( array $output ): ?string {
		foreach ( $output as $item ) {
			if ( ! is_array( $item ) || ( $item['type'] ?? '' ) !== 'message' ) {
				continue;
			}

			$contents = $item['content'] ?? array();
			if ( ! is_array( $contents ) ) {
				continue;
			}

			$text = $this->first_output_text_from_contents( $contents );
			if ( null !== $text ) {
				return $text;
			}
		}

		return null;
	}

	/**
	 * Extracts the first output_text value from an array of content parts.
	 *
	 * @param array<mixed> $contents The content parts array.
	 * @return string|null The extracted text, or null if none found.
	 */
	private function first_output_text_from_contents( array $contents ): ?string {
		foreach ( $contents as $part ) {
			if ( ! is_array( $part ) || ( $part['type'] ?? '' ) !== 'output_text' ) {
				continue;
			}

			$text = $part['text'] ?? null;
			return is_string( $text ) ? $text : null;
		}

		return null;
	}
}
