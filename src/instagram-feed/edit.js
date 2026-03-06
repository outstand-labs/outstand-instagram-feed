/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* global outstandInstagramFeed */
/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import {
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	Notice,
	Button,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Icon } from './icon';

const MIN_TOTAL_ITEMS = 1;
const MAX_TOTAL_ITEMS = 50;

export default function InstagramFeedEdit({ attributes: { totalItems }, setAttributes }) {
	const blockProps = useBlockProps();

	const isActive = outstandInstagramFeed?.isActive || false;
	const settingsUrl = outstandInstagramFeed?.settingsUrl || '';

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [['outstand/instagram-post-template']],
	});

	return (
		<>
			{!isActive && (
				<div {...innerBlocksProps}>
					<Notice status="warning" isDismissible={false}>
						<Flex justify="flex-start">
							<FlexItem display="inline-flex">
								<Icon />
							</FlexItem>
							<FlexItem display="inline-flex">
								{__('Instagram Feed', 'outstand-instagram-feed')}
							</FlexItem>
						</Flex>
						<p>
							{__(
								'Please configure the Outstand Instagram Feed plugin to display your Instagram posts.',
								'outstand-instagram-feed',
							)}
						</p>
						<Button
							variant="primary"
							href={settingsUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{__('Configure', 'outstand-instagram-feed')}
						</Button>
					</Notice>
				</div>
			)}
			{isActive && <div {...innerBlocksProps} />}
			<InspectorControls>
				<ToolsPanel
					className="block-library-query-toolspanel__display"
					label={__('Display')}
					resetAll={() => {
						setAttributes({
							totalItems: 6,
						});
					}}
				>
					<ToolsPanelItem label={__('Total items')} hasValue={() => totalItems > 0}>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Total items')}
							min={MIN_TOTAL_ITEMS}
							max={MAX_TOTAL_ITEMS}
							onChange={(newTotalItems) => {
								if (
									isNaN(newTotalItems) ||
									newTotalItems < MIN_TOTAL_ITEMS ||
									newTotalItems > MAX_TOTAL_ITEMS
								) {
									return;
								}
								setAttributes({ totalItems: newTotalItems });
							}}
							value={parseInt(totalItems, 10)}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
