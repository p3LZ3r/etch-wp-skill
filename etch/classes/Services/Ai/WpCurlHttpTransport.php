<?php
/**
 * WpCurlHttpTransport.php
 *
 * HTTP transport using wp_remote_post for regular requests and cURL for streaming.
 *
 * @package Etch\Services\Ai
 */

declare(strict_types=1);

namespace Etch\Services\Ai;

use WP_Error;

/**
 * WpCurlHttpTransport class.
 *
 * @package Etch\Services\Ai
 */
class WpCurlHttpTransport implements HttpTransport {

	/**
	 * Send a POST request using wp_remote_post.
	 *
	 * @param string                $url     The URL to send the request to.
	 * @param array<string, string> $headers The request headers.
	 * @param string                $body    The request body.
	 *
	 * @return array{status: int, body: string}|WP_Error
	 */
	public function post( string $url, array $headers, string $body ): array|WP_Error {
		$response = wp_remote_post(
			$url,
			array(
				'headers' => $headers,
				'body'    => $body,
				'timeout' => 120,
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return array(
			'status' => (int) wp_remote_retrieve_response_code( $response ),
			'body'   => (string) wp_remote_retrieve_body( $response ),
		);
	}

	/**
	 * Send a streaming POST request using cURL.
	 *
	 * @param string                $url      The URL to send the request to.
	 * @param array<string, string> $headers  The request headers.
	 * @param string                $body     The request body.
	 * @param callable              $on_chunk Callback invoked with each chunk of data.
	 *
	 * @return ?WP_Error Returns WP_Error on failure, null on success.
	 */
	public function stream( string $url, array $headers, string $body, callable $on_chunk ): ?WP_Error {
		$handler = curl_init( $url );
		if ( false === $handler ) {
			return new WP_Error( 'curl_init_failed', 'Failed to initialize cURL handler', array( 'status' => 500 ) );
		}

		$curl_headers = array();
		foreach ( $headers as $key => $value ) {
			$curl_headers[] = $key . ': ' . $value;
		}

		$raw_body = '';

		curl_setopt_array(
			$handler,
			array(
				CURLOPT_POST           => true,
				CURLOPT_HTTPHEADER     => $curl_headers,
				CURLOPT_POSTFIELDS     => $body,
				CURLOPT_RETURNTRANSFER => false,
				CURLOPT_TIMEOUT        => 120,
				CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
				CURLOPT_WRITEFUNCTION  => function ( $curl, string $chunk ) use ( $on_chunk, &$raw_body ) {
					$raw_body .= $chunk;
					$on_chunk( $chunk );
					return strlen( $chunk );
				},
			)
		);

		curl_exec( $handler );

		return $this->check_curl_response( $handler, $raw_body );
	}

	/**
	 * Check for cURL or HTTP errors after executing a request.
	 *
	 * @param \CurlHandle $handler  The cURL handler.
	 * @param string      $raw_body The raw response body.
	 *
	 * @return ?WP_Error Returns WP_Error on failure, null on success.
	 */
	private function check_curl_response( \CurlHandle $handler, string $raw_body ): ?WP_Error {
		$curl_error = curl_error( $handler );
		$http_code  = (int) curl_getinfo( $handler, CURLINFO_HTTP_CODE );

		if ( '' !== $curl_error ) {
			return new WP_Error( 'curl_error', 'cURL error: ' . $curl_error, array( 'status' => 500 ) );
		}

		if ( $http_code >= 400 ) {
			$error_message = sprintf( 'HTTP error: %d', $http_code );

			$decoded = json_decode( $raw_body, true );
			if ( is_array( $decoded ) && isset( $decoded['error'] ) && isset( $decoded['error']['message'] ) ) {
				$error_message = 'OpenAI Error: ' . $decoded['error']['message'];
			}

			return new WP_Error(
				'etch_http_error',
				$error_message,
				array( 'status' => $http_code )
			);
		}

		return null;
	}
}
