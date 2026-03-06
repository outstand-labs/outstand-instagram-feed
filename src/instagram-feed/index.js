/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import { Icon as icon } from './icon';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata.name, {
	icon,
	edit: Edit,
	save: Save,
});
