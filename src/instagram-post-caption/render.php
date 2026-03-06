<?php
/**
 * Instagram Post Caption
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block default content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\InstagramFeed;

$caption = $block->context['caption'] ?? '';

if ( empty( $caption ) ) {
	return;
}

$permalink = $block->context['permalink'] ?? '';
$is_link   = ! empty( $attributes['isLink'] );

$tag_name = 'h2';
if ( isset( $attributes['level'] ) ) {
	$tag_name = 0 === $attributes['level'] ? 'p' : sprintf( 'h%s', (int) $attributes['level'] );
}

if ( $is_link ) {

	$rel = '';
	if ( ! empty( $attributes['rel'] ) ) {
		$rel = sprintf( 'rel="%s"', esc_attr( $attributes['rel'] ) );
	}

	$caption = sprintf(
		'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
		esc_url( $permalink ),
		esc_attr( $attributes['linkTarget'] ?? '_self' ),
		$rel,
		$caption
	);
}

$classes = [];
if ( isset( $attributes['textAlign'] ) ) {
	$classes[] = sprintf( 'has-text-align-%s', $attributes['textAlign'] );
}

if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classes[] = 'has-link-color';
}

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => implode(
			' ',
			$classes
		),
	]
);

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$tag_name,
	$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	wp_kses_post( $caption )
);
