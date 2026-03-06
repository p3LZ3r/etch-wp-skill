<?php
/**
 * AiRoutesTest.php
 *
 * @package Etch
 */

declare(strict_types=1);

namespace Etch\RestApi\Routes\Tests;

use Etch\RestApi\Routes\AiRoutes;
use Etch\Services\AiService;
use Etch\Services\Tests\FakeAiProvider;
use WP_REST_Request;
use WP_UnitTestCase;

/**
 * Class AiRoutesTest
 *
 * Tests the AiRoutes class through its public endpoint methods.
 */
class AiRoutesTest extends WP_UnitTestCase {

	/**
	 * Test that error is returned when messages key is missing.
	 */
	public function test_error_is_returned_when_messages_key_is_missing(): void {
		$routes = $this->create_routes();

		$result = $routes->generate_ai_response( self::json_request( array() ) );

		$this->assertWPError( $result );
		$this->assertSame( 'etch_ai_invalid_messages', $result->get_error_code() );
	}

	/**
	 * Test that error is returned when messages is not an array.
	 */
	public function test_error_is_returned_when_messages_is_not_an_array(): void {
		$routes = $this->create_routes();

		$result = $routes->generate_ai_response( self::json_request( array( 'messages' => 'not-an-array' ) ) );

		$this->assertWPError( $result );
		$this->assertSame( 'etch_ai_invalid_messages', $result->get_error_code() );
	}

	/**
	 * Test that response contains message text when provider succeeds.
	 */
	public function test_response_contains_message_text_when_provider_succeeds(): void {
		$provider = new FakeAiProvider( array( 'Hello world' ) );
		$routes   = $this->create_routes( $provider );

		$result = $routes->generate_ai_response( self::json_request( self::valid_body() ) );

		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( array( 'message' => 'Hello world' ), $result->get_data() );
	}

	/**
	 * Test that wp error is forwarded when service fails.
	 */
	public function test_wp_error_is_forwarded_when_service_fails(): void {
		$provider = new FakeAiProvider( array(), new \WP_Error( 'provider_fail', 'Something broke' ) );
		$routes   = $this->create_routes( $provider );

		$result = $routes->generate_ai_response( self::json_request( self::valid_body() ) );

		$this->assertWPError( $result );
		$this->assertSame( 'provider_fail', $result->get_error_code() );
	}

	/**
	 * Test that stream sends json error when messages key is missing.
	 */
	public function test_stream_sends_json_error_when_messages_key_is_missing(): void {
		$emitter = $this->stream_with_body( array() );

		$this->assertSame( 400, $emitter->error_response['status'] );
	}

	/**
	 * Test that emitter is not started when stream validation fails.
	 */
	public function test_emitter_is_not_started_when_stream_validation_fails(): void {
		$emitter = $this->stream_with_body( array() );

		$this->assertFalse( $emitter->started );
	}

	/**
	 * Test that stream emits deltas when provider succeeds.
	 */
	public function test_stream_emits_deltas_when_provider_succeeds(): void {
		$emitter = $this->stream_with_body(
			self::valid_body(),
			new FakeAiProvider( array( 'Hello', ' world' ) )
		);

		$delta_texts = array_map(
			fn( $e ) => $e['data']['text'],
			array_values(
				array_filter( $emitter->events, fn( $e ) => 'delta' === $e['event'] )
			)
		);

		$this->assertSame( array( 'Hello', ' world' ), $delta_texts );
	}

	/**
	 * Test that stream emits error when provider fails.
	 */
	public function test_stream_emits_error_when_provider_fails(): void {
		$provider = new FakeAiProvider( array(), new \WP_Error( 'fail', 'Boom' ) );
		$emitter  = $this->stream_with_body( self::valid_body(), $provider );

		$error_events = array_values(
			array_filter( $emitter->events, fn( $e ) => 'error' === $e['event'] )
		);

		$this->assertSame( 'Boom', $error_events[0]['data']['message'] );
	}

	/**
	 * Test that done event is always last when stream completes.
	 */
	public function test_done_event_is_always_last_when_stream_completes(): void {
		$emitter = $this->stream_with_body(
			self::valid_body(),
			new FakeAiProvider( array( 'Hi' ) )
		);

		$last = end( $emitter->events );
		$this->assertSame( 'done', $last['event'] );
	}

	/**
	 * Create an AiRoutes instance with an optional FakeAiProvider.
	 *
	 * @param FakeAiProvider|null $provider Optional fake provider.
	 *
	 * @return AiRoutes
	 */
	private function create_routes( ?FakeAiProvider $provider = null ): AiRoutes {
		$provider = $provider ?? new FakeAiProvider();

		return new AiRoutes( new AiService( $provider ) );
	}

	/**
	 * Create a WP_REST_Request with a JSON body.
	 *
	 * @param array<string, mixed> $body The body data.
	 *
	 * @return WP_REST_Request
	 */
	private static function json_request( array $body ): WP_REST_Request {
		$request = new WP_REST_Request( 'POST' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body( wp_json_encode( $body ) );

		return $request;
	}

	/**
	 * Helper: stream a request and return the fake emitter for assertions.
	 *
	 * @param array<string, mixed> $body     The request body.
	 * @param FakeAiProvider|null  $provider Optional fake provider.
	 *
	 * @return FakeServerSideEventEmitter
	 */
	private function stream_with_body( array $body, ?FakeAiProvider $provider = null ): FakeServerSideEventEmitter {
		$routes  = $this->create_routes( $provider );
		$emitter = new FakeServerSideEventEmitter();

		$routes->handle_stream( self::json_request( $body ), $emitter );

		return $emitter;
	}

	/**
	 * A valid request body with one user message.
	 *
	 * @return array<string, mixed>
	 */
	private static function valid_body(): array {
		return array(
			'messages' => array(
				array(
					'role'    => 'user',
					'content' => 'Hello',
				),
			),
		);
	}
}
