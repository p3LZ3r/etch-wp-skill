<?php
/**
 * OpenAiStreamEventProcessorTest.php
 *
 * @package Etch
 */

declare(strict_types=1);

namespace Etch\Services\Ai\Tests;

use Etch\Services\Ai\AgentProviders\OpenAiStreamEventProcessor;
use WP_UnitTestCase;

/**
 * Class OpenAiStreamEventProcessorTest
 *
 * Tests the OpenAiStreamEventProcessor class.
 */
class OpenAiStreamEventProcessorTest extends WP_UnitTestCase {

	/**
	 * Test that on_delta is called when text delta event received.
	 */
	public function test_on_delta_is_called_when_text_delta_event_received(): void {
		$processor = new OpenAiStreamEventProcessor();
		$received = array();

		$processor->process(
			array(
				'type'  => 'response.output_text.delta',
				'delta' => 'Hello world',
			),
			function ( string $delta ) use ( &$received ) {
				$received[] = $delta;
			}
		);

		$this->assertSame( array( 'Hello world' ), $received );
	}

	/**
	 * Test that empty delta is ignored when text delta has empty string.
	 */
	public function test_empty_delta_is_ignored_when_text_delta_has_empty_string(): void {
		$processor = new OpenAiStreamEventProcessor();
		$received = array();

		$processor->process(
			array(
				'type'  => 'response.output_text.delta',
				'delta' => '',
			),
			function ( string $delta ) use ( &$received ) {
				$received[] = $delta;
			}
		);

		$this->assertEmpty( $received );
	}

	/**
	 * Test that on_reasoning is called when reasoning delta event received.
	 */
	public function test_on_reasoning_is_called_when_reasoning_delta_event_received(): void {
		$processor = new OpenAiStreamEventProcessor();
		$received = array();

		$processor->process(
			array(
				'type'  => 'response.reasoning_summary_text.delta',
				'delta' => 'Thinking',
			),
			function () {},
			null,
			function ( $reasoning ) use ( &$received ) {
				$received[] = $reasoning;
			}
		);

		$this->assertSame( array( 'Thinking' ), $received );
	}

	/**
	 * Test that on_reasoning is called with null when reasoning done event received.
	 */
	public function test_on_reasoning_receives_null_when_reasoning_done_event_received(): void {
		$processor = new OpenAiStreamEventProcessor();
		$received = array();

		$processor->process(
			array( 'type' => 'response.reasoning_summary_text.done' ),
			function () {},
			null,
			function ( $reasoning ) use ( &$received ) {
				$received[] = $reasoning;
			}
		);

		$this->assertSame( array( null ), $received );
	}

	/**
	 * Test that on_error is called when error event received.
	 */
	public function test_on_error_is_called_when_error_event_received(): void {
		$processor = new OpenAiStreamEventProcessor();
		$received = array();

		$event = array(
			'type'  => 'response.error',
			'error' => array( 'message' => 'API error' ),
		);

		$processor->process(
			$event,
			function () {},
			function ( $error ) use ( &$received ) {
				$received[] = $error;
			}
		);

		$this->assertSame( array( $event ), $received );
	}
}
