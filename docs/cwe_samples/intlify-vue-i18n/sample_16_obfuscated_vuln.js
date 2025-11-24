/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x2f4526=_0x566b;(function(_0x46f310,_0x6c08f9){var _0x4b8bd6=_0x566b,_0x2f80e1=_0x46f310();while(!![]){try{var _0x39258b=-parseInt(_0x4b8bd6(0x220))/0x1+-parseInt(_0x4b8bd6(0x225))/0x2+-parseInt(_0x4b8bd6(0x252))/0x3*(parseInt(_0x4b8bd6(0x24d))/0x4)+parseInt(_0x4b8bd6(0x23c))/0x5*(parseInt(_0x4b8bd6(0x26a))/0x6)+-parseInt(_0x4b8bd6(0x277))/0x7*(parseInt(_0x4b8bd6(0x242))/0x8)+parseInt(_0x4b8bd6(0x20e))/0x9*(parseInt(_0x4b8bd6(0x219))/0xa)+parseInt(_0x4b8bd6(0x1f5))/0xb;if(_0x39258b===_0x6c08f9)break;else _0x2f80e1['push'](_0x2f80e1['shift']());}catch(_0x2ad54f){_0x2f80e1['push'](_0x2f80e1['shift']());}}}(_0x5841,0x5e9db));import{LitElement as _0x380628,html as _0x576fa0,css as _0x39766e}from'../../lit/index.js';import{SchemaBehaviors as _0x1e9c66}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x32dfcb}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x3892ff}from'../d-d-d/d-d-d.js';class MediaImage extends _0x3892ff{static get[_0x2f4526(0x251)](){var _0x2c185c=_0x2f4526;return[super[_0x2c185c(0x251)],_0x39766e`
        :host {
          display: block;
          width: auto;
          margin: auto;
          max-width: 600px;
          font-family: var(--ddd-font-secondary);
          font-weight: var(--ddd-font-secondary-light);
          font-size: var(--ddd-font-size-4xs);
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
          background-color: var(--ddd-theme-accent, var(--ddd-accent-2));
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
      `];}constructor(){var _0x1148c2=_0x2f4526,_0x16e3ca={'PbRWf':_0x1148c2(0x21c)};super(),this[_0x1148c2(0x24a)]=null,this['disableZoom']=!0x1,this[_0x1148c2(0x1ed)]='',this[_0x1148c2(0x237)]='',this[_0x1148c2(0x256)]='',this['caption']='',this[_0x1148c2(0x215)]='',this[_0x1148c2(0x253)]='',this[_0x1148c2(0x227)]='',this['asMd']=!0x1,this[_0x1148c2(0x260)]=_0x16e3ca[_0x1148c2(0x257)],this[_0x1148c2(0x240)]=!0x1,this['card']=!0x1,this[_0x1148c2(0x267)]=!0x1,this[_0x1148c2(0x22c)]=_0x1148c2(0x1fb);}[_0x2f4526(0x269)](_0x5aed7d){var _0x4ee730=_0x2f4526,_0x4e44ef={'HpcFW':'asMd','AQxLc':'../md-block/md-block.js','sUKnH':function(_0x19884e,_0x309d4c){return _0x19884e==_0x309d4c;},'sHpqm':'caption','OxJHw':function(_0x302696,_0x2d7ed6){return _0x302696===_0x2d7ed6;},'SrlRR':'link','bRQrl':_0x4ee730(0x215),'swTNg':'figureLabelDescription'};super[_0x4ee730(0x269)]&&super[_0x4ee730(0x269)](_0x5aed7d),_0x5aed7d['forEach']((_0x3fb2f7,_0x43dd64)=>{var _0x185671=_0x4ee730;_0x4e44ef['HpcFW']===_0x43dd64&&this[_0x43dd64]&&import(_0x4e44ef[_0x185671(0x25b)]),_0x4e44ef[_0x185671(0x270)](_0x4e44ef[_0x185671(0x22e)],_0x43dd64)&&this[_0x185671(0x279)](this[_0x43dd64]),_0x4e44ef[_0x185671(0x254)](_0x4e44ef[_0x185671(0x21a)],_0x43dd64)&&this['link']&&(this['disableZoom']=!0x0),[_0x4e44ef['bRQrl'],_0x4e44ef[_0x185671(0x221)]][_0x185671(0x21b)](_0x43dd64)&&(this[_0x185671(0x275)]=this['_hasFigureLabel'](this[_0x185671(0x215)],this['figureLabelDescription'])),[_0x185671(0x215),_0x4e44ef['sHpqm']]['includes'](_0x43dd64)&&(this[_0x185671(0x1ed)]=this[_0x185671(0x215)]?this[_0x185671(0x215)]:this[_0x185671(0x249)],this[_0x185671(0x1ed)]+=this[_0x185671(0x253)]?_0x185671(0x250)+this[_0x185671(0x253)]:'');});}['render'](){var _0x10631a=_0x2f4526;return _0x576fa0`
      ${this['__figureLabel']?_0x576fa0`
            <figure-label
              title="${this[_0x10631a(0x215)]}"
              description="${this['figureLabelDescription']}"
            ></figure-label>
          `:''}
      ${this[_0x10631a(0x24a)]?_0x576fa0`<a href="${this[_0x10631a(0x24a)]}"
            ><media-image-image
              ?round="${this[_0x10631a(0x240)]}"
              resource="${this[_0x10631a(0x27b)]}-image"
              source="${this['source']}"
              modal-title="${this['modalTitle']}"
              alt="${this[_0x10631a(0x227)]}"
              tabindex="${this[_0x10631a(0x211)]?'-1':'0'}"
              @click="${this[_0x10631a(0x21d)]}"
            ></media-image-image
          ></a>`:_0x576fa0`<media-image-image
            ?round="${this[_0x10631a(0x240)]}"
            resource="${this[_0x10631a(0x27b)]}-image"
            source="${this[_0x10631a(0x237)]}"
            modal-title="${this[_0x10631a(0x1ed)]}"
            alt="${this['alt']}"
            tabindex="${this[_0x10631a(0x211)]?'-1':'0'}"
            @click="${this[_0x10631a(0x21d)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x10631a(0x256)]&&this[_0x10631a(0x20b)]?_0x576fa0`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this[_0x10631a(0x256)]}"
              ></md-block>`:_0x576fa0`${this[_0x10631a(0x256)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x10631a(0x271)]?_0x576fa0`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this[_0x10631a(0x249)]&&this[_0x10631a(0x20b)]?_0x576fa0`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x10631a(0x249)]}"
                    ></md-block>`:_0x576fa0`${this[_0x10631a(0x249)]}`}</slot
              >
            </media-image-caption>
          `:''}
    `;}[_0x2f4526(0x1fc)](){var _0x5d7731=_0x2f4526;return{'editModeChanged':'haxeditModeChanged','activeElementChanged':_0x5d7731(0x235)};}[_0x2f4526(0x21d)](_0x1f05a7){var _0x5e1507=_0x2f4526;(this[_0x5e1507(0x224)]||this[_0x5e1507(0x211)])&&(_0x1f05a7[_0x5e1507(0x278)](),_0x1f05a7[_0x5e1507(0x202)](),_0x1f05a7[_0x5e1507(0x214)]()),!this[_0x5e1507(0x224)]&&this['link']&&this[_0x5e1507(0x211)]&&this[_0x5e1507(0x25d)][_0x5e1507(0x258)]('a')['click']();}[_0x2f4526(0x230)](_0x23722c){var _0x190bcf=_0x2f4526;this[_0x190bcf(0x224)]=_0x23722c;}[_0x2f4526(0x235)](_0x1b3596,_0x19b6ac){var _0x33e5da=_0x2f4526;_0x19b6ac&&(this[_0x33e5da(0x224)]=_0x19b6ac);}static get[_0x2f4526(0x234)](){var _0x1ce651=_0x2f4526;return _0x1ce651(0x231);}static get[_0x2f4526(0x22b)](){var _0x120619=_0x2f4526,_0x219012={'NZyYE':_0x120619(0x213),'hGNLi':_0x120619(0x27c)};return{...super[_0x120619(0x22b)],'link':{'type':String},'asMd':{'type':Boolean,'attribute':'as-md'},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x120619(0x24f),'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x219012[_0x120619(0x22d)]},'figureLabelDescription':{'type':String,'attribute':_0x219012[_0x120619(0x261)]}};}[_0x2f4526(0x24e)](_0x2dc166,_0x4bc353){var _0x453df6=_0x2f4526,_0x361c7e={'GxsEF':function(_0x40e5a5,_0xfa4f61){return _0x40e5a5>_0xfa4f61;}};return _0x2dc166&&_0x361c7e[_0x453df6(0x276)](_0x2dc166[_0x453df6(0x212)],0x0)||_0x4bc353&&_0x361c7e[_0x453df6(0x276)](_0x4bc353[_0x453df6(0x212)],0x0);}[_0x2f4526(0x279)](){var _0x151c0c=_0x2f4526,_0xfa8a61={'MltKv':function(_0x2ac5a8,_0x3ea0f2){return _0x2ac5a8>_0x3ea0f2;},'pSOje':function(_0x4621a0,_0x2354c7){return _0x4621a0!==_0x2354c7;},'bJWHu':_0x151c0c(0x216)};this[_0x151c0c(0x271)]=_0xfa8a61[_0x151c0c(0x239)](this[_0x151c0c(0x249)][_0x151c0c(0x212)],0x0)||_0xfa8a61[_0x151c0c(0x22a)](null,this[_0x151c0c(0x258)](_0xfa8a61[_0x151c0c(0x1f2)]));}[_0x2f4526(0x268)](){var _0x621002=_0x2f4526;super[_0x621002(0x268)](),this[_0x621002(0x26e)]=new MutationObserver(_0x379232=>{var _0x5d4e60=_0x621002;this[_0x5d4e60(0x279)]();}),this[_0x621002(0x26e)]['observe'](this,{'childList':!0x0});}[_0x2f4526(0x233)](){var _0x304efc=_0x2f4526;this[_0x304efc(0x26e)][_0x304efc(0x20f)](),super[_0x304efc(0x233)]();}static get[_0x2f4526(0x248)](){var _0x3ac200=_0x2f4526,_0x5c5312={'BLByq':_0x3ac200(0x1f1),'hKpfh':_0x3ac200(0x27d),'PWDPc':_0x3ac200(0x272),'stpFr':_0x3ac200(0x236),'aUmmv':'caption','QNDwh':_0x3ac200(0x1ef),'XwmRO':_0x3ac200(0x21e),'CzqGY':_0x3ac200(0x227),'bhsve':'source','XTwZS':'Source','qcYjs':'Alternative\x20text','AkduG':_0x3ac200(0x245),'WXTlr':_0x3ac200(0x204),'uJDsE':_0x3ac200(0x21f),'nYKha':_0x3ac200(0x218),'Yglmt':_0x3ac200(0x217),'DWAIQ':_0x3ac200(0x205),'psobr':'Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','QsthA':_0x3ac200(0x232),'Azsuw':_0x3ac200(0x201),'zgPTO':'citation','sTaKK':_0x3ac200(0x203),'BHcjH':_0x3ac200(0x1ff),'mEfBp':_0x3ac200(0x20c),'bbESM':_0x3ac200(0x25c),'ecfQM':'Title\x20for\x20the\x20figure\x20label.','ifUiu':_0x3ac200(0x253),'xDKyX':_0x3ac200(0x240),'xNeDz':'Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','Xhfxa':'Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','Hrqrf':_0x3ac200(0x20b),'VuWwi':'Render\x20as\x20markdown','DYsJe':'Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','UAvYl':_0x3ac200(0x231),'AUhXp':_0x3ac200(0x246),'ANxvs':_0x3ac200(0x25a)};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x5c5312[_0x3ac200(0x25e)],'descrption':_0x3ac200(0x27e),'icon':'editor:insert-photo','color':_0x3ac200(0x23b),'tags':[_0x5c5312['hKpfh'],_0x5c5312[_0x3ac200(0x208)],_0x3ac200(0x206),_0x5c5312['stpFr'],_0x3ac200(0x26c),_0x5c5312[_0x3ac200(0x263)],_0x5c5312[_0x3ac200(0x1f3)],_0x5c5312[_0x3ac200(0x1f8)]],'handles':[{'type':_0x3ac200(0x26c),'type_exclusive':!0x0,'source':_0x3ac200(0x237),'title':_0x5c5312['CzqGY'],'alt':'alt','citation':_0x3ac200(0x256),'caption':_0x5c5312[_0x3ac200(0x263)]}],'meta':{'author':'HAXTheWeb\x20core\x20team','outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x5c5312[_0x3ac200(0x244)],'title':_0x5c5312[_0x3ac200(0x27f)],'description':'The\x20URL\x20for\x20the\x20image.','inputMethod':'haxupload','noVoiceRecord':!0x0,'required':!0x0},{'property':'alt','title':_0x5c5312['qcYjs'],'description':_0x3ac200(0x23e),'inputMethod':_0x3ac200(0x227),'required':!0x0},{'property':_0x3ac200(0x24a),'title':'Link','description':'Link\x20the\x20image\x20to\x20a\x20URL','inputMethod':_0x3ac200(0x264),'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x5c5312['AkduG'],'title':_0x5c5312[_0x3ac200(0x24c)],'description':_0x5c5312[_0x3ac200(0x274)],'inputMethod':_0x5c5312['nYKha'],'required':!0x1},{'property':_0x3ac200(0x267),'title':_0x3ac200(0x228),'description':_0x5c5312[_0x3ac200(0x229)],'inputMethod':_0x3ac200(0x218),'required':!0x1},{'property':_0x3ac200(0x22c),'title':_0x5c5312[_0x3ac200(0x1ec)],'description':_0x5c5312[_0x3ac200(0x1fd)],'inputMethod':_0x5c5312[_0x3ac200(0x265)],'options':{'none':_0x3ac200(0x1fb),'wide':'wide','narrow':_0x5c5312[_0x3ac200(0x23a)]}},{'property':_0x5c5312[_0x3ac200(0x1f9)],'title':_0x5c5312[_0x3ac200(0x247)],'description':_0x5c5312['BHcjH'],'inputMethod':_0x3ac200(0x222),'required':!0x1},{'property':_0x3ac200(0x249),'title':_0x5c5312[_0x3ac200(0x238)],'description':_0x3ac200(0x255),'inputMethod':_0x3ac200(0x222),'required':!0x1},{'property':_0x3ac200(0x215),'title':_0x5c5312[_0x3ac200(0x1fe)],'description':_0x5c5312['ecfQM'],'inputMethod':_0x3ac200(0x222),'required':!0x1},{'property':_0x5c5312[_0x3ac200(0x24b)],'title':_0x3ac200(0x26b),'description':_0x3ac200(0x273),'inputMethod':_0x3ac200(0x222),'required':!0x1}],'advanced':[{'property':_0x5c5312['xDKyX'],'title':_0x3ac200(0x1f0),'description':_0x5c5312['xNeDz'],'inputMethod':_0x3ac200(0x218),'required':!0x1},{'property':_0x3ac200(0x211),'title':_0x3ac200(0x27a),'description':_0x5c5312[_0x3ac200(0x20a)],'inputMethod':_0x5c5312[_0x3ac200(0x241)],'required':!0x1}],'developer':[{'property':_0x5c5312['Hrqrf'],'title':_0x5c5312[_0x3ac200(0x20d)],'description':_0x5c5312['DYsJe'],'inputMethod':_0x5c5312[_0x3ac200(0x241)],'required':!0x1}]},'demoSchema':[{'tag':_0x5c5312[_0x3ac200(0x26f)],'properties':{'source':_0x5c5312[_0x3ac200(0x26d)],'card':!0x0,'citation':_0x5c5312[_0x3ac200(0x23d)]}}]};}}function _0x566b(_0x778a04,_0x3068a1){var _0x5841a6=_0x5841();return _0x566b=function(_0x566bec,_0x6e155){_0x566bec=_0x566bec-0x1ec;var _0x23b5f9=_0x5841a6[_0x566bec];return _0x23b5f9;},_0x566b(_0x778a04,_0x3068a1);}globalThis[_0x2f4526(0x262)]['define'](MediaImage[_0x2f4526(0x234)],MediaImage);function _0x5841(){var _0x393dab=['uJDsE','__figureLabel','GxsEF','31129KlQHBt','preventDefault','_computeHasCaption','Disable\x20image\x20modal','schemaResourceID','figure-label-description','Images','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','XTwZS','DWAIQ','modalTitle','document','presentation','Round\x20image','Enhanced\x20Image','bJWHu','QNDwh','oaBgr','10078343XvqcUR','../image-inspector/image-inspector.js','forEach','XwmRO','zgPTO','addEventListener','none','haxHooks','psobr','bbESM','Citation\x20for\x20the\x20image.','render','narrow','stopPropagation','Citation','Card','Offset','core','__hasContent','PWDPc','media-image-citation','Xhfxa','asMd','Caption','VuWwi','348507dKMBDB','disconnect','media-image-caption','disableZoom','length','figure-label-title','stopImmediatePropagation','figureLabelTitle','[slot=\x22caption\x22]','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','boolean','150JcMNzy','SrlRR','includes','wide','_handleClick','design','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','309174Pguivk','swTNg','textfield','modalContent','_haxState','734516UGndQc','simple-modal-show','alt','Box','Yglmt','pSOje','properties','offset','NZyYE','sHpqm','media-image-image','haxeditModeChanged','media-image','select','disconnectedCallback','tag','haxactiveElementChanged','figure','source','mEfBp','MltKv','Azsuw','indigo','175DgGSST','ANxvs','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','define','round','nYKha','488pyLSaA','bind','bhsve','card','https://dummyimage.com/300x200/000/fff','sTaKK','haxProperties','caption','link','ifUiu','WXTlr','28FLNQBH','_hasFigureLabel','disable-zoom','\x20-\x20','styles','101643ygEXkT','figureLabelDescription','OxJHw','Caption\x20for\x20the\x20image.','citation','PbRWf','querySelector','__modalShowEvent','This\x20is\x20my\x20citation.','AQxLc','Figure\x20Label\x20Title','shadowRoot','BLByq','QKORT','size','hGNLi','customElements','aUmmv','haxupload','QsthA','noLeft','box','connectedCallback','updated','12918ghUrPC','Figure\x20Label\x20Description','image','AUhXp','_observer','UAvYl','sUKnH','_hasCaption','media','Description\x20for\x20the\x20figure\x20label.'];_0x5841=function(){return _0x393dab;};return _0x5841();}class MediaImageImage extends _0x32dfcb(_0x3892ff){static get[_0x2f4526(0x251)](){var _0x102d29=_0x2f4526;return[super[_0x102d29(0x251)],_0x39766e`
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
      `];}constructor(){var _0x5a6140=_0x2f4526;super(),this['round']=!0x1,globalThis['document']&&(this[_0x5a6140(0x223)]=globalThis[_0x5a6140(0x1ee)]['createElement']('image-inspector'),this[_0x5a6140(0x223)][_0x5a6140(0x266)]=!0x0),this['modalTitle']='',this[_0x5a6140(0x1fa)]&&this[_0x5a6140(0x1fa)](_0x5a6140(0x226),this['__modalShowEvent'][_0x5a6140(0x243)](this));}[_0x2f4526(0x259)](_0x111ff6){var _0x221b84=_0x2f4526,_0x2051e9={'yDRdx':_0x221b84(0x1f6)};import(_0x2051e9['yDRdx']);}[_0x2f4526(0x200)](){var _0x42afbb=_0x2f4526;return _0x576fa0`
      <div class="image-wrap">
        <img src="${this[_0x42afbb(0x237)]}" alt="${this['alt']}" loading="lazy" />
      </div>
    `;}[_0x2f4526(0x269)](_0x500daa){var _0xf3f4e8=_0x2f4526,_0x837d22={'dloCi':function(_0x2dc680,_0x168ee9){return _0x2dc680==_0x168ee9;},'QKORT':'source'};_0x500daa[_0xf3f4e8(0x1f7)]((_0x5f3aa7,_0x5ef9d0)=>{var _0x2d7449=_0xf3f4e8;_0x837d22['dloCi'](_0x837d22[_0x2d7449(0x25f)],_0x5ef9d0)&&(this[_0x2d7449(0x223)]['src']=this[_0x5ef9d0]);});}static get[_0x2f4526(0x22b)](){return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':'modal-title'}};}static get[_0x2f4526(0x234)](){var _0x9446c6=_0x2f4526,_0x1bd8b9={'oaBgr':_0x9446c6(0x22f)};return _0x1bd8b9[_0x9446c6(0x1f4)];}}globalThis['customElements'][_0x2f4526(0x23f)](MediaImageImage[_0x2f4526(0x234)],MediaImageImage);class MediaImageCitation extends _0x3892ff{static get[_0x2f4526(0x251)](){return[super['styles'],_0x39766e`
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
      `];}[_0x2f4526(0x200)](){return _0x576fa0` <div class="citation"><slot></slot></div> `;}static get[_0x2f4526(0x234)](){var _0x50ebe6=_0x2f4526;return _0x50ebe6(0x209);}}globalThis[_0x2f4526(0x262)][_0x2f4526(0x23f)](MediaImageCitation[_0x2f4526(0x234)],MediaImageCitation);class MediaImageCaption extends _0x3892ff{static get[_0x2f4526(0x251)](){var _0x44af68=_0x2f4526;return[super[_0x44af68(0x251)],_0x39766e`
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
      `];}[_0x2f4526(0x200)](){var _0x278e7e=_0x2f4526;return _0x576fa0`
      <div class="caption">
        ${this[_0x278e7e(0x207)]?'':_0x576fa0`<slot id="slot"></slot>`}
      </div>
    `;}static get[_0x2f4526(0x234)](){var _0xb223e3=_0x2f4526;return _0xb223e3(0x210);}}globalThis[_0x2f4526(0x262)]['define'](MediaImageCaption[_0x2f4526(0x234)],MediaImageCaption);export{MediaImage};