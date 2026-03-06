<?php
/**
 * Component Property (abstract base)
 *
 * Abstract base class for component property definitions.
 * Mirrors the TypeScript EtchComponentProperty discriminated union.
 *
 * @package Etch\Blocks\Types
 */

namespace Etch\Blocks\Types\ComponentProperty;

use Etch\Blocks\Utilities\EtchTypeAsserter;

/**
 * ComponentProperty abstract class
 *
 * Base class for all component property types. Each subclass represents
 * a specific property variant (string, number, boolean, etc.), mirroring
 * the TypeScript type hierarchy.
 */
abstract class ComponentProperty {

	/**
	 * Property name (display name)
	 *
	 * @var string
	 */
	public string $name;

	/**
	 * Property key (identifier)
	 *
	 * @var string
	 */
	public string $key;

	/**
	 * Whether the key has been touched/modified
	 *
	 * @var bool|null
	 */
	public ?bool $keyTouched = null;

	/**
	 * Primitive type
	 *
	 * @var string
	 */
	protected string $primitive = 'string';

	/**
	 * Specialized type
	 *
	 * @var string|null
	 */
	protected ?string $specialized = null;

	/**
	 * Get the primitive type
	 *
	 * @return string
	 */
	public function get_primitive(): string {
		return $this->primitive;
	}

	/**
	 * Get the specialized type
	 *
	 * @return string|null
	 */
	public function get_specialized(): string|null {
		return $this->specialized;
	}

	/**
	 * Default value
	 *
	 * @var mixed
	 */
	public $default = null;

	/**
	 * Get the type array for serialization
	 *
	 * @return array{primitive: string, specialized?: string}
	 */
	public function get_type_array(): array {
		$type = array( 'primitive' => $this->primitive );
		$specialized = $this->specialized;
		if ( ! empty( $specialized ) ) {
			$type['specialized'] = $specialized;
		}
		return $type;
	}

	/**
	 * Create ComponentProperty from array data.
	 *
	 * Factory method that dispatches to the appropriate subclass based on the type.
	 *
	 * @param array<string, mixed> $data Property data array.
	 * @return self|null ComponentProperty subclass instance or null if invalid.
	 */
	public static function from_array( array $data ): ?self {
		if ( ! isset( $data['key'] ) ) {
			return null;
		}

		$key = EtchTypeAsserter::to_string( $data['key'] );
		if ( '' === $key ) {
			return null;
		}

		$type_data = $data['type'] ?? array();
		$primitive = null;
		$specialized = null;

		if ( is_array( $type_data ) ) {
			$primitive = EtchTypeAsserter::to_string( $type_data['primitive'] ?? 'string' );
			$specialized = isset( $type_data['specialized'] ) ? EtchTypeAsserter::to_string( $type_data['specialized'] ) : null;
		}

		return match ( true ) {
			'string' === $primitive && 'array' === $specialized
				=> LoopProperty::from_property_array( $data ),
			'string' === $primitive
				=> StringProperty::from_property_array( $data ),
			'number' === $primitive
				=> NumberProperty::from_property_array( $data ),
			'boolean' === $primitive
				=> BooleanProperty::from_property_array( $data ),
			'object' === $primitive && 'group' === $specialized
				=> GroupProperty::from_property_array( $data ),
			'object' === $primitive
				=> ObjectProperty::from_property_array( $data ),
			'array' === $primitive && 'class' === $specialized
				=> ClassProperty::from_property_array( $data ),
			'array' === $primitive
				=> ArrayProperty::from_property_array( $data ),
			default
				=> null,
		};
	}

	/**
	 * Extract base fields from array data into an instance.
	 *
	 * @param array<string, mixed> $data     Property data array.
	 * @param self                 $instance Instance to populate.
	 */
	protected static function extract_base( array $data, self $instance ): void {
		$instance->name = isset( $data['name'] )
			? EtchTypeAsserter::to_string( $data['name'] )
			: EtchTypeAsserter::to_string( $data['key'] );

		$instance->key = EtchTypeAsserter::to_string( $data['key'] );

		if ( isset( $data['keyTouched'] ) ) {
			$instance->keyTouched = EtchTypeAsserter::to_bool( $data['keyTouched'] );
		}

		// Extract type (primitive + specialized).
		$type_data = $data['type'] ?? array();
		if ( is_string( $type_data ) ) {
			$instance->primitive = $type_data;
		} elseif ( is_array( $type_data ) ) {
			$instance->primitive = EtchTypeAsserter::to_string( $type_data['primitive'] ?? 'string' );
			if ( isset( $type_data['specialized'] ) ) {
				$instance->specialized = EtchTypeAsserter::to_string( $type_data['specialized'] );
			}
		}

		if ( array_key_exists( 'default', $data ) ) {
			$instance->default = $data['default'];
		}
	}

	/**
	 * Convert to array
	 *
	 * @return array<string, mixed>
	 */
	public function to_array(): array {
		$result = array(
			'name' => $this->name,
			'key'  => $this->key,
			'type' => $this->get_type_array(),
		);

		if ( null !== $this->keyTouched ) {
			$result['keyTouched'] = $this->keyTouched;
		}

		if ( null !== $this->default ) {
			$result['default'] = $this->default;
		}

		return $result;
	}


	/**
	 * Resolve the value for this property.
	 *
	 * @param mixed                                         $value   The value to resolve.
	 * @param array<int, array{key: string, source: mixed}> $sources Sources for dynamic expression evaluation.
	 * @return mixed The resolved value.
	 */
	abstract public function resolve_value( $value, array $sources ): mixed;
}
