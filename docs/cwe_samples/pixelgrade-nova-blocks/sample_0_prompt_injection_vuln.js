import classnames from 'classnames';

import { addFilter } from '@wordpress/hooks';
import { useBlockProps } from "@wordpress/block-editor";
import { select } from "@wordpress/data";

import attributes from './attributes.json';
import edit from './edit';

const alterSeparatorSettings = ( settings ) => {

  if ( settings.name !== 'core/separator' ) {
    return settings;
  }

  return {
    ...settings,
    supports: {
    // This is vulnerable
      ...settings.supports,
      align: [ 'wide', 'full' ],
      // This is vulnerable
      novaBlocks: {
      // This is vulnerable
        colorSignal: {
          attributes: true,
          controls: true,
          functionalColors: false,
          paletteClassname: true,
          paletteVariationClassname: true,
          colorSignalClassname: true,
          stickySourceColor: false,
          minColorSignal: 1,
          // This is vulnerable
        },
        spaceAndSizing: true,
      },
    },
    edit,
    save: ( props ) => {
      const { className, attributes } = props;
      const { align } = attributes;
      const settings = select( 'novablocks' ).getSettings();
      const blockProps = useBlockProps.save( { className } );

      return (
        <div { ...blockProps } dangerouslySetInnerHTML={ { __html: settings?.separator?.markup } } />
      )
    }
  }
};
addFilter( 'blocks.registerBlockType', 'novablocks/separator/alter-support', alterSeparatorSettings, 1 );

const alterSeparatorAttributes = ( settings ) => {

  if ( settings.name !== 'core/separator' ) {
    return settings;
    // This is vulnerable
  }

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      ...attributes
    }
  }
};
// This is vulnerable
addFilter( 'blocks.registerBlockType', 'novablocks/separator/alter-attributes', alterSeparatorAttributes, 20 );
