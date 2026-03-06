<?php
/**
 * AiRoutes.php
 *
 * This file contains the AiRoutes class which defines REST API routes for handling AI-related functionality.
 *
 * PHP version 8.2+
 *
 * @category  Plugin
 * @package   Etch\RestApi\Routes
 */

declare(strict_types=1);
namespace Etch\RestApi\Routes;

use Etch\RestApi\Routes\BaseRoute;
use Etch\RestApi\ServerSideEventEmitter;
use Etch\Services\Ai\AgentProviders\OpenAiProvider;
use Etch\Services\AiService;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * AiRoutes
 *
 * This class defines REST API endpoints for AI-related functionality.
 *
 * @package Etch\RestApi\Routes
 */
class AiRoutes extends BaseRoute {

	/**
	 * The AI service instance.
	 *
	 * @var AiService
	 */
	private AiService $ai_service;

	/**
	 * Constructor.
	 *
	 * @param AiService|null $ai_service Optional service instance for dependency injection.
	 */
	public function __construct( ?AiService $ai_service = null ) {
		$this->ai_service = $ai_service ?? new AiService( new OpenAiProvider() );
	}


	/**
	 * Returns the route definitions for AI endpoints.
	 *
	 * @return array<array{route: string, methods: string|array<string>, callback: callable, permission_callback?: callable, args?: array<string, mixed>}>
	 */
	protected function get_routes(): array {
		return array(
			// Note: this endpoint is not used by the frontend (streaming is used instead).
			array(
				'route' => '/ai-chat/message',
				'methods' => 'POST',
				'callback' => array( $this, 'generate_ai_response' ),
				'permission_callback' => fn() => $this->has_etch_read_api_access(),
			),
			array(
				'route' => '/ai-chat/stream',
				'methods' => 'POST',
				'callback' => array( $this, 'stream_handler' ),
				'permission_callback' => fn() => $this->has_etch_read_api_access(),
			),
		);
	}

	/**
	 * Generate an AI response.
	 *
	 * @param WP_REST_Request $request The REST request.
	 *
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 *
	 * @return WP_REST_Response|WP_Error The AI response or a WP_Error if the request fails.
	 */
	public function generate_ai_response( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$messages = $this->get_messages_from_request( $request );
		if ( is_wp_error( $messages ) ) {
			return $messages;
		}

		$result = $this->ai_service->generate_ai_response( $messages );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return new WP_REST_Response(
			array(
				'message' => $result['text'],
			),
			200
		);
	}

	/**
	 * Handle streaming an AI response.
	 *
	 * @param WP_REST_Request $request The REST request.
	 *
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 *
	 * @return void
	 */
	public function stream_handler( WP_REST_Request $request ): void {
		$this->handle_stream( $request, new ServerSideEventEmitter() );
		exit;
	}

	/**
	 * Stream orchestration — testable, no I/O.
	 *
	 * @param WP_REST_Request        $request The REST request.
	 * @param ServerSideEventEmitter $emitter The SSE emitter.
	 *
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 *
	 * @return void
	 */
	public function handle_stream( WP_REST_Request $request, ServerSideEventEmitter $emitter ): void {
		$messages = $this->get_messages_from_request( $request );
		if ( is_wp_error( $messages ) ) {
			$error_data  = $messages->get_error_data();
			$status_code = ( is_array( $error_data ) && isset( $error_data['status'] ) ) ? (int) $error_data['status'] : 400;
			$emitter->send_error( $messages->get_error_message(), $status_code );
			return;
		}

		$emitter->start();

		$error = $this->ai_service->stream_ai_response(
			$messages,
			function ( string $delta ) use ( $emitter ) {
				$emitter->emit( 'delta', array( 'text' => $delta ) );
			},
			function ( array $evt ) use ( $emitter ) {
				$emitter->emit( 'error', array( 'provider' => $evt ) );
			},
			function ( string $reasoning ) use ( $emitter ) {
				$emitter->emit( 'reasoning', array( 'text' => $reasoning ) );
			},
			function () use ( $emitter ) {
				$emitter->emit( 'reasoning_done', array() );
			},
		);

		if ( is_wp_error( $error ) ) {
			$emitter->emit( 'error', array( 'message' => $error->get_error_message() ) );
		}

		$emitter->emit( 'done', array() );
	}

	/**
	 * Extract the messages array from the request body.
	 *
	 * Only checks request structure — domain validation is handled by AiService.
	 *
	 * @param WP_REST_Request $request The request.
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 * @return array<int, mixed>|WP_Error The messages array or an error if the request structure is invalid.
	 */
	private function get_messages_from_request( WP_REST_Request $request ): array|WP_Error {
		$body = $request->get_json_params();

		if ( ! is_array( $body ) ) {
			return new WP_Error( 'etch_ai_invalid_body', 'Invalid request body.', array( 'status' => 400 ) );
		}

		$messages = $body['messages'] ?? null;
		if ( ! is_array( $messages ) ) {
			return new WP_Error( 'etch_ai_invalid_messages', 'Messages are required.', array( 'status' => 400 ) );
		}

		return $messages;
	}
}
