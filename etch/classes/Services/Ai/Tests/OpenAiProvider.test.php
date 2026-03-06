<?php
/**
 * OpenAiProviderTest.php
 *
 * @package Etch
 */

declare(strict_types=1);

namespace Etch\Services\Ai\Tests;

use Etch\Services\Ai\AgentProviders\OpenAiProvider;
use WP_UnitTestCase;

/**
 * Class OpenAiProviderTest
 *
 * Tests the OpenAiProvider class through its public API.
 */
class OpenAiProviderTest extends WP_UnitTestCase {

	/**
	 * Test that missing api key error is returned when key is empty.
	 */
	public function test_missing_api_key_error_is_returned_when_key_is_empty(): void {
		$provider = new OpenAiProvider( new FakeHttpTransport(), '' );

		$result = $provider->provide_ai_response( self::one_message() );

		$this->assertSame( 'etch_ai_missing_api_key', $result->get_error_code() );
	}

	/**
	 * Test that text is returned when api responds with output_text.
	 */
	public function test_text_is_returned_when_api_responds_with_output_text(): void {
		$result = $this->provide_with_response( 200, array( 'output_text' => 'Hello world' ) );

		$this->assertSame( array( 'text' => 'Hello world' ), $result );
	}

	/**
	 * Test that provider error is returned when api responds with non-2xx status.
	 */
	public function test_provider_error_is_returned_when_api_responds_with_non_2xx(): void {
		$result = $this->provide_with_response(
			429,
			array( 'error' => array( 'message' => 'Rate limit exceeded' ) )
		);

		$this->assertWPError( $result );
	}

	/**
	 * Test that transport error is returned when http request fails.
	 */
	public function test_transport_error_is_returned_when_http_request_fails(): void {
		$transport = new FakeHttpTransport(
			new \WP_Error( 'http_request_failed', 'Connection timed out' )
		);
		$provider = new OpenAiProvider( $transport, 'test-key' );

		$result = $provider->provide_ai_response( self::one_message() );

		$this->assertSame( 'http_request_failed', $result->get_error_code() );
	}

	/**
	 * Test that text is extracted from nested output when output_text key is absent.
	 */
	public function test_text_is_extracted_from_nested_output_when_output_text_is_absent(): void {
		$result = $this->provide_with_response(
			200,
			array(
				'output' => array(
					array(
						'type'    => 'message',
						'content' => array(
							array(
								'type' => 'output_text',
								'text' => 'Nested text',
							),
						),
					),
				),
			)
		);

		$this->assertSame( array( 'text' => 'Nested text' ), $result );
	}

	/**
	 * Test that error is returned when api responds with invalid json.
	 */
	public function test_error_is_returned_when_api_responds_with_invalid_json(): void {
		$transport = new FakeHttpTransport(
			array(
				'status' => 200,
				'body'   => 'not json',
			)
		);
		$provider = new OpenAiProvider( $transport, 'test-key' );

		$result = $provider->provide_ai_response( self::one_message() );

		$this->assertWPError( $result );
	}

	/**
	 * Test that error is returned when api responds with no text.
	 */
	public function test_error_is_returned_when_api_responds_with_no_text(): void {
		$result = $this->provide_with_response( 200, array( 'output' => array() ) );

		$this->assertWPError( $result );
	}

	/**
	 * Test that error is returned when api responds with whitespace only text.
	 */
	public function test_error_is_returned_when_api_responds_with_whitespace_only_text(): void {
		$result = $this->provide_with_response( 200, array( 'output_text' => '   ' ) );

		$this->assertWPError( $result );
	}

	/**
	 * Test that deltas are streamed when stream receives sse chunks.
	 */
	public function test_deltas_are_streamed_when_stream_receives_sse_chunks(): void {
		$deltas = array();

		$this->stream_with_chunks(
			array(
				"data: {\"type\":\"response.output_text.delta\",\"delta\":\"Hello\"}\n\n",
				"data: {\"type\":\"response.output_text.delta\",\"delta\":\" world\"}\n\n",
			),
			function ( string $delta ) use ( &$deltas ) {
				$deltas[] = $delta;
			}
		);

		$this->assertSame( array( 'Hello', ' world' ), $deltas );
	}

	/**
	 * Test that missing api key error is returned when streaming with empty key.
	 */
	public function test_missing_api_key_error_is_returned_when_streaming_with_empty_key(): void {
		$provider = new OpenAiProvider( new FakeHttpTransport(), '' );

		$result = $provider->stream_ai_response( self::one_message(), function () {} );

		$this->assertSame( 'etch_ai_missing_api_key', $result->get_error_code() );
	}

	/**
	 * Test that empty messages error is returned when streaming with no messages.
	 */
	public function test_empty_messages_error_is_returned_when_streaming_with_no_messages(): void {
		$provider = new OpenAiProvider( new FakeHttpTransport(), 'test-key' );

		$result = $provider->stream_ai_response( array(), function () {} );

		$this->assertSame( 'etch_ai_invalid_messages', $result->get_error_code() );
	}

	/**
	 * Test that transport error is returned when stream fails.
	 */
	public function test_transport_error_is_returned_when_stream_fails(): void {
		$transport = new FakeHttpTransport(
			array(
				'status' => 200,
				'body'   => '',
			),
			array(),
			new \WP_Error( 'curl_error', 'Connection reset' )
		);
		$provider = new OpenAiProvider( $transport, 'test-key' );

		$result = $provider->stream_ai_response( self::one_message(), function () {} );

		$this->assertSame( 'curl_error', $result->get_error_code() );
	}

	/**
	 * Test that null is returned when streaming succeeds.
	 */
	public function test_null_is_returned_when_streaming_succeeds(): void {
		$result = $this->stream_with_chunks(
			array( "data: {\"type\":\"response.output_text.delta\",\"delta\":\"Hi\"}\n\n" )
		);

		$this->assertNull( $result );
	}

	/**
	 * A single user message for tests that just need valid input.
	 *
	 * @return array<int, array{role: string, content: string}>
	 */
	private static function one_message(): array {
		return array(
			array(
				'role'    => 'user',
				'content' => 'Hello',
			),
		);
	}

	/**
	 * Helper: call provide_ai_response with a canned JSON response.
	 *
	 * @param int                  $status The HTTP status code.
	 * @param array<string, mixed> $data   The response data to JSON-encode.
	 *
	 * @return array|WP_Error
	 */
	private function provide_with_response( int $status, array $data ) {
		$transport = new FakeHttpTransport(
			array(
				'status' => $status,
				'body'   => wp_json_encode( $data ),
			)
		);
		$provider = new OpenAiProvider( $transport, 'test-key' );

		return $provider->provide_ai_response( self::one_message() );
	}

	/**
	 * Helper: call stream_ai_response with canned SSE chunks.
	 *
	 * @param array<string> $chunks   The SSE chunks to feed.
	 * @param callable|null $on_delta Optional delta callback.
	 *
	 * @return ?WP_Error
	 */
	private function stream_with_chunks( array $chunks, ?callable $on_delta = null ): ?\WP_Error {
		$transport = new FakeHttpTransport(
			array(
				'status' => 200,
				'body'   => '',
			),
			$chunks
		);
		$provider = new OpenAiProvider( $transport, 'test-key' );

		return $provider->stream_ai_response( self::one_message(), $on_delta ?? function () {} );
	}
}
