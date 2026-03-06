/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { addQueryArgs } from '@wordpress/url';
import { Spinner, ToolbarGroup } from '@wordpress/components';
import { useMemo, memo, useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { list, grid } from '@wordpress/icons';
import { _x } from '@wordpress/i18n';

const TEMPLATE = [['outstand/instagram-post-media']];

function PostTemplateInnerBlocks({ classList }) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx('wp-block-outstand-instagram-post', classList) },
		{
			template: TEMPLATE,
			__unstableDisableLayoutClassNames: true,
		},
	);
	return <li {...innerBlocksProps} />;
}

function PostTemplateBlockPreview({
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
}) {
	const blockPreviewProps = useBlockPreview({
		blocks,
		props: {
			className: clsx('wp-block-outstand-instagram-post', classList),
		},
	});

	const handleOnClick = () => {
		setActiveBlockContextId(blockContextId);
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{...blockPreviewProps}
			tabIndex={0}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={handleOnClick}
			onKeyPress={handleOnClick}
			style={style}
		/>
	);
}

const MemoizedPostTemplateBlockPreview = memo(PostTemplateBlockPreview);

export default function InstagramPostTemplateEdit({
	setAttributes,
	clientId,
	attributes: { layout },
	__unstableLayoutClassNames,
	context: { totalItems },
}) {
	const { type: layoutType, columnCount = 3 } = layout || {};
	const [activeBlockContextId, setActiveBlockContextId] = useState();

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { blocks } = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore);
			return {
				blocks: getBlocks(clientId),
			};
		},
		[clientId],
	);

	useEffect(() => {
		const path = addQueryArgs('/outstand-instagram-feed/v1/posts', { totalItems });
		apiFetch({ path })
			.then((result) => {
				if (result && Array.isArray(result)) {
					setPosts(result);
					setIsLoading(false);
				}
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error('Error fetching Instagram posts:', error);
				setIsLoading(false);
			});
	}, [totalItems]);

	const blockContexts = useMemo(
		() =>
			posts?.map((post) => ({
				mediaId: post.id,
				mediaType: post.media_type,
				mediaUrl: post.media_url,
				caption: post.caption,
				timestamp: post.timestamp,
				permalink: post.permalink,
				thumbnailUrl: post.thumbnail_url,
				classList: post.classList,
			})),
		[posts],
	);

	const blockProps = useBlockProps({
		className: clsx(__unstableLayoutClassNames, {
			[`columns-${columnCount}`]: layoutType === 'grid' && columnCount,
		}),
	});

	if (isLoading) {
		return (
			<p {...blockProps}>
				<Spinner />
			</p>
		);
	}

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		});

	const displayLayoutControls = [
		{
			icon: list,
			title: _x('List view', 'Post template block display setting'),
			onClick: () => setDisplayLayout({ type: 'default' }),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: _x('Grid view', 'Post template block display setting'),
			onClick: () =>
				setDisplayLayout({
					type: 'grid',
					columnCount,
				}),
			isActive: layoutType === 'grid',
		},
	];

	return (
		<>
			<ul {...blockProps}>
				{blockContexts &&
					blockContexts.map((blockContext) => (
						<BlockContextProvider key={blockContext.mediaId} value={blockContext}>
							{blockContext.mediaId ===
							(activeBlockContextId || blockContexts[0]?.mediaId) ? (
								<PostTemplateInnerBlocks classList={blockContext.classList} />
							) : null}
							<MemoizedPostTemplateBlockPreview
								blocks={blocks}
								blockContextId={blockContext.mediaId}
								classList={blockContext.classList}
								setActiveBlockContextId={setActiveBlockContextId}
								isHidden={
									blockContext.mediaId ===
									(activeBlockContextId || blockContexts[0]?.mediaId)
								}
							/>
						</BlockContextProvider>
					))}
			</ul>
			<BlockControls>
				<ToolbarGroup controls={displayLayoutControls} />
			</BlockControls>
		</>
	);
}
