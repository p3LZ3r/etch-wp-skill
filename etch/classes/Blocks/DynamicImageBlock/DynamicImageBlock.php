<?php
/**
 * Dynamic Image Block
 *
 * Renders image elements with dynamic attributes and context support.
 * Specialized version of ElementBlock for image rendering with tag fixed to 'img'.
 * Resolves dynamic expressions in image attributes.
 *
 * @package Etch
 */

namespace Etch\Blocks\DynamicImageBlock;

use Etch\Blocks\Types\ElementAttributes;
use Etch\Blocks\Global\StylesRegister;
use Etch\Blocks\Global\ScriptRegister;
use Etch\Blocks\Global\DynamicContent\DynamicContextProvider;
use Etch\Blocks\Global\Utilities\DynamicContentProcessor;
use Etch\Blocks\Utilities\EtchTypeAsserter;
use Etch\Blocks\Utilities\ShortcodeProcessor;
use Etch\Helpers\SvgLoader;

/**
 * DynamicImageBlock class
 *
 * Handles rendering of etch/dynamic-image blocks with image-specific functionality.
 * Supports dynamic expression resolution in image attributes (e.g., {this.title}, {props.value}).
 */
class DynamicImageBlock {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Register the block
	 *
	 * @return void
	 */
	public function register_block() {
		register_block_type(
			'etch/dynamic-image',
			array(
				'api_version' => '3',
				'attributes' => array(
					'tag' => array(
						'type' => 'string',
						'default' => 'img', // Tag is always 'img' for DynamicImage blocks
					),
					'attributes' => array(
						'type' => 'object',
						'default' => array(),
					),
					'styles' => array(
						'type' => 'array',
						'default' => array(),
						'items' => array(
							'type' => 'string',
						),
					),
				),
				'supports' => array(
					'html' => false,
					'className' => false,
					'customClassName' => false,
					// '__experimentalNoWrapper' => true,
					'innerBlocks' => true,
				),
				'render_callback' => array( $this, 'render_block' ),
				'skip_inner_blocks' => true,
			)
		);
	}

	/**
	 * Render the block
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content Block content (not used for SVG blocks).
	 * @param \WP_Block|null       $block WP_Block instance (contains context).
	 * @return string Rendered block HTML.
	 */
	public function render_block( $attributes, $content, $block = null ) {
		$attrs = ElementAttributes::from_array( $attributes );

		ScriptRegister::register_script( $attrs );

		$DEFAULT_IMAGE_URL = 'https://placehold.co/1920x1080';

		$resolved_attributes = $this->resolve_dynamic_attributes( $attrs, $block );

		// Register styles (original + dynamic) after EtchParser processing
		StylesRegister::register_block_styles( $attrs->styles ?? array(), $attrs->attributes, $resolved_attributes );

		$resolved_attributes = $this->process_shortcodes( $resolved_attributes );

		// Extract mediaId from resolved attributes
		$media_id = $resolved_attributes['mediaId'] ?? null;

		// Remove Etch-related props from attributes
		$image_attributes = $this->remove_etch_related_props( $resolved_attributes );

		// Build attribute string for merging with fetched image
		$attribute_string = '';
		foreach ( $image_attributes as $name => $value ) {
			$attribute_string .= sprintf( ' %s="%s"', esc_attr( $name ), esc_attr( EtchTypeAsserter::to_string( $value ) ) );
		}

		// No mediaId provided, return <img> with attributes as is
		if ( empty( $media_id ) ) {
			// add default src if none provided
			if ( ! array_key_exists( 'src', $image_attributes ) ) {
				$attribute_string .= sprintf( ' src="%s"', esc_attr( $DEFAULT_IMAGE_URL ) );
			}
			return '<img' . $attribute_string . ' />';
		}
		// Here we are sure to have a mediaId, so we can remove the src attribute if provided to avoid conflicts
		unset( $image_attributes['src'] );

		// Ensure mediaId is a string
		$media_id = is_string( $media_id ) ? $media_id : '';

		// Get image from media library
		$attachment = wp_get_attachment_metadata( intval( $media_id ) );

		// If no attachment found, return empty img tag
		if ( empty( $attachment ) ) {
			return '<img/>';
		}

		// Check for useSrcSet option
		$use_source_set = true;
		if ( ! empty( $resolved_attributes['useSrcSet'] ) ) {
			$use_source_set = in_array( $resolved_attributes['useSrcSet'], array( 'true', '1', 'yes', 'on' ), true );
		}

		// Check for maximumSize option and use 'full' as default
		$maximum_size = 'full';
		if ( isset( $resolved_attributes['maximumSize'] ) && is_string( $resolved_attributes['maximumSize'] ) ) {
			$maximum_size = $resolved_attributes['maximumSize'];
		}

		$maximum_image_src = '';
		if ( false !== wp_get_attachment_image_src( intval( $media_id ), $maximum_size ) ) {
			$maximum_image_src = wp_get_attachment_image_src( intval( $media_id ), $maximum_size )[0];
		}

		$special_attribute_string = '';

		// Skip srcset generation if useSrcSet is false or full size has no width (e.g. on an svg)
		// TODO: remove phpstan ignore line when we have a proper type for the attachment array
		if ( $use_source_set && isset( $attachment['width'] ) && $attachment['width'] ) { // @phpstan-ignore-line
			$srcset = '';
			$image_sizes = $attachment['sizes'];
			$full_image_src = '';
			if ( false !== wp_get_attachment_image_src( intval( $media_id ), 'full' ) ) {
				$full_image_src = wp_get_attachment_image_src( intval( $media_id ), 'full' )[0];
			}

			// build srcset from available sizes - "full" is not in there like in the API response so we need to handle it separately
			// first add the full size if it is smaller than or equal to maximumSize and set sizes attribute accordingly
			if ( isset( $attachment['sizes'][ $maximum_size ] ) ) {

				$max_width = $attachment['sizes'][ $maximum_size ]['width'];
				if ( $attachment['width'] <= $max_width ) {

					$srcset .= $full_image_src . ' ' . $attachment['width'] . 'w, ';

				}

				$sizes = sprintf( '(max-width: %dpx) 100vw, %dpx', esc_attr( (string) $max_width ), esc_attr( (string) $max_width ) );
				$special_attribute_string .= sprintf( ' sizes="%s"', esc_attr( $sizes ) );
			} else {
				$srcset .= $full_image_src . ' ' . $attachment['width'] . 'w, ';
				$sizes = sprintf( '(max-width: %dpx) 100vw, %dpx', esc_attr( (string) $attachment['width'] ), esc_attr( (string) $attachment['width'] ) );
				$special_attribute_string .= sprintf( ' sizes="%s"', esc_attr( $sizes ) );
			}

			// then add other sizes
			foreach ( $image_sizes as $size_name => $size_data ) {

				// only add images smaller than or equal to maximumSize
				if ( isset( $attachment['sizes'][ $maximum_size ] ) ) {
					$max_width = $attachment['sizes'][ $maximum_size ]['width'];
					if ( $size_data['width'] > $max_width ) {
						continue;
					}
				}

				if ( false === wp_get_attachment_image_src( intval( $media_id ), $size_name ) ) {
					continue;
				}

				$srcset .= wp_get_attachment_image_src( intval( $media_id ), $size_name )[0] . ' ' . $size_data['width'] . 'w, ';
			}

			$srcset = rtrim( $srcset, ', ' );

			$special_attribute_string .= sprintf( ' srcset="%s"', esc_attr( $srcset ) );

		}

		// Always set src to the selected maximum_size
		$src = $maximum_image_src;

		$special_attribute_string .= sprintf( ' src="%s"', esc_attr( $src ) );

		if ( ! $this->has_user_set_alt_attribute( $image_attributes ) ) {
			$special_attribute_string .= $this->get_alt_text_from_media_library( (int) $media_id );
		}

		$special_attribute_string .= $this->maybe_add_dimensions( (int) $media_id, $image_attributes, (string) $maximum_size );

		return '<img ' . $special_attribute_string . $attribute_string . ' />';
	}

	/**
	 * Resolve dynamic attributes from context
	 *
	 * @param ElementAttributes $attrs Block attributes.
	 * @param \WP_Block|null    $block WP_Block instance.
	 * @return array<string, mixed> Resolved attributes.
	 */
	private function resolve_dynamic_attributes( ElementAttributes $attrs, $block ) {
		$resolved_attributes = $attrs->attributes;
		$sources = DynamicContextProvider::get_sources_for_wp_block( $block );

		if ( empty( $sources ) ) {
			return $resolved_attributes;
		}
		$resolved_attributes = DynamicContentProcessor::resolve_attributes( $resolved_attributes, array( 'sources' => $sources ) );

		return $resolved_attributes;
	}

	/**
	 * Process shortcodes in attribute values
	 *
	 * @param array<string, mixed> $attributes Attributes to process.
	 * @return array<string, mixed> Processed attributes.
	 */
	private function process_shortcodes( array $attributes ) {
		foreach ( $attributes as $name => $value ) {
			$string_value = EtchTypeAsserter::to_string( $value );
			$attributes[ $name ] = ShortcodeProcessor::process( $string_value, 'etch/dynamic-image' );
		}
		return $attributes;
	}

	/**
	 * Maybe add width and height attributes
	 *
	 * @param int                  $media_id Media attachment ID.
	 * @param array<string, mixed> $attributes Image attributes.
	 * @param string               $size Image size name.
	 * @return string Attribute string.
	 */
	private function maybe_add_dimensions( int $media_id, array $attributes, string $size ) {
		$attrs = '';
		$src_data = wp_get_attachment_image_src( $media_id, $size );

		if ( ! $src_data ) {
			return '';
		}

		if ( ! array_key_exists( 'width', $attributes ) && $src_data[1] ) {
			$attrs .= sprintf( ' width="%d"', (int) $src_data[1] );
		}

		if ( ! array_key_exists( 'height', $attributes ) && $src_data[2] ) {
			$attrs .= sprintf( ' height="%d"', (int) $src_data[2] );
		}

		return $attrs;
	}

	/**
	 * Check if the user has set the alt attribute
	 *
	 * @param array<string, mixed> $attributes Attributes array.
	 * @return bool True if the user has set the alt attribute.
	 */
	private function has_user_set_alt_attribute( array $attributes ): bool {
		return array_key_exists( 'alt', $attributes );
	}

	/**
	 * Get alt text from media library
	 *
	 * @param int $media_id Media attachment ID.
	 * @return string Alt text or empty string if no alt.
	 */
	private function get_alt_text_from_media_library( int $media_id ): string {
		$alt_text = get_post_meta( $media_id, '_wp_attachment_image_alt', true );

		// we are returning the alt text value, if there is no value, we return an empty string
		if ( empty( $alt_text ) || ! is_string( $alt_text ) ) {
			return '';
		}

		$alt_text_value = esc_attr( $alt_text );
		$alt_attribute = sprintf( ' alt="%s"', $alt_text_value );
		return $alt_attribute;
	}

	/**
	 * Remove Etch-related props from attributes
	 *
	 * @param array<string, mixed> $attributes Attributes array.
	 * @return array<string, mixed> Cleaned attributes.
	 */
	private function remove_etch_related_props( array $attributes ) {
		unset( $attributes['mediaId'], $attributes['useSrcSet'], $attributes['maximumSize'] );
		return $attributes;
	}
}
