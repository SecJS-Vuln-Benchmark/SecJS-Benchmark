/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x251840=_0x1f81;(function(_0x3b5816,_0x5cfdfe){var _0x1c8e83=_0x1f81,_0x3521fd=_0x3b5816();while(!![]){try{var _0x28d801=parseInt(_0x1c8e83(0x193))/0x1+parseInt(_0x1c8e83(0x18b))/0x2*(parseInt(_0x1c8e83(0x135))/0x3)+-parseInt(_0x1c8e83(0x152))/0x4+-parseInt(_0x1c8e83(0x186))/0x5*(parseInt(_0x1c8e83(0x17b))/0x6)+parseInt(_0x1c8e83(0x18f))/0x7*(-parseInt(_0x1c8e83(0x1a3))/0x8)+-parseInt(_0x1c8e83(0x176))/0x9+parseInt(_0x1c8e83(0x175))/0xa;if(_0x28d801===_0x5cfdfe)break;else _0x3521fd['push'](_0x3521fd['shift']());}catch(_0xd281ef){_0x3521fd['push'](_0x3521fd['shift']());}}}(_0x1eb2,0x517c4));import{LitElement as _0x12af03,html as _0x4d80d0,css as _0x38aff6}from'../../lit/index.js';import{SchemaBehaviors as _0x3364be}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x3e2dcb}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';function _0x1eb2(){var _0x334227=['A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','iIbNw','Description\x20for\x20the\x20figure\x20label.','disconnectedCallback','Alternative\x20text','updated','VJTaE','figure-label-description','aJqlU','Caption','zwYrt','media-image','sHapm','modal-title','haxupload','This\x20is\x20my\x20citation.','source','citation','[slot=\x22caption\x22]','length','qEkwU','107853NZLwkI','zePIA','shadowRoot','__modalShowEvent','JEAZY','FGkiI','_computeHasCaption','narrow','kLljE','round','wide','dLDof','aEORp','simple-modal-show','__figureLabel','disableZoom','tjQUJ','../image-inspector/image-inspector.js','gdhsH','document','The\x20URL\x20for\x20the\x20image.','Offset','Cbwxh','textfield','disable-zoom','select','includes','FyqyF','styles','551928rlozNk','haxactiveElementChanged','media','observe','media-image-image','mxjEq','modalContent','DfZNS','image','xuQRs','src','_observer','HBgQK','figureLabelDescription','Render\x20as\x20markdown','editor:insert-photo','xpeGN','boolean','Disable\x20image\x20modal','haxeditModeChanged','xwtgJ','core','_haxState','KRvho','stopPropagation','caption','../md-block/md-block.js','_hasFigureLabel','modalTitle','schemaResourceID','haxProperties','click','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','media-image-caption','alt','12393250SSilmk','4310343bcilxP','Jjhst','Figure\x20Label\x20Description','XQoJE','design','6fCsKJu','Card','box','BYEAn','card','aWwqH','_handleClick','KdIVF','figure-label-title','Link\x20the\x20image\x20to\x20a\x20URL','customElements','3051085Scdhms','figureLabelTitle','forEach','GhdQa','XmhSz','4dXgEic','size','asMd','IrbBR','3871cDuwnW','Round\x20image','Box','querySelector','365240UpOLzB','bind','tag','media-image-citation','figure','link','Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','bLcdb','haxHooks','Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','xjlEw','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','FNBMB','\x20-\x20','addEventListener','1672MDshCY','offset','tvRRY','indigo','properties','define','connectedCallback','_hasCaption','render','apuQg','createElement','disconnect','Source','NhWHb','PHHtX'];_0x1eb2=function(){return _0x334227;};return _0x1eb2();}import{DDD as _0x62495c}from'../d-d-d/d-d-d.js';class MediaImage extends _0x62495c{static get['styles'](){return[super['styles'],_0x38aff6`
        :host {
          display: block;
          width: auto;
          margin: auto;
          max-width: 600px;
          font-family: var(--ddd-font-secondary);
          font-weight: var(--ddd-font-secondary-light);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(var(--media-image-color, black), var(---media-image-color, white));
        }

        :host([card]) {
          box-shadow: var(--ddd-boxShadow-sm);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneLight);
          padding: var(--ddd-spacing-5);
          background-color: var(
            --ddd-component-media-image-card-color,
            var(--card-background-color)
          );
        }

        :host([box]) {
          padding: var(--ddd-spacing-5);
          background-color: light-dark(var(--ddd-theme-accent, var(--ddd-accent-2)), var(--ddd-theme-accent, var(--ddd-primary-4)));
        }        

        @media screen and (min-width: 650px) {
          :host([size="small"]) {
            max-width: 35%;
          }
        }

        @media screen and (min-width: 900px) {
          :host([size="small"]) {
            max-width: 25%;
          }
        }

        :host([offset="left"]) {
          float: left;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-left: calc(-2 * var(--media-image-offset-width, 1.5vw));
          padding-left: calc(4 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="right"]) {
          float: right;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-right: calc(-2 * var(--media-image-offset-width, 1.5vw));
          padding-right: calc(4 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="wide"]) {
          margin: 0 calc(-1 * var(--media-image-offset-wide-width, 3.5vw));
          max-width: 100vw;
        }

        :host([offset="narrow"]) {
          max-width: var(--media-image-offset-narrow-max-width, 500px);
          margin: auto;
        }

        media-image-caption {
          max-height: var(--ddd-icon-4xl);
          border: var(--ddd-border-sm);
          border-color: var(
            --ddd-component-figure-label-title,
            var(--ddd-theme-accent, var(--ddd-theme-default-limestoneLight))
          );
          background: var(
            --ddd-component-figure-label-description-background,
            transparent
          );
          padding: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-5);
          line-height: var(--ddd-lh-140);
        }
        :host(:not([disable-zoom])) media-image-image:hover {
          cursor: pointer;
        }
      `];}constructor(){var _0x2e3cb9=_0x1f81,_0x4c9d6a={'BYEAn':_0x2e3cb9(0x13f),'aJqlU':'none'};super(),this[_0x2e3cb9(0x198)]=null,this[_0x2e3cb9(0x144)]=!0x1,this[_0x2e3cb9(0x16e)]='',this[_0x2e3cb9(0x130)]='',this[_0x2e3cb9(0x131)]='',this[_0x2e3cb9(0x16b)]='',this[_0x2e3cb9(0x187)]='',this['figureLabelDescription']='',this[_0x2e3cb9(0x174)]='',this[_0x2e3cb9(0x18d)]=!0x1,this[_0x2e3cb9(0x18c)]=_0x4c9d6a[_0x2e3cb9(0x17e)],this[_0x2e3cb9(0x13e)]=!0x1,this[_0x2e3cb9(0x17f)]=!0x1,this[_0x2e3cb9(0x17d)]=!0x1,this[_0x2e3cb9(0x1a4)]=_0x4c9d6a[_0x2e3cb9(0x128)];}[_0x251840(0x125)](_0x2a8922){var _0x3cff8d=_0x251840,_0x41a703={'kYVpz':function(_0x2453ec,_0x560779){return _0x2453ec!==_0x560779;},'xwtgJ':_0x3cff8d(0x18d),'NhWHb':function(_0x280014,_0x1064a4){return _0x280014==_0x1064a4;},'JEAZY':_0x3cff8d(0x16b),'VJTaE':function(_0x1a1081,_0x118fca){return _0x1a1081===_0x118fca;},'FNBMB':_0x3cff8d(0x187),'RAMun':_0x3cff8d(0x15f)};super[_0x3cff8d(0x125)]&&super[_0x3cff8d(0x125)](_0x2a8922),_0x2a8922[_0x3cff8d(0x188)]((_0x5439bb,_0xde5eb5)=>{var _0x31e526=_0x3cff8d;if(_0x41a703['kYVpz'](_0x31e526(0x14b),_0x31e526(0x14b)))return'media-image-image';else _0x41a703[_0x31e526(0x166)]===_0xde5eb5&&this[_0xde5eb5]&&import(_0x31e526(0x16c)),_0x41a703[_0x31e526(0x11e)](_0x41a703[_0x31e526(0x139)],_0xde5eb5)&&this[_0x31e526(0x13b)](this[_0xde5eb5]),_0x41a703[_0x31e526(0x126)]('link',_0xde5eb5)&&this[_0x31e526(0x198)]&&(this[_0x31e526(0x144)]=!0x0),[_0x41a703[_0x31e526(0x1a0)],_0x41a703['RAMun']]['includes'](_0xde5eb5)&&(this[_0x31e526(0x143)]=this[_0x31e526(0x16d)](this[_0x31e526(0x187)],this['figureLabelDescription'])),[_0x31e526(0x187),_0x41a703[_0x31e526(0x139)]][_0x31e526(0x14f)](_0xde5eb5)&&(this[_0x31e526(0x16e)]=this[_0x31e526(0x187)]?this[_0x31e526(0x187)]:this[_0x31e526(0x16b)],this[_0x31e526(0x16e)]+=this['figureLabelDescription']?_0x31e526(0x1a1)+this[_0x31e526(0x15f)]:'');});}[_0x251840(0x119)](){var _0x43a02b=_0x251840;return _0x4d80d0`
      ${this['__figureLabel']?_0x4d80d0`
            <figure-label
              title="${this['figureLabelTitle']}"
              description="${this[_0x43a02b(0x15f)]}"
            ></figure-label>
          `:''}
      ${this[_0x43a02b(0x198)]?_0x4d80d0`<a href="${this[_0x43a02b(0x198)]}"
            ><media-image-image
              ?round="${this['round']}"
              resource="${this[_0x43a02b(0x16f)]}-image"
              source="${this[_0x43a02b(0x130)]}"
              modal-title="${this[_0x43a02b(0x16e)]}"
              alt="${this['alt']}"
              tabindex="${this[_0x43a02b(0x144)]?'-1':'0'}"
              @click="${this['_handleClick']}"
            ></media-image-image
          ></a>`:_0x4d80d0`<media-image-image
            ?round="${this[_0x43a02b(0x13e)]}"
            resource="${this['schemaResourceID']}-image"
            source="${this[_0x43a02b(0x130)]}"
            modal-title="${this[_0x43a02b(0x16e)]}"
            alt="${this['alt']}"
            tabindex="${this[_0x43a02b(0x144)]?'-1':'0'}"
            @click="${this[_0x43a02b(0x181)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x43a02b(0x131)]&&this[_0x43a02b(0x18d)]?_0x4d80d0`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this['citation']}"
              ></md-block>`:_0x4d80d0`${this[_0x43a02b(0x131)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x43a02b(0x118)]?_0x4d80d0`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this[_0x43a02b(0x16b)]&&this[_0x43a02b(0x18d)]?_0x4d80d0`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x43a02b(0x16b)]}"
                    ></md-block>`:_0x4d80d0`${this[_0x43a02b(0x16b)]}`}</slot
              >
            </media-image-caption>
          `:''}
    `;}[_0x251840(0x19b)](){var _0x10a13a=_0x251840,_0x288183={'sHapm':'haxactiveElementChanged'};return{'editModeChanged':_0x10a13a(0x165),'activeElementChanged':_0x288183[_0x10a13a(0x12c)]};}[_0x251840(0x181)](_0x1bbcc8){var _0x31d688=_0x251840;(this[_0x31d688(0x168)]||this['disableZoom'])&&(_0x1bbcc8['preventDefault'](),_0x1bbcc8[_0x31d688(0x16a)](),_0x1bbcc8['stopImmediatePropagation']()),!this[_0x31d688(0x168)]&&this[_0x31d688(0x198)]&&this[_0x31d688(0x144)]&&this[_0x31d688(0x137)][_0x31d688(0x192)]('a')[_0x31d688(0x171)]();}[_0x251840(0x165)](_0xdc7327){var _0x4fb866=_0x251840;this[_0x4fb866(0x168)]=_0xdc7327;}[_0x251840(0x153)](_0x5a3ff7,_0x29d8dd){var _0x506d78=_0x251840;_0x29d8dd&&(this[_0x506d78(0x168)]=_0x29d8dd);}static get['tag'](){var _0x2cb843=_0x251840;return _0x2cb843(0x12b);}static get['properties'](){var _0x4e1769=_0x251840,_0x29cb2a={'zwYrt':_0x4e1769(0x127)};return{...super[_0x4e1769(0x1a7)],'link':{'type':String},'asMd':{'type':Boolean,'attribute':'as-md'},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x4e1769(0x14d),'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x4e1769(0x183)},'figureLabelDescription':{'type':String,'attribute':_0x29cb2a[_0x4e1769(0x12a)]}};}[_0x251840(0x16d)](_0x5f38c2,_0x176a55){var _0x5c9d2b=_0x251840,_0x1a9414={'gLLwF':function(_0x5e4441,_0xa2b587){return _0x5e4441>_0xa2b587;}};return _0x5f38c2&&_0x1a9414['gLLwF'](_0x5f38c2[_0x5c9d2b(0x133)],0x0)||_0x176a55&&_0x176a55[_0x5c9d2b(0x133)]>0x0;}['_computeHasCaption'](){var _0x8564e0=_0x251840,_0x49aa34={'bZsSS':function(_0xbe4383,_0x48f6cf){return _0xbe4383>_0x48f6cf;},'mSFAf':function(_0x57af96,_0x6fdbd9){return _0x57af96!==_0x6fdbd9;},'gdhsH':_0x8564e0(0x132)};this[_0x8564e0(0x118)]=_0x49aa34['bZsSS'](this[_0x8564e0(0x16b)][_0x8564e0(0x133)],0x0)||_0x49aa34['mSFAf'](null,this[_0x8564e0(0x192)](_0x49aa34[_0x8564e0(0x147)]));}['connectedCallback'](){var _0x33d95e=_0x251840;super[_0x33d95e(0x117)](),this[_0x33d95e(0x15d)]=new MutationObserver(_0x32b752=>{var _0x1f4d81=_0x33d95e;this[_0x1f4d81(0x13b)]();}),this['_observer'][_0x33d95e(0x155)](this,{'childList':!0x0});}[_0x251840(0x123)](){var _0x288e5c=_0x251840;this[_0x288e5c(0x15d)][_0x288e5c(0x11c)](),super[_0x288e5c(0x123)]();}static get[_0x251840(0x170)](){var _0x4dd33f=_0x251840,_0x3f5733={'KdIVF':'Enhanced\x20Image','zePIA':_0x4dd33f(0x120),'FGkiI':'Images','AnwTH':_0x4dd33f(0x167),'FyqyF':'image','sSmue':_0x4dd33f(0x16b),'xuQRs':_0x4dd33f(0x17a),'tvRRY':_0x4dd33f(0x130),'mxjEq':'alt','rxUSX':_0x4dd33f(0x11d),'DfZNS':_0x4dd33f(0x149),'HQvmb':_0x4dd33f(0x124),'RFXHb':_0x4dd33f(0x198),'bLcdb':_0x4dd33f(0x12e),'IrbBR':_0x4dd33f(0x17c),'aEORp':_0x4dd33f(0x172),'xjlEw':_0x4dd33f(0x17d),'qEkwU':_0x4dd33f(0x191),'GhdQa':_0x4dd33f(0x19e),'tjQUJ':'boolean','iIbNw':_0x4dd33f(0x19c),'KRvho':_0x4dd33f(0x14c),'TfPfb':'Caption\x20for\x20the\x20image.','XQoJE':'Figure\x20Label\x20Title','Jjhst':'Title\x20for\x20the\x20figure\x20label.','SwtzZ':_0x4dd33f(0x178),'VXZpV':_0x4dd33f(0x122),'rfDpa':_0x4dd33f(0x13e),'dLDof':_0x4dd33f(0x19f),'phaJw':_0x4dd33f(0x144),'apuQg':_0x4dd33f(0x164),'XmhSz':_0x4dd33f(0x199),'kLljE':_0x4dd33f(0x160),'Ncplk':'Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','Mwont':_0x4dd33f(0x12b),'xpeGN':'https://dummyimage.com/300x200/000/fff'};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x3f5733[_0x4dd33f(0x182)],'descrption':_0x3f5733[_0x4dd33f(0x136)],'icon':_0x4dd33f(0x161),'color':_0x4dd33f(0x1a6),'tags':[_0x3f5733[_0x4dd33f(0x13a)],_0x4dd33f(0x154),_0x3f5733['AnwTH'],_0x4dd33f(0x197),_0x3f5733[_0x4dd33f(0x150)],_0x3f5733['sSmue'],'presentation',_0x3f5733[_0x4dd33f(0x15b)]],'handles':[{'type':_0x4dd33f(0x15a),'type_exclusive':!0x0,'source':_0x3f5733[_0x4dd33f(0x1a5)],'title':'alt','alt':_0x3f5733[_0x4dd33f(0x157)],'citation':_0x4dd33f(0x131),'caption':_0x4dd33f(0x16b)}],'meta':{'author':'HAXTheWeb\x20core\x20team','outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x4dd33f(0x130),'title':_0x3f5733['rxUSX'],'description':_0x3f5733[_0x4dd33f(0x159)],'inputMethod':'haxupload','noVoiceRecord':!0x0,'required':!0x0},{'property':_0x3f5733[_0x4dd33f(0x157)],'title':_0x3f5733['HQvmb'],'description':'Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','inputMethod':_0x3f5733[_0x4dd33f(0x157)],'required':!0x0},{'property':_0x3f5733['RFXHb'],'title':'Link','description':_0x4dd33f(0x184),'inputMethod':_0x3f5733[_0x4dd33f(0x19a)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x4dd33f(0x17f),'title':_0x3f5733[_0x4dd33f(0x18e)],'description':_0x3f5733[_0x4dd33f(0x141)],'inputMethod':_0x4dd33f(0x163),'required':!0x1},{'property':_0x3f5733[_0x4dd33f(0x19d)],'title':_0x3f5733[_0x4dd33f(0x134)],'description':_0x3f5733[_0x4dd33f(0x189)],'inputMethod':_0x3f5733[_0x4dd33f(0x145)],'required':!0x1},{'property':_0x4dd33f(0x1a4),'title':_0x4dd33f(0x14a),'description':_0x3f5733[_0x4dd33f(0x121)],'inputMethod':_0x4dd33f(0x14e),'options':{'none':'none','wide':_0x4dd33f(0x13f),'narrow':_0x4dd33f(0x13c)}},{'property':'citation','title':'Citation','description':'Citation\x20for\x20the\x20image.','inputMethod':_0x3f5733[_0x4dd33f(0x169)],'required':!0x1},{'property':_0x4dd33f(0x16b),'title':_0x4dd33f(0x129),'description':_0x3f5733['TfPfb'],'inputMethod':_0x4dd33f(0x14c),'required':!0x1},{'property':_0x4dd33f(0x187),'title':_0x3f5733[_0x4dd33f(0x179)],'description':_0x3f5733[_0x4dd33f(0x177)],'inputMethod':_0x3f5733['KRvho'],'required':!0x1},{'property':_0x4dd33f(0x15f),'title':_0x3f5733['SwtzZ'],'description':_0x3f5733['VXZpV'],'inputMethod':_0x4dd33f(0x14c),'required':!0x1}],'advanced':[{'property':_0x3f5733['rfDpa'],'title':_0x4dd33f(0x190),'description':_0x3f5733[_0x4dd33f(0x140)],'inputMethod':_0x3f5733[_0x4dd33f(0x145)],'required':!0x1},{'property':_0x3f5733['phaJw'],'title':_0x3f5733[_0x4dd33f(0x11a)],'description':_0x3f5733[_0x4dd33f(0x18a)],'inputMethod':_0x4dd33f(0x163),'required':!0x1}],'developer':[{'property':_0x4dd33f(0x18d),'title':_0x3f5733[_0x4dd33f(0x13d)],'description':_0x3f5733['Ncplk'],'inputMethod':_0x4dd33f(0x163),'required':!0x1}]},'demoSchema':[{'tag':_0x3f5733['Mwont'],'properties':{'source':_0x3f5733[_0x4dd33f(0x162)],'card':!0x0,'citation':_0x4dd33f(0x12f)}}]};}}globalThis[_0x251840(0x185)][_0x251840(0x1a8)](MediaImage[_0x251840(0x195)],MediaImage);class MediaImageImage extends _0x3e2dcb(_0x62495c){static get[_0x251840(0x151)](){return[super['styles'],_0x38aff6`
        :host {
          display: block;
        }
        .image-wrap {
          overflow: hidden;
          height: fit-content;
        }
        :host([round]) .image-wrap {
          overflow: unset;
        }
        .image-wrap img {
          width: 100%;
        }
        :host([round]) .image-wrap img {
          border-radius: var(--ddd-radius-circle);
          height: fit-content;
          overflow: show;
          border: var(--ddd-border-sm);
          border-color: var(
            --ddd-component-figure-label-title,
            var(
              --ddd-theme-accent,
              var(
                --simple-colors-default-theme-accent-2,
                var(--ddd-theme-default-limestoneLight)
              )
            )
          );
        }
      `];}constructor(){var _0xc1fc0d=_0x251840,_0x21b965={'HBgQK':_0xc1fc0d(0x142)};super(),this['round']=!0x1,globalThis[_0xc1fc0d(0x148)]&&(this[_0xc1fc0d(0x158)]=globalThis[_0xc1fc0d(0x148)][_0xc1fc0d(0x11b)]('image-inspector'),this[_0xc1fc0d(0x158)]['noLeft']=!0x0),this[_0xc1fc0d(0x16e)]='',this[_0xc1fc0d(0x1a2)]&&this[_0xc1fc0d(0x1a2)](_0x21b965[_0xc1fc0d(0x15e)],this['__modalShowEvent'][_0xc1fc0d(0x194)](this));}[_0x251840(0x138)](_0x5e86d5){var _0x1d6fd5=_0x251840;import(_0x1d6fd5(0x146));}['render'](){var _0x4df7a0=_0x251840;return _0x4d80d0`
      <div class="image-wrap">
        <img src="${this[_0x4df7a0(0x130)]}" alt="${this['alt']}" loading="lazy" />
      </div>
    `;}['updated'](_0x4c7378){var _0x2e1594=_0x251840,_0xf64613={'aOueH':function(_0x458bec,_0x4881e7){return _0x458bec==_0x4881e7;}};_0x4c7378[_0x2e1594(0x188)]((_0x5292d6,_0x55d2eb)=>{var _0x409e15=_0x2e1594;_0x409e15(0x11f)===_0x409e15(0x11f)?_0xf64613['aOueH'](_0x409e15(0x130),_0x55d2eb)&&(this[_0x409e15(0x158)][_0x409e15(0x15c)]=this[_0x55d2eb]):this[_0x409e15(0x118)]=this[_0x409e15(0x16b)][_0x409e15(0x133)]>0x0||null!==this['querySelector'](_0x409e15(0x132));});}static get[_0x251840(0x1a7)](){var _0x223ed0=_0x251840,_0x4f0c2f={'aWwqH':_0x223ed0(0x12d)};return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x4f0c2f[_0x223ed0(0x180)]}};}static get[_0x251840(0x195)](){var _0x3f7cf8=_0x251840;return _0x3f7cf8(0x156);}}globalThis[_0x251840(0x185)][_0x251840(0x1a8)](MediaImageImage[_0x251840(0x195)],MediaImageImage);function _0x1f81(_0x71f9cc,_0x2fc841){var _0x1eb256=_0x1eb2();return _0x1f81=function(_0x1f817a,_0x345f3e){_0x1f817a=_0x1f817a-0x117;var _0x36d4bc=_0x1eb256[_0x1f817a];return _0x36d4bc;},_0x1f81(_0x71f9cc,_0x2fc841);}class MediaImageCitation extends _0x62495c{static get[_0x251840(0x151)](){return[super['styles'],_0x38aff6`
        :host {
          display: block;
          overflow: auto;
        }

        .citation {
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
        }
      `];}[_0x251840(0x119)](){return _0x4d80d0` <div class="citation"><slot></slot></div> `;}static get[_0x251840(0x195)](){var _0x15b6c9=_0x251840,_0x50df28={'IYTJw':_0x15b6c9(0x196)};return _0x50df28['IYTJw'];}}globalThis['customElements'][_0x251840(0x1a8)](MediaImageCitation[_0x251840(0x195)],MediaImageCitation);class MediaImageCaption extends _0x62495c{static get[_0x251840(0x151)](){return[super['styles'],_0x38aff6`
        :host {
          display: block;
          overflow: auto;
          margin-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
          font-family: var(--ddd-font-primary);
        }

        .caption ::slotted(*) {
          margin-top: 0;
        }
        .caption ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `];}[_0x251840(0x119)](){return _0x4d80d0`
      <div class="caption">
        ${this['__hasContent']?'':_0x4d80d0`<slot id="slot"></slot>`}
      </div>
    `;}static get['tag'](){var _0x280ec2=_0x251840;return _0x280ec2(0x173);}}globalThis[_0x251840(0x185)][_0x251840(0x1a8)](MediaImageCaption['tag'],MediaImageCaption);export{MediaImage};