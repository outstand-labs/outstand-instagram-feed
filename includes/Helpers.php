<?php

namespace Outstand\WP\InstagramFeed;

/**
 * Generate markup for the HTML element that will be used for the image.
 *
 * Based on wp_get_attachment_image().
 *
 * @param  array $attr Attributes for the image markup.
 * @return string
 */
function get_image( array $attr ): string {

	$width  = $attr['width'] ?? '';
	$height = $attr['height'] ?? '';

	$hwstring = image_hwstring( $width, $height );

	$default_attr = [
		'src'   => $attr['src'],
		'alt'   => $attr['alt'],
		'class' => '',
	];

	$context = apply_filters( 'wp_get_attachment_image_context', 'wp_get_attachment_image' );
	$attr    = wp_parse_args( $attr, $default_attr );

	$loading_attr              = $attr;
	$loading_attr['width']     = $width;
	$loading_attr['height']    = $height;
	$loading_optimization_attr = wp_get_loading_optimization_attributes(
		'img',
		$loading_attr,
		$context
	);

	$attr = array_merge( $attr, $loading_optimization_attr );
	if ( empty( $attr['decoding'] ) || ! in_array( $attr['decoding'], [ 'async', 'sync', 'auto' ], true ) ) {
		unset( $attr['decoding'] );
	}

	if ( isset( $attr['loading'] ) && ! $attr['loading'] ) {
		unset( $attr['loading'] );
	}

	if ( isset( $attr['fetchpriority'] ) && ! $attr['fetchpriority'] ) {
		unset( $attr['fetchpriority'] );
	}

	$attr = array_map( 'esc_attr', $attr );
	$html = rtrim( "<img $hwstring" );

	foreach ( $attr as $name => $value ) {
		$html .= " $name=" . '"' . $value . '"';
	}

	$html .= ' />';

	return $html;
}

/**
 * Generate markup for the HTML element that will be used for the overlay.
 *
 * Based on get_block_core_post_featured_image_overlay_element_markup().
 *
 * @param  array $attributes Block attributes.
 * @return string
 */
function get_overlay_element_markup( array $attributes ): string {
	$has_dim_background  = isset( $attributes['dimRatio'] ) && $attributes['dimRatio'];
	$has_gradient        = isset( $attributes['gradient'] ) && $attributes['gradient'];
	$has_custom_gradient = isset( $attributes['customGradient'] ) && $attributes['customGradient'];
	$has_solid_overlay   = isset( $attributes['overlayColor'] ) && $attributes['overlayColor'];
	$has_custom_overlay  = isset( $attributes['customOverlayColor'] ) && $attributes['customOverlayColor'];
	$class_names         = [ 'wp-block-outstand-instagram-post-media__overlay' ];
	$styles              = [];

	if ( ! $has_dim_background ) {
		return '';
	}

	// Apply border classes and styles.
	$border_attributes = get_image_border_attributes( $attributes );

	if ( ! empty( $border_attributes['class'] ) ) {
		$class_names[] = $border_attributes['class'];
	}

	if ( ! empty( $border_attributes['style'] ) ) {
		$styles[] = $border_attributes['style'];
	}

	// Apply overlay and gradient classes.
	if ( $has_dim_background ) {
		$class_names[] = 'has-background-dim';
		$class_names[] = "has-background-dim-{$attributes['dimRatio']}";
	}

	if ( $has_solid_overlay ) {
		$class_names[] = "has-{$attributes['overlayColor']}-background-color";
	}

	if ( $has_gradient || $has_custom_gradient ) {
		$class_names[] = 'has-background-gradient';
	}

	if ( $has_gradient ) {
		$class_names[] = "has-{$attributes['gradient']}-gradient-background";
	}

	// Apply background styles.
	if ( $has_custom_gradient ) {
		$styles[] = sprintf( 'background-image: %s;', $attributes['customGradient'] );
	}

	if ( $has_custom_overlay ) {
		$styles[] = sprintf( 'background-color: %s;', $attributes['customOverlayColor'] );
	}

	return sprintf(
		'<span class="%s" style="%s" aria-hidden="true"></span>',
		esc_attr( implode( ' ', $class_names ) ),
		esc_attr( safecss_filter_attr( implode( ' ', $styles ) ) )
	);
}

/**
 * Generates class names and styles to apply the border support styles for
 * the Instagram Feed block.
 *
 * Based on get_block_core_post_featured_image_border_attributes().
 *
 * @param  array $attributes The block attributes.
 * @return array
 */
function get_image_border_attributes( array $attributes ): array {
	$border_styles = [];
	$sides         = [ 'top', 'right', 'bottom', 'left' ];

	// Border radius.
	if ( isset( $attributes['style']['border']['radius'] ) ) {
		$border_styles['radius'] = $attributes['style']['border']['radius'];
	}

	// Border style.
	if ( isset( $attributes['style']['border']['style'] ) ) {
		$border_styles['style'] = $attributes['style']['border']['style'];
	}

	// Border width.
	if ( isset( $attributes['style']['border']['width'] ) ) {
		$border_styles['width'] = $attributes['style']['border']['width'];
	}

	// Border color.
	$preset_color           = array_key_exists( 'borderColor', $attributes ) ? "var:preset|color|{$attributes['borderColor']}" : null;
	$custom_color           = $attributes['style']['border']['color'] ?? null;
	$border_styles['color'] = $preset_color ? $preset_color : $custom_color;

	// Individual border styles e.g. top, left etc.
	foreach ( $sides as $side ) {
		$border                 = $attributes['style']['border'][ $side ] ?? null;
		$border_styles[ $side ] = [
			'color' => isset( $border['color'] ) ? $border['color'] : null,
			'style' => isset( $border['style'] ) ? $border['style'] : null,
			'width' => isset( $border['width'] ) ? $border['width'] : null,
		];
	}

	$styles     = wp_style_engine_get_styles( [ 'border' => $border_styles ] );
	$attributes = [];
	if ( ! empty( $styles['classnames'] ) ) {
		$attributes['class'] = $styles['classnames'];
	}

	if ( ! empty( $styles['css'] ) ) {
		$attributes['style'] = $styles['css'];
	}

	return $attributes;
}
