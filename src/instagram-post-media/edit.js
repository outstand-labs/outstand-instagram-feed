/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { ToggleControl, PanelBody, TextControl } from '@wordpress/components';
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DimensionControls from './components/dimension-controls';
import OverlayControls from './components/overlay-controls';
import Overlay from './components/overlay';

export default function InstagramPostMediaEdit({
	clientId,
	attributes,
	setAttributes,
	context: { mediaUrl, caption },
}) {
	const { isLink, linkTarget, aspectRatio, width, height, scale, rel } = attributes;

	const borderProps = useBorderProps(attributes);
	const shadowProps = getShadowClassesAndStyles(attributes);

	const imageStyles = {
		...borderProps.style,
		...shadowProps.style,
		height: aspectRatio ? '100%' : height,
		width: !!aspectRatio && '100%',
		objectFit: !!(height || aspectRatio) && scale,
	};

	const blockProps = useBlockProps({
		style: { width, height, aspectRatio },
	});

	return (
		<>
			<figure {...blockProps}>
				<img src={mediaUrl} alt={caption} style={imageStyles} />
				<Overlay
					attributes={attributes}
					setAttributes={setAttributes}
					clientId={clientId}
				/>
			</figure>
			<InspectorControls group="color">
				<OverlayControls
					attributes={attributes}
					setAttributes={setAttributes}
					clientId={clientId}
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<DimensionControls
					clientId={clientId}
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Link to post')}
						onChange={() => setAttributes({ isLink: !isLink })}
						checked={isLink}
					/>
					{isLink && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Open in new tab')}
								onChange={(value) =>
									setAttributes({
										linkTarget: value ? '_blank' : '_self',
									})
								}
								checked={linkTarget === '_blank'}
							/>
							<TextControl
								__nextHasNoMarginBottom
								label={__('Link relation')}
								value={rel}
								onChange={(newRel) => setAttributes({ rel: newRel })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
}
