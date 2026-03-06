<?php
/**
 * Instagram Post Media
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block default content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\InstagramFeed;

$media_url = $block->context['mediaUrl'] ?? '';

if ( empty( $media_url ) ) {
	return;
}

$caption   = $block->context['caption'] ?? '';
$permalink = $block->context['permalink'] ?? '';
$is_link   = ! empty( $attributes['isLink'] );

$attr           = get_image_border_attributes( $attributes );
$overlay_markup = get_overlay_element_markup( $attributes );

$attr['src'] = $media_url;
$attr['alt'] = $caption;

$extra_styles = '';

// Aspect ratio with a height set needs to override the default width/height.
if ( ! empty( $attributes['aspectRatio'] ) ) {
	$extra_styles .= 'width:100%;height:100%;';
} elseif ( ! empty( $attributes['height'] ) ) {
	$extra_styles .= "height:{$attributes['height']};";
}

if ( ! empty( $attributes['scale'] ) ) {
	$extra_styles .= "object-fit:{$attributes['scale']};";
}

if ( ! empty( $attributes['style']['shadow'] ) ) {
	$shadow_styles = wp_style_engine_get_styles( [ 'shadow' => $attributes['style']['shadow'] ] );

	if ( ! empty( $shadow_styles['css'] ) ) {
		$extra_styles .= $shadow_styles['css'];
	}
}

if ( ! empty( $extra_styles ) ) {
	$attr['style'] = empty( $attr['style'] ) ? $extra_styles : $attr['style'] . $extra_styles;
}

$image = get_image( $attr );

if ( $is_link ) {

	$rel = '';
	if ( ! empty( $attributes['rel'] ) ) {
		$rel = sprintf( 'rel="%s"', esc_attr( $attributes['rel'] ) );
	}

	$image = sprintf(
		'<a href="%1$s" target="%2$s" %3$s>%4$s%5$s</a>',
		esc_url( $permalink ),
		esc_attr( $attributes['linkTarget'] ?? '_self' ),
		$rel,
		$image,
		$overlay_markup
	);
} else {
	$image = $image . $overlay_markup;
}

$aspect_ratio = '';
if ( ! empty( $attributes['aspectRatio'] ) ) {
	$aspect_ratio = esc_attr( $attributes['aspectRatio'] );
	$aspect_ratio = safecss_filter_attr( $aspect_ratio );
	$aspect_ratio = sprintf( 'aspect-ratio:%s;', $aspect_ratio );
}

$width = '';
if ( ! empty( $attributes['width'] ) ) {
	$width = esc_attr( $attributes['width'] );
	$width = safecss_filter_attr( $width );
	$width = sprintf( 'width:%s;', $width );
}

$height = '';
if ( ! empty( $attributes['height'] ) ) {
	$height = esc_attr( $attributes['height'] );
	$height = safecss_filter_attr( $height );
	$height = sprintf( 'height:%s;', $height );
}

$wrapper_attributes = '';
if ( ! $height && ! $width && ! $aspect_ratio ) {
	$wrapper_attributes = get_block_wrapper_attributes();
} else {
	$wrapper_attributes = get_block_wrapper_attributes(
		[
			'style' => sprintf(
				'%s%s%s',
				$aspect_ratio,
				$width,
				$height
			),
		]
	);
}

?>

<figure
	itemprop="image"
	itemscope
	itemtype="https://schema.org/ImageObject"
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
>
	<?php echo $image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</figure>
