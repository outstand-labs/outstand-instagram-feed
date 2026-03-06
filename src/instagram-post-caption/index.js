/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { title as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType(metadata.name, {
	icon,
	edit: Edit,
	save: Save,
});
