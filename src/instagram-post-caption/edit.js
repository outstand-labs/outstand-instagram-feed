/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	HeadingLevelDropdown,
	AlignmentControl,
} from '@wordpress/block-editor';
import {
	ToggleControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';

function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch('medium', '<');
	return !isMobile ? { popoverProps: { placement: 'left-start', offset: 259 } } : {};
}

export default function InstagramPostCaptionEdit({
	attributes: { level, levelOptions, textAlign, isLink, rel, linkTarget },
	setAttributes,
	context: { caption, permalink },
}) {
	const TagName = level === 0 ? 'p' : `h${level}`;

	const blockProps = useBlockProps({
		className: clsx({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	let titleElement = <TagName {...blockProps} dangerouslySetInnerHTML={{ __html: caption }} />;

	if (isLink) {
		titleElement = (
			<TagName {...blockProps}>
				<a
					href={permalink}
					target={linkTarget}
					rel={rel}
					onClick={(event) => event.preventDefault()}
					dangerouslySetInnerHTML={{
						__html: caption,
					}}
				/>
			</TagName>
		);
	}

	return (
		<>
			{titleElement}
			<BlockControls group="block">
				<HeadingLevelDropdown
					value={level}
					options={levelOptions}
					onChange={(newLevel) => setAttributes({ level: newLevel })}
				/>
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<ToolsPanel
					label={__('Settings')}
					resetAll={() => {
						setAttributes({
							rel: '',
							linkTarget: '_self',
							isLink: false,
						});
					}}
					dropdownMenuProps={dropdownMenuProps}
				>
					<ToolsPanelItem
						label={__('Make title a link')}
						isShownByDefault
						hasValue={() => isLink}
						onDeselect={() => setAttributes({ isLink: false })}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Make title a link')}
							onChange={() => setAttributes({ isLink: !isLink })}
							checked={isLink}
						/>
					</ToolsPanelItem>
					{isLink && (
						<>
							<ToolsPanelItem
								label={__('Open in new tab')}
								isShownByDefault
								hasValue={() => linkTarget === '_blank'}
								onDeselect={() =>
									setAttributes({
										linkTarget: '_self',
									})
								}
							>
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
							</ToolsPanelItem>
							<ToolsPanelItem
								label={__('Link relation')}
								isShownByDefault
								hasValue={() => !!rel}
								onDeselect={() => setAttributes({ rel: '' })}
							>
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={__('Link relation')}
									value={rel}
									onChange={(newRel) => setAttributes({ rel: newRel })}
								/>
							</ToolsPanelItem>
						</>
					)}
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
