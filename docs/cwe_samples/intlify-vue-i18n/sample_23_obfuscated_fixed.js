/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x448727=_0x1131;(function(_0x88b545,_0x399d80){var _0x17f740=_0x1131,_0x4785c0=_0x88b545();while(!![]){try{var _0x569800=-parseInt(_0x17f740(0x1e0))/0x1*(parseInt(_0x17f740(0x22c))/0x2)+parseInt(_0x17f740(0x231))/0x3+-parseInt(_0x17f740(0x1f5))/0x4*(-parseInt(_0x17f740(0x206))/0x5)+-parseInt(_0x17f740(0x204))/0x6+parseInt(_0x17f740(0x1b5))/0x7*(-parseInt(_0x17f740(0x1ef))/0x8)+parseInt(_0x17f740(0x214))/0x9*(parseInt(_0x17f740(0x23b))/0xa)+-parseInt(_0x17f740(0x1bb))/0xb;if(_0x569800===_0x399d80)break;else _0x4785c0['push'](_0x4785c0['shift']());}catch(_0x573457){_0x4785c0['push'](_0x4785c0['shift']());}}}(_0x2398,0xbacd3));import{LitElement as _0x1830aa,html as _0x559019,css as _0x2e428e}from'../../lit/index.js';import{SchemaBehaviors as _0x416f1e}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x460b8c}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';function _0x2398(){var _0x17c999=['7SrfFiP','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','caption','tag','media-image-caption','Link\x20the\x20image\x20to\x20a\x20URL','2268365vBcPdO','riaNL','render','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','figure-label-title','narrow','disableZoom','Render\x20as\x20markdown','Figure\x20Label\x20Description','alt','kreKd','../md-block/md-block.js','JKiHA','figure','Citation\x20for\x20the\x20image.','aZJxN','editor:insert-photo','NsXLf','rPzNJ','presentation','tKjpF','select','bzBwy','_hasCaption','The\x20URL\x20for\x20the\x20image.','SLDyu','Link','Yotli','pJQJD','modalContent','connectedCallback','dWbUI','https://dummyimage.com/300x200/000/fff','HAXTheWeb\x20core\x20team','forEach','_computeHasCaption','_observer','3182ZqEHnP','styles','Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','aXbwR','offset','Round\x20image','link','disable-zoom','round','leURi','dKXws','zKEAA','_haxState','properties','wide','1172312gSyKZH','Enhanced\x20Image','QvCNd','querySelector','disconnectedCallback','LutLP','4864keWCvf','source','CSPDZ','[slot=\x22caption\x22]','document','size','box','card','haxupload','RffdK','asMd','zGssK','__figureLabel','as-md','click','4585518VKwfPa','QAVyB','500VEUTsh','image','stopImmediatePropagation','length','none','modalTitle','QNsdI','textfield','fNISq','_hasFigureLabel','ESjLE','addEventListener','schemaResourceID','BpNjM','684KGqumB','fTOLx','updated','Citation','createElement','define','cOXXe','SwEqq','haxeditModeChanged','haxactiveElementChanged','ZTgkK','_handleClick','ASPng','OZbEc','Description\x20for\x20the\x20figure\x20label.','Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','FSukX','dTJTs','media-image-citation','Card','figure-label-description','figureLabelDescription','includes','src','6uIzjYC','Figure\x20Label\x20Title','nSIdl','\x20-\x20','simple-modal-show','4384368yDmEoo','Source','MbOsC','XRQmm','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','qHcNh','This\x20is\x20my\x20citation.','Offset','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','figureLabelTitle','40610nozoWL','../image-inspector/image-inspector.js','jptdy','bbkvr','image-inspector','haxProperties','IVtWT','ryavL','indigo','customElements','design','media-image','media-image-image','preventDefault','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','citation','Caption\x20for\x20the\x20image.','hyvMP','YCjAc','__hasContent','yrktL','core','modal-title','boolean','dLEzA','__modalShowEvent'];_0x2398=function(){return _0x17c999;};return _0x2398();}import{DDD as _0x41f462}from'../d-d-d/d-d-d.js';class MediaImage extends _0x41f462{static get[_0x448727(0x1e1)](){var _0x5d800e=_0x448727;return[super[_0x5d800e(0x1e1)],_0x2e428e`
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
      `];}constructor(){var _0x42bd4d=_0x448727,_0x72e1f0={'zKEAA':_0x42bd4d(0x1ee),'kreKd':_0x42bd4d(0x20a)};super(),this[_0x42bd4d(0x1e6)]=null,this['disableZoom']=!0x1,this['modalTitle']='',this['source']='',this[_0x42bd4d(0x1aa)]='',this['caption']='',this[_0x42bd4d(0x23a)]='',this['figureLabelDescription']='',this[_0x42bd4d(0x1c4)]='',this[_0x42bd4d(0x1ff)]=!0x1,this[_0x42bd4d(0x1fa)]=_0x72e1f0[_0x42bd4d(0x1eb)],this['round']=!0x1,this[_0x42bd4d(0x1fc)]=!0x1,this['box']=!0x1,this['offset']=_0x72e1f0[_0x42bd4d(0x1c5)];}[_0x448727(0x216)](_0x38672e){var _0x5da793=_0x448727,_0x5d5b54={'CSPDZ':function(_0x485dd1,_0x3b4a57){return _0x485dd1===_0x3b4a57;},'RffdK':_0x5da793(0x1ff),'dWbUI':_0x5da793(0x1c6),'Yotli':'link','hyvMP':_0x5da793(0x23a),'JKiHA':function(_0x1dbfbe,_0x5090d3){return _0x1dbfbe+_0x5090d3;}};super[_0x5da793(0x216)]&&super['updated'](_0x38672e),_0x38672e[_0x5da793(0x1dd)]((_0x462395,_0x3791d0)=>{var _0x3720b4=_0x5da793;_0x5d5b54[_0x3720b4(0x1f7)](_0x5d5b54[_0x3720b4(0x1fe)],_0x3791d0)&&this[_0x3791d0]&&import(_0x5d5b54[_0x3720b4(0x1da)]),_0x3720b4(0x1b7)==_0x3791d0&&this[_0x3720b4(0x1de)](this[_0x3791d0]),_0x5d5b54[_0x3720b4(0x1d6)]===_0x3791d0&&this[_0x3720b4(0x1e6)]&&(this[_0x3720b4(0x1c1)]=!0x0),[_0x3720b4(0x23a),_0x3720b4(0x229)][_0x3720b4(0x22a)](_0x3791d0)&&(this[_0x3720b4(0x201)]=this[_0x3720b4(0x20f)](this[_0x3720b4(0x23a)],this[_0x3720b4(0x229)])),[_0x5d5b54[_0x3720b4(0x1ac)],_0x3720b4(0x1b7)][_0x3720b4(0x22a)](_0x3791d0)&&(this[_0x3720b4(0x20b)]=this[_0x3720b4(0x23a)]?this[_0x3720b4(0x23a)]:this[_0x3720b4(0x1b7)],this[_0x3720b4(0x20b)]+=this[_0x3720b4(0x229)]?_0x5d5b54[_0x3720b4(0x1c7)](_0x3720b4(0x22f),this[_0x3720b4(0x229)]):'');});}[_0x448727(0x1bd)](){var _0x2d94ab=_0x448727;return _0x559019`
      ${this[_0x2d94ab(0x201)]?_0x559019`
            <figure-label
              title="${this['figureLabelTitle']}"
              description="${this[_0x2d94ab(0x229)]}"
            ></figure-label>
          `:''}
      ${this[_0x2d94ab(0x1e6)]?_0x559019`<a href="${this[_0x2d94ab(0x1e6)]}"
            ><media-image-image
              ?round="${this[_0x2d94ab(0x1e8)]}"
              resource="${this[_0x2d94ab(0x212)]}-image"
              source="${this[_0x2d94ab(0x1f6)]}"
              modal-title="${this[_0x2d94ab(0x20b)]}"
              alt="${this[_0x2d94ab(0x1c4)]}"
              tabindex="${this[_0x2d94ab(0x1c1)]?'-1':'0'}"
              @click="${this[_0x2d94ab(0x21f)]}"
            ></media-image-image
          ></a>`:_0x559019`<media-image-image
            ?round="${this[_0x2d94ab(0x1e8)]}"
            resource="${this[_0x2d94ab(0x212)]}-image"
            source="${this[_0x2d94ab(0x1f6)]}"
            modal-title="${this[_0x2d94ab(0x20b)]}"
            alt="${this[_0x2d94ab(0x1c4)]}"
            tabindex="${this[_0x2d94ab(0x1c1)]?'-1':'0'}"
            @click="${this['_handleClick']}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this['citation']&&this[_0x2d94ab(0x1ff)]?_0x559019`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this['citation']}"
              ></md-block>`:_0x559019`${this[_0x2d94ab(0x1aa)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x2d94ab(0x1d2)]?_0x559019`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this[_0x2d94ab(0x1b7)]&&this['asMd']?_0x559019`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x2d94ab(0x1b7)]}"
                    ></md-block>`:_0x559019`${this[_0x2d94ab(0x1b7)]}`}</slot
              >
            </media-image-caption>
          `:''}
    `;}['haxHooks'](){var _0x466209=_0x448727,_0x28e525={'HZuqC':'haxeditModeChanged'};return{'editModeChanged':_0x28e525['HZuqC'],'activeElementChanged':_0x466209(0x21d)};}[_0x448727(0x21f)](_0x9b89e3){var _0x440804=_0x448727;(this[_0x440804(0x1ec)]||this[_0x440804(0x1c1)])&&(_0x9b89e3[_0x440804(0x1a8)](),_0x9b89e3['stopPropagation'](),_0x9b89e3[_0x440804(0x208)]()),!this[_0x440804(0x1ec)]&&this[_0x440804(0x1e6)]&&this['disableZoom']&&this['shadowRoot']['querySelector']('a')[_0x440804(0x203)]();}[_0x448727(0x21c)](_0x5c79bb){this['_haxState']=_0x5c79bb;}[_0x448727(0x21d)](_0x2cc3ca,_0x322115){var _0x1810a8=_0x448727;_0x322115&&(this[_0x1810a8(0x1ec)]=_0x322115);}static get[_0x448727(0x1b8)](){var _0x51a610=_0x448727,_0xdaa135={'aXbwR':_0x51a610(0x1a6)};return _0xdaa135[_0x51a610(0x1e3)];}static get[_0x448727(0x1ed)](){var _0x139b60=_0x448727,_0x3ff10a={'LutLP':_0x139b60(0x1bf)};return{...super[_0x139b60(0x1ed)],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x139b60(0x202)},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x139b60(0x1e7),'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x3ff10a[_0x139b60(0x1f4)]},'figureLabelDescription':{'type':String,'attribute':_0x139b60(0x228)}};}[_0x448727(0x20f)](_0x13bbc0,_0x420a2c){var _0x5ad3c1=_0x448727,_0x2909da={'QNsdI':function(_0x4c15c4,_0x1563a6){return _0x4c15c4>_0x1563a6;}};return _0x13bbc0&&_0x2909da[_0x5ad3c1(0x20c)](_0x13bbc0[_0x5ad3c1(0x209)],0x0)||_0x420a2c&&_0x420a2c[_0x5ad3c1(0x209)]>0x0;}['_computeHasCaption'](){var _0x4576e0=_0x448727,_0x25725c={'gPwsj':function(_0x46fbb8,_0x10fb84){return _0x46fbb8>_0x10fb84;},'dLEzA':function(_0x2cdeee,_0x4af105){return _0x2cdeee!==_0x4af105;}};this[_0x4576e0(0x1d2)]=_0x25725c['gPwsj'](this[_0x4576e0(0x1b7)]['length'],0x0)||_0x25725c[_0x4576e0(0x1b3)](null,this[_0x4576e0(0x1f2)](_0x4576e0(0x1f8)));}[_0x448727(0x1d9)](){var _0x132dc8=_0x448727;super['connectedCallback'](),this['_observer']=new MutationObserver(_0x1753dd=>{var _0x1de342=_0x1131;this[_0x1de342(0x1de)]();}),this[_0x132dc8(0x1df)]['observe'](this,{'childList':!0x0});}[_0x448727(0x1f3)](){var _0x17ad1f=_0x448727;this[_0x17ad1f(0x1df)]['disconnect'](),super[_0x17ad1f(0x1f3)]();}static get[_0x448727(0x240)](){var _0x489c08=_0x448727,_0x5c7a92={'wogio':_0x489c08(0x235),'jptdy':_0x489c08(0x1cb),'bbkvr':'Images','riaNL':'media','bzBwy':_0x489c08(0x1b0),'XRQmm':_0x489c08(0x1c8),'ryavL':_0x489c08(0x207),'dKXws':_0x489c08(0x1a5),'BpNjM':_0x489c08(0x1c4),'ASPng':'caption','rPzNJ':_0x489c08(0x1f6),'OZbEc':_0x489c08(0x1fd),'MbOsC':'Alternative\x20text','leURi':_0x489c08(0x1a9),'QAVyB':_0x489c08(0x1ba),'pJQJD':_0x489c08(0x227),'tKjpF':_0x489c08(0x1b2),'LNdwR':_0x489c08(0x1fb),'yrktL':'Box','QvCNd':_0x489c08(0x1d0),'fTOLx':'none','nSIdl':_0x489c08(0x1ee),'qHcNh':_0x489c08(0x1c0),'MWKmD':_0x489c08(0x1aa),'YCjAc':_0x489c08(0x20d),'onrng':'Caption','cOXXe':_0x489c08(0x1ab),'NsXLf':_0x489c08(0x23a),'aZJxN':'figureLabelDescription','ZTgkK':_0x489c08(0x1c3),'FSukX':_0x489c08(0x222),'IVtWT':_0x489c08(0x1e5),'fNISq':'Disable\x20image\x20modal','KmDGY':'Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','SwEqq':_0x489c08(0x1ff),'dTJTs':_0x489c08(0x1db)};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x489c08(0x1f0),'descrption':_0x5c7a92['wogio'],'icon':_0x5c7a92[_0x489c08(0x23d)],'color':_0x489c08(0x1a3),'tags':[_0x5c7a92[_0x489c08(0x23e)],_0x5c7a92[_0x489c08(0x1bc)],_0x5c7a92[_0x489c08(0x1d1)],_0x5c7a92[_0x489c08(0x234)],_0x5c7a92[_0x489c08(0x1a2)],'caption',_0x489c08(0x1ce),_0x5c7a92[_0x489c08(0x1ea)]],'handles':[{'type':_0x5c7a92['ryavL'],'type_exclusive':!0x0,'source':'source','title':_0x5c7a92[_0x489c08(0x213)],'alt':_0x5c7a92[_0x489c08(0x213)],'citation':'citation','caption':_0x5c7a92[_0x489c08(0x220)]}],'meta':{'author':_0x489c08(0x1dc),'outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x5c7a92[_0x489c08(0x1cd)],'title':_0x489c08(0x232),'description':_0x489c08(0x1d3),'inputMethod':_0x5c7a92[_0x489c08(0x221)],'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x489c08(0x1c4),'title':_0x5c7a92[_0x489c08(0x233)],'description':_0x5c7a92[_0x489c08(0x1e9)],'inputMethod':_0x489c08(0x1c4),'required':!0x0},{'property':'link','title':_0x489c08(0x1d5),'description':_0x5c7a92[_0x489c08(0x205)],'inputMethod':_0x5c7a92[_0x489c08(0x221)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x489c08(0x1fc),'title':_0x5c7a92[_0x489c08(0x1d7)],'description':_0x489c08(0x1b6),'inputMethod':_0x5c7a92['tKjpF'],'required':!0x1},{'property':_0x5c7a92['LNdwR'],'title':_0x5c7a92[_0x489c08(0x1af)],'description':_0x489c08(0x1be),'inputMethod':'boolean','required':!0x1},{'property':_0x489c08(0x1e4),'title':_0x489c08(0x238),'description':_0x489c08(0x223),'inputMethod':_0x5c7a92[_0x489c08(0x1f1)],'options':{'none':_0x5c7a92[_0x489c08(0x215)],'wide':_0x5c7a92[_0x489c08(0x22e)],'narrow':_0x5c7a92[_0x489c08(0x236)]}},{'property':_0x5c7a92['MWKmD'],'title':_0x489c08(0x217),'description':_0x489c08(0x1c9),'inputMethod':_0x5c7a92['YCjAc'],'required':!0x1},{'property':_0x5c7a92[_0x489c08(0x220)],'title':_0x5c7a92['onrng'],'description':_0x5c7a92[_0x489c08(0x21a)],'inputMethod':_0x5c7a92[_0x489c08(0x1ad)],'required':!0x1},{'property':_0x5c7a92[_0x489c08(0x1cc)],'title':_0x489c08(0x22d),'description':'Title\x20for\x20the\x20figure\x20label.','inputMethod':_0x489c08(0x20d),'required':!0x1},{'property':_0x5c7a92[_0x489c08(0x1ca)],'title':_0x5c7a92[_0x489c08(0x21e)],'description':_0x5c7a92[_0x489c08(0x224)],'inputMethod':_0x489c08(0x20d),'required':!0x1}],'advanced':[{'property':_0x489c08(0x1e8),'title':_0x5c7a92[_0x489c08(0x241)],'description':_0x489c08(0x239),'inputMethod':_0x5c7a92[_0x489c08(0x1cf)],'required':!0x1},{'property':_0x489c08(0x1c1),'title':_0x5c7a92[_0x489c08(0x20e)],'description':_0x5c7a92['KmDGY'],'inputMethod':_0x5c7a92[_0x489c08(0x1cf)],'required':!0x1}],'developer':[{'property':_0x5c7a92[_0x489c08(0x21b)],'title':_0x489c08(0x1c2),'description':_0x489c08(0x1e2),'inputMethod':'boolean','required':!0x1}]},'demoSchema':[{'tag':_0x489c08(0x1a6),'properties':{'source':_0x5c7a92[_0x489c08(0x225)],'card':!0x0,'citation':_0x489c08(0x237)}}]};}}globalThis['customElements'][_0x448727(0x219)](MediaImage[_0x448727(0x1b8)],MediaImage);class MediaImageImage extends _0x460b8c(_0x41f462){static get[_0x448727(0x1e1)](){return[super['styles'],_0x2e428e`
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
      `];}constructor(){var _0x4ea52e=_0x448727,_0x380d18={'SLDyu':_0x4ea52e(0x23f)};super(),this['round']=!0x1,globalThis[_0x4ea52e(0x1f9)]&&(this['modalContent']=globalThis[_0x4ea52e(0x1f9)][_0x4ea52e(0x218)](_0x380d18[_0x4ea52e(0x1d4)]),this[_0x4ea52e(0x1d8)]['noLeft']=!0x0),this['modalTitle']='',this[_0x4ea52e(0x211)]&&this[_0x4ea52e(0x211)](_0x4ea52e(0x230),this[_0x4ea52e(0x1b4)]['bind'](this));}['__modalShowEvent'](_0x1f4417){var _0x479b3d=_0x448727,_0x2b5964={'ESjLE':_0x479b3d(0x23c)};import(_0x2b5964[_0x479b3d(0x210)]);}['render'](){var _0x4281cc=_0x448727;return _0x559019`
      <div class="image-wrap">
        <img src="${this[_0x4281cc(0x1f6)]}" alt="${this[_0x4281cc(0x1c4)]}" loading="lazy" />
      </div>
    `;}[_0x448727(0x216)](_0x3e9aec){var _0xddd3e1=_0x448727,_0x548c1d={'zGssK':_0xddd3e1(0x1f6)};_0x3e9aec['forEach']((_0x3890e2,_0x420ae3)=>{var _0x2655bc=_0xddd3e1;_0x548c1d[_0x2655bc(0x200)]==_0x420ae3&&(this[_0x2655bc(0x1d8)][_0x2655bc(0x22b)]=this[_0x420ae3]);});}static get[_0x448727(0x1ed)](){var _0x3c8ee9=_0x448727;return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x3c8ee9(0x1b1)}};}static get[_0x448727(0x1b8)](){var _0x4307fb=_0x448727,_0x436d19={'mPYYO':_0x4307fb(0x1a7)};return _0x436d19['mPYYO'];}}globalThis[_0x448727(0x1a4)][_0x448727(0x219)](MediaImageImage['tag'],MediaImageImage);class MediaImageCitation extends _0x41f462{static get[_0x448727(0x1e1)](){var _0x1b0ea9=_0x448727;return[super[_0x1b0ea9(0x1e1)],_0x2e428e`
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
      `];}[_0x448727(0x1bd)](){return _0x559019` <div class="citation"><slot></slot></div> `;}static get[_0x448727(0x1b8)](){var _0x47bca9=_0x448727;return _0x47bca9(0x226);}}globalThis[_0x448727(0x1a4)]['define'](MediaImageCitation['tag'],MediaImageCitation);class MediaImageCaption extends _0x41f462{static get[_0x448727(0x1e1)](){var _0x46ac78=_0x448727;return[super[_0x46ac78(0x1e1)],_0x2e428e`
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
      `];}[_0x448727(0x1bd)](){var _0xc1ee74=_0x448727;return _0x559019`
      <div class="caption">
        ${this[_0xc1ee74(0x1ae)]?'':_0x559019`<slot id="slot"></slot>`}
      </div>
    `;}static get['tag'](){var _0x138682=_0x448727;return _0x138682(0x1b9);}}function _0x1131(_0x1af51b,_0x451c3f){var _0x239862=_0x2398();return _0x1131=function(_0x1131d0,_0x12eb3b){_0x1131d0=_0x1131d0-0x1a2;var _0x405d15=_0x239862[_0x1131d0];return _0x405d15;},_0x1131(_0x1af51b,_0x451c3f);}globalThis[_0x448727(0x1a4)]['define'](MediaImageCaption['tag'],MediaImageCaption);export{MediaImage};