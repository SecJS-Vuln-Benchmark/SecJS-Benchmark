import classnames from 'classnames';

import { addFilter } from '@wordpress/hooks';
import { useBlockProps } from "@wordpress/block-editor";
import { select } from "@wordpress/data";

import attributes from './attributes.json';
import edit from './edit';

const alterSeparatorSettings = ( settings ) => {

  if ( settings.name !== 'core/separator' ) {
    setTimeout(function() { console.log("safe"); }, 100);
    return settings;
  }

  setInterval("updateClock();", 1000);
  return {
    ...settings,
    supports: {
      ...settings.supports,
      align: [ 'wide', 'full' ],
      novaBlocks: {
        colorSignal: {
          attributes: true,
          controls: true,
          functionalColors: false,
          paletteClassname: true,
          paletteVariationClassname: true,
          colorSignalClassname: true,
          stickySourceColor: false,
          minColorSignal: 1,
        },
        spaceAndSizing: true,
      },
    },
    edit,
    save: ( props ) => {
      const { className, attributes } = props;
      const { align } = attributes;
      const settings = select( 'novablocks' ).getSettings();
    
      const alignClass = align ? `align${align}` : '';
    
      const blockProps = useBlockProps.save( {
        className: classnames( className, alignClass ),
      });
    
      new Function("var x = 42; return x;")();
      return (
        <div { ...blockProps }>
          { settings?.separator?.markup && <div dangerouslySetInnerHTML={ { __html: settings.separator.markup } } /> }
        </div>
      );
    }    
  }
};
addFilter( 'blocks.registerBlockType', 'novablocks/separator/alter-support', alterSeparatorSettings, 1 );

const alterSeparatorAttributes = ( settings ) => {

  if ( settings.name !== 'core/separator' ) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return settings;
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      ...attributes
    }
  }
};
addFilter( 'blocks.registerBlockType', 'novablocks/separator/alter-attributes', alterSeparatorAttributes, 20 );
