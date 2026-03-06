<?php
/**
 * AiServiceTest.php
 *
 * @package Etch
 */

declare(strict_types=1);

namespace Etch\Services\Tests;

use Etch\Services\AiService;
use WP_UnitTestCase;

/**
 * Class AiServiceTest
 *
 * Tests the AiService class.
 */
class AiServiceTest extends WP_UnitTestCase {

	/**
	 * Test that passing an empty array returns an error.
	 */
	public function test_passing_empty_array_returns_error(): void {
		$ai_service = new AiService( new FakeAiProvider() );

		$result = $ai_service->generate_ai_response( array() );

		$this->assertEquals( 'etch_ai_invalid_messages', $result->get_error_code() );
	}

	/**
	 * Test that deltas are streamed when sending a message.
	 */
	public function test_deltas_are_streamed_when_sending_a_message(): void {
		$ai_service = new AiService( new FakeAiProvider( array( 'Hello', ', world!' ) ) );

		$deltas = array();
		$ai_service->stream_ai_response(
			self::one_message(),
			function ( string $delta ) use ( &$deltas ) {
				$deltas[] = $delta;
			}
		);

		$this->assertSame( array( 'Hello', ', world!' ), $deltas );
	}

	/**
	 * Test that all messages are forwarded to provider when streaming.
	 */
	public function test_all_messages_are_forwarded_to_provider_when_streaming(): void {
		$provider   = new FakeAiProvider( array( 'ok' ) );
		$ai_service = new AiService( $provider );

		$messages = array(
			array(
				'role' => 'user',
				'content' => 'first question',
			),
			array(
				'role' => 'assistant',
				'content' => 'first answer',
			),
			array(
				'role' => 'user',
				'content' => '  second question  ',
			),
		);

		$ai_service->stream_ai_response( $messages, function () {} );

		$this->assertSame(
			array(
				array(
					'role' => 'user',
					'content' => 'first question',
				),
				array(
					'role' => 'assistant',
					'content' => 'first answer',
				),
				array(
					'role' => 'user',
					'content' => 'second question',
				),
			),
			$provider->get_received_messages()
		);
	}

	/**
	 * Test that validation error is returned when content is whitespace only.
	 */
	public function test_validation_error_is_returned_when_content_is_whitespace_only(): void {
		$result = $this->stream_with_message( 'user', '   ' );

		$this->assertWPError( $result );
	}

	/**
	 * Test that provider is not called when validation fails.
	 */
	public function test_provider_is_not_called_when_validation_fails(): void {
		$provider   = new FakeAiProvider();
		$ai_service = new AiService( $provider );

		$ai_service->stream_ai_response(
			array(
				array(
					'role' => 'hacker',
					'content' => 'Hello',
				),
			),
			function () {}
		);

		$this->assertNull( $provider->get_received_messages() );
	}

	/**
	 * Test that validation error is returned when message is invalid.
	 */
	public function test_validation_error_is_returned_when_message_is_invalid(): void {
		$result = $this->stream_with_message( 'hacker', 'Hello' );

		$this->assertWPError( $result );
		$this->assertSame( 'etch_ai_invalid_message', $result->get_error_code() );
	}

	/**
	 * Test that reasoning callback is null for provider when reasoning is disabled.
	 */
	public function test_reasoning_callback_is_null_for_provider_when_reasoning_is_disabled(): void {
		$provider   = new FakeAiProvider( array( 'ok' ) );
		$ai_service = new AiService( $provider, false );

		$ai_service->stream_ai_response(
			self::one_message(),
			function () {},
			null,
			function () {},
			function () {},
		);

		$this->assertFalse( $provider->received_reasoning_callback() );
	}

	/**
	 * Test that reasoning text reaches caller when reasoning is enabled.
	 */
	public function test_reasoning_text_reaches_caller_when_reasoning_is_enabled(): void {
		$result = $this->stream_with_reasoning( array( 'Thinking...' ) );

		$this->assertSame( array( 'Thinking...' ), $result['reasoning'] );
	}

	/**
	 * Test that reasoning done reaches caller when reasoning is enabled.
	 */
	public function test_reasoning_done_reaches_caller_when_reasoning_is_enabled(): void {
		$result = $this->stream_with_reasoning( array( null ) );

		$this->assertTrue( $result['done'] );
	}

	/**
	 * Test that provider error is returned when streaming fails.
	 */
	public function test_provider_error_is_returned_when_streaming_fails(): void {
		$result = $this->stream_with_message(
			'user',
			'Hello',
			new \WP_Error( 'provider_fail', 'API rate limit exceeded' ),
		);

		$this->assertWPError( $result );
		$this->assertSame( 'API rate limit exceeded', $result->get_error_message() );
	}

	/**
	 * A single valid user message.
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
	 * Helper: stream with reasoning enabled, return captured reasoning text and done flag.
	 *
	 * @param array<string|null> $reasoning_events Events the fake provider should emit.
	 *
	 * @return array{reasoning: array<string>, done: bool}
	 */
	private function stream_with_reasoning( array $reasoning_events ): array {
		$ai_service = new AiService( new FakeAiProvider( array( 'ok' ), null, $reasoning_events ), true );

		$reasoning = array();
		$done      = false;

		$ai_service->stream_ai_response(
			self::one_message(),
			function () {},
			null,
			function ( string $text ) use ( &$reasoning ) {
				$reasoning[] = $text;
			},
			function () use ( &$done ) {
				$done = true;
			},
		);

		return array(
			'reasoning' => $reasoning,
			'done'      => $done,
		);
	}

	/**
	 * Helper: stream a single message with a given role/content, return result.
	 *
	 * @param string         $role           Message role.
	 * @param string         $content        Message content.
	 * @param \WP_Error|null $provider_error Optional error the provider should return.
	 * @return mixed The result from stream_ai_response.
	 */
	private function stream_with_message( string $role, string $content, ?\WP_Error $provider_error = null ) {
		$ai_service = new AiService( new FakeAiProvider( array(), $provider_error ) );

		return $ai_service->stream_ai_response(
			array(
				array(
					'role' => $role,
					'content' => $content,
				),
			),
			function () {}
		);
	}
}
