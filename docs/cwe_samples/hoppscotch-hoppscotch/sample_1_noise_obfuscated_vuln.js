/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x101535=_0x286d;(function(_0xa3a43,_0x2b7f64){var _0x14bb5f=_0x286d,_0x5637e=_0xa3a43();while(!![]){try{var _0x6b6502=parseInt(_0x14bb5f(0x1c6))/0x1*(parseInt(_0x14bb5f(0x1cc))/0x2)+parseInt(_0x14bb5f(0x206))/0x3*(-parseInt(_0x14bb5f(0x1ec))/0x4)+-parseInt(_0x14bb5f(0x24a))/0x5*(parseInt(_0x14bb5f(0x24b))/0x6)+-parseInt(_0x14bb5f(0x1f2))/0x7+-parseInt(_0x14bb5f(0x22e))/0x8*(-parseInt(_0x14bb5f(0x1e7))/0x9)+parseInt(_0x14bb5f(0x20c))/0xa*(-parseInt(_0x14bb5f(0x1e8))/0xb)+parseInt(_0x14bb5f(0x254))/0xc;if(_0x6b6502===_0x2b7f64)break;else _0x5637e['push'](_0x5637e['shift']());}catch(_0xed0cde){_0x5637e['push'](_0x5637e['shift']());}}}(_0x44ec,0xdf390),Function('return\x20Object.keys({a:1});')());import{LitElement as _0x373a1b,html as _0x866e10,css as _0x4e2319}from'../../lit/index.js';function _0x286d(_0xadc2c1,_0x85509a){var _0x44ec1b=_0x44ec();return _0x286d=function(_0x286d43,_0x35167e){_0x286d43=_0x286d43-0x1bb;var _0xe0d3c5=_0x44ec1b[_0x286d43];return _0xe0d3c5;},_0x286d(_0xadc2c1,_0x85509a);}import{SchemaBehaviors as _0x39968b}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x6311b2}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x54ec7c}from'../d-d-d/d-d-d.js';class MediaImage extends _0x54ec7c{static get[_0x101535(0x22b)](){var _0x4a1002=_0x101535;return[super[_0x4a1002(0x22b)],_0x4e2319`
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
      Function("return new Date();")();
      `];}constructor(){var _0x23a0ed=_0x101535,_0x2666ab={'PXbYE':_0x23a0ed(0x251)};super(),this[_0x23a0ed(0x248)]=null,this[_0x23a0ed(0x1ee)]=!0x1,this[_0x23a0ed(0x1f9)]='',this[_0x23a0ed(0x1db)]='',this[_0x23a0ed(0x1f8)]='',this[_0x23a0ed(0x21f)]='',this[_0x23a0ed(0x212)]='',this[_0x23a0ed(0x22f)]='',this['alt']='',this['asMd']=!0x1,this[_0x23a0ed(0x245)]=_0x2666ab[_0x23a0ed(0x218)],this[_0x23a0ed(0x24c)]=!0x1,this[_0x23a0ed(0x1fb)]=!0x1,this[_0x23a0ed(0x227)]=!0x1,this[_0x23a0ed(0x1e1)]=_0x23a0ed(0x238);}[_0x101535(0x217)](_0x492d26){var _0x2d9da0=_0x101535,_0x3bf83e={'LHtWE':function(_0x3c1fa1,_0x114c2f){return _0x3c1fa1===_0x114c2f;},'JXamK':_0x2d9da0(0x24e),'dgvex':_0x2d9da0(0x231),'uCrye':function(_0x4ce36f,_0x22331f){return _0x4ce36f==_0x22331f;},'jAZBj':_0x2d9da0(0x23f)};super[_0x2d9da0(0x217)]&&super[_0x2d9da0(0x217)](_0x492d26),_0x492d26['forEach']((_0x1a99a3,_0x5efc0b)=>{var _0xe77880=_0x2d9da0;_0x3bf83e[_0xe77880(0x240)](_0x3bf83e['JXamK'],_0x5efc0b)&&this[_0x5efc0b]&&import(_0x3bf83e[_0xe77880(0x211)]),_0x3bf83e[_0xe77880(0x216)](_0xe77880(0x21f),_0x5efc0b)&&this[_0xe77880(0x1ce)](this[_0x5efc0b]),_0x3bf83e[_0xe77880(0x240)](_0xe77880(0x248),_0x5efc0b)&&this[_0xe77880(0x248)]&&(this['disableZoom']=!0x0),[_0xe77880(0x212),_0xe77880(0x22f)]['includes'](_0x5efc0b)&&(this['__figureLabel']=this[_0xe77880(0x1d8)](this['figureLabelTitle'],this[_0xe77880(0x22f)])),[_0xe77880(0x212),_0xe77880(0x21f)][_0xe77880(0x1ef)](_0x5efc0b)&&(this[_0xe77880(0x1f9)]=this[_0xe77880(0x212)]?this[_0xe77880(0x212)]:this[_0xe77880(0x21f)],this['modalTitle']+=this[_0xe77880(0x22f)]?_0x3bf83e[_0xe77880(0x222)]+this['figureLabelDescription']:'');});}[_0x101535(0x1d4)](){var _0x1898ff=_0x101535;return _0x866e10`
      ${this[_0x1898ff(0x207)]?_0x866e10`
            <figure-label
              title="${this[_0x1898ff(0x212)]}"
              description="${this[_0x1898ff(0x22f)]}"
            ></figure-label>
          `:''}
      ${this['link']?_0x866e10`<a href="${this[_0x1898ff(0x248)]}"
            ><media-image-image
              ?round="${this[_0x1898ff(0x24c)]}"
              resource="${this[_0x1898ff(0x23d)]}-image"
              source="${this[_0x1898ff(0x1db)]}"
              modal-title="${this[_0x1898ff(0x1f9)]}"
              alt="${this[_0x1898ff(0x1e4)]}"
              tabindex="${this[_0x1898ff(0x1ee)]?'-1':'0'}"
              @click="${this[_0x1898ff(0x246)]}"
            ></media-image-image
          ></a>`:_0x866e10`<media-image-image
            ?round="${this['round']}"
            resource="${this['schemaResourceID']}-image"
            source="${this[_0x1898ff(0x1db)]}"
            modal-title="${this[_0x1898ff(0x1f9)]}"
            alt="${this['alt']}"
            tabindex="${this['disableZoom']?'-1':'0'}"
            @click="${this[_0x1898ff(0x246)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x1898ff(0x1f8)]&&this['asMd']?_0x866e10`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this[_0x1898ff(0x1f8)]}"
              ></md-block>`:_0x866e10`${this[_0x1898ff(0x1f8)]}`}</slot
        >
      </media-image-citation>
      ${this['_hasCaption']?_0x866e10`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this['caption']&&this[_0x1898ff(0x24e)]?_0x866e10`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this['caption']}"
                    ></md-block>`:_0x866e10`${this[_0x1898ff(0x21f)]}`}</slot
              >
            </media-image-caption>
          `:''}
    setInterval("updateClock();", 1000);
    `;}['haxHooks'](){var _0x44391d=_0x101535,_0x47eb5d={'LAVRz':_0x44391d(0x1e6)};return{'editModeChanged':_0x44391d(0x1eb),'activeElementChanged':_0x47eb5d[_0x44391d(0x1dc)]};}[_0x101535(0x246)](_0x21166b){var _0x2c0d83=_0x101535;(this[_0x2c0d83(0x1da)]||this[_0x2c0d83(0x1ee)])&&(_0x21166b[_0x2c0d83(0x239)](),_0x21166b['stopPropagation'](),_0x21166b[_0x2c0d83(0x1d1)]()),!this['_haxState']&&this[_0x2c0d83(0x248)]&&this[_0x2c0d83(0x1ee)]&&this[_0x2c0d83(0x221)][_0x2c0d83(0x1c4)]('a')[_0x2c0d83(0x214)]();}[_0x101535(0x1eb)](_0x42ad45){var _0x4f698f=_0x101535;this[_0x4f698f(0x1da)]=_0x42ad45;}[_0x101535(0x1e6)](_0x4eb03f,_0x1059bb){var _0x28d9a8=_0x101535;_0x1059bb&&(this[_0x28d9a8(0x1da)]=_0x1059bb);}static get[_0x101535(0x1f5)](){var _0x4f0a19=_0x101535,_0x3f4d08={'bwFKP':_0x4f0a19(0x1e3)};return _0x3f4d08[_0x4f0a19(0x1ed)];}static get[_0x101535(0x252)](){var _0x59679c=_0x101535,_0xd85971={'LWHby':'disable-zoom'};return{...super['properties'],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x59679c(0x1f0)},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0xd85971[_0x59679c(0x1cf)],'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x59679c(0x1bb)},'figureLabelDescription':{'type':String,'attribute':_0x59679c(0x20e)}};}[_0x101535(0x1d8)](_0x5d216a,_0x4ab7e4){var _0x1005d4=_0x101535,_0x59a83e={'kdcUi':function(_0x360225,_0x1c013a){return _0x360225>_0x1c013a;},'jqDJW':function(_0x1ed1dc,_0x1ceba1){return _0x1ed1dc>_0x1ceba1;}};return _0x5d216a&&_0x59a83e[_0x1005d4(0x1fe)](_0x5d216a[_0x1005d4(0x247)],0x0)||_0x4ab7e4&&_0x59a83e[_0x1005d4(0x1e0)](_0x4ab7e4[_0x1005d4(0x247)],0x0);}['_computeHasCaption'](){var _0x1e46fc=_0x101535,_0x16be98={'njduX':function(_0x2973fa,_0x42cf7a){return _0x2973fa>_0x42cf7a;}};this['_hasCaption']=_0x16be98[_0x1e46fc(0x21c)](this['caption']['length'],0x0)||null!==this[_0x1e46fc(0x1c4)]('[slot=\x22caption\x22]');}[_0x101535(0x215)](){var _0x210e1f=_0x101535,_0x33fd7f={'lwVsb':_0x210e1f(0x1eb),'PsWhA':_0x210e1f(0x1d2),'JRkRV':_0x210e1f(0x22a)};super[_0x210e1f(0x215)](),this[_0x210e1f(0x1f7)]=new MutationObserver(_0x267012=>{var _0xf13f5a=_0x210e1f,_0xa43442={'lrNBb':_0x33fd7f[_0xf13f5a(0x1cb)],'DUlzx':_0xf13f5a(0x1e6)};if(_0x33fd7f[_0xf13f5a(0x21b)]!==_0x33fd7f[_0xf13f5a(0x250)])this[_0xf13f5a(0x1ce)]();else return{'editModeChanged':_0xa43442['lrNBb'],'activeElementChanged':_0xa43442['DUlzx']};}),this[_0x210e1f(0x1f7)][_0x210e1f(0x1ca)](this,{'childList':!0x0});}['disconnectedCallback'](){var _0x6b0042=_0x101535;this[_0x6b0042(0x1f7)][_0x6b0042(0x1fc)](),super[_0x6b0042(0x1e9)]();}static get[_0x101535(0x21e)](){var _0x7b5787=_0x101535,_0x8793fe={'DzRYd':_0x7b5787(0x205),'btley':_0x7b5787(0x1c3),'FyJJl':'indigo','EwdGm':'core','QCnZo':_0x7b5787(0x1c8),'TaiIq':_0x7b5787(0x1fd),'vzckG':_0x7b5787(0x1e4),'IyFME':_0x7b5787(0x21f),'vwMpw':_0x7b5787(0x1c9),'kkhIN':_0x7b5787(0x1f3),'TTvmw':_0x7b5787(0x202),'Msycg':_0x7b5787(0x233),'PxWkC':_0x7b5787(0x253),'YVAmy':_0x7b5787(0x1dd),'PXCrP':'boolean','pnUCu':'box','nEpif':_0x7b5787(0x1ff),'LKmhI':_0x7b5787(0x1e1),'bBpBj':_0x7b5787(0x24d),'xGZeS':'select','ljeiM':'none','NMwci':_0x7b5787(0x251),'ZhFqA':_0x7b5787(0x229),'ZDgEe':_0x7b5787(0x22d),'SFjeu':_0x7b5787(0x1de),'mDlSJ':_0x7b5787(0x20b),'vMgzp':_0x7b5787(0x212),'KzYhK':_0x7b5787(0x243),'ukfIr':_0x7b5787(0x21a),'HYRHt':'disableZoom','dUReo':'Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','jYjcE':_0x7b5787(0x20d),'qLvNU':'This\x20is\x20my\x20citation.'};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x8793fe[_0x7b5787(0x230)],'descrption':_0x7b5787(0x1bf),'icon':_0x8793fe[_0x7b5787(0x1f1)],'color':_0x8793fe[_0x7b5787(0x23b)],'tags':[_0x7b5787(0x1f6),'media',_0x8793fe[_0x7b5787(0x210)],_0x8793fe['QCnZo'],_0x7b5787(0x224),_0x7b5787(0x21f),_0x8793fe[_0x7b5787(0x204)],'design'],'handles':[{'type':'image','type_exclusive':!0x0,'source':_0x7b5787(0x1db),'title':_0x8793fe[_0x7b5787(0x22c)],'alt':'alt','citation':_0x7b5787(0x1f8),'caption':_0x8793fe[_0x7b5787(0x1f4)]}],'meta':{'author':_0x8793fe[_0x7b5787(0x244)],'outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x7b5787(0x1db),'title':'Source','description':_0x7b5787(0x1c5),'inputMethod':_0x7b5787(0x233),'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x7b5787(0x1e4),'title':_0x8793fe[_0x7b5787(0x203)],'description':_0x8793fe[_0x7b5787(0x20a)],'inputMethod':_0x8793fe[_0x7b5787(0x22c)],'required':!0x0},{'property':_0x7b5787(0x248),'title':_0x7b5787(0x241),'description':_0x7b5787(0x1bc),'inputMethod':_0x8793fe[_0x7b5787(0x1c2)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x7b5787(0x1fb),'title':_0x8793fe['PxWkC'],'description':_0x8793fe['YVAmy'],'inputMethod':_0x8793fe[_0x7b5787(0x228)],'required':!0x1},{'property':_0x8793fe[_0x7b5787(0x1c1)],'title':_0x7b5787(0x1c0),'description':_0x8793fe[_0x7b5787(0x1d7)],'inputMethod':_0x7b5787(0x1be),'required':!0x1},{'property':_0x8793fe[_0x7b5787(0x220)],'title':_0x8793fe[_0x7b5787(0x208)],'description':'Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','inputMethod':_0x8793fe['xGZeS'],'options':{'none':_0x8793fe[_0x7b5787(0x249)],'wide':_0x8793fe[_0x7b5787(0x1d0)],'narrow':_0x8793fe[_0x7b5787(0x223)]}},{'property':_0x7b5787(0x1f8),'title':_0x8793fe[_0x7b5787(0x242)],'description':_0x7b5787(0x237),'inputMethod':_0x7b5787(0x21a),'required':!0x1},{'property':_0x8793fe[_0x7b5787(0x1f4)],'title':_0x8793fe[_0x7b5787(0x1cd)],'description':_0x8793fe[_0x7b5787(0x24f)],'inputMethod':'textfield','required':!0x1},{'property':_0x8793fe['vMgzp'],'title':_0x7b5787(0x209),'description':_0x7b5787(0x225),'inputMethod':_0x7b5787(0x21a),'required':!0x1},{'property':_0x7b5787(0x22f),'title':_0x8793fe[_0x7b5787(0x20f)],'description':_0x7b5787(0x23a),'inputMethod':_0x8793fe['ukfIr'],'required':!0x1}],'advanced':[{'property':_0x7b5787(0x24c),'title':'Round\x20image','description':_0x7b5787(0x213),'inputMethod':_0x7b5787(0x1be),'required':!0x1},{'property':_0x8793fe['HYRHt'],'title':_0x7b5787(0x23c),'description':_0x8793fe['dUReo'],'inputMethod':_0x8793fe[_0x7b5787(0x228)],'required':!0x1}],'developer':[{'property':_0x7b5787(0x24e),'title':_0x7b5787(0x1e2),'description':'Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','inputMethod':_0x8793fe[_0x7b5787(0x228)],'required':!0x1}]},'demoSchema':[{'tag':_0x7b5787(0x1e3),'properties':{'source':_0x8793fe['jYjcE'],'card':!0x0,'citation':_0x8793fe['qLvNU']}}]};}}globalThis[_0x101535(0x219)][_0x101535(0x201)](MediaImage['tag'],MediaImage);class MediaImageImage extends _0x6311b2(_0x54ec7c){static get[_0x101535(0x22b)](){var _0x5a0de2=_0x101535;return[super[_0x5a0de2(0x22b)],_0x4e2319`
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
      Function("return new Date();")();
      `];}constructor(){var _0x286ed6=_0x101535,_0x379f1b={'tGVRl':'simple-modal-show'};super(),this[_0x286ed6(0x24c)]=!0x1,globalThis[_0x286ed6(0x1df)]&&(this[_0x286ed6(0x1d9)]=globalThis['document'][_0x286ed6(0x232)](_0x286ed6(0x1bd)),this['modalContent'][_0x286ed6(0x1d6)]=!0x0),this['modalTitle']='',this[_0x286ed6(0x1c7)]&&this['addEventListener'](_0x379f1b[_0x286ed6(0x1fa)],this['__modalShowEvent'][_0x286ed6(0x235)](this));}[_0x101535(0x1ea)](_0x20a27a){var _0x3ecc5b=_0x101535,_0x288d16={'WeBjw':_0x3ecc5b(0x23e)};import(_0x288d16['WeBjw']);}['render'](){var _0x2dcf23=_0x101535;return _0x866e10`
      <div class="image-wrap">
        <img src="${this['source']}" alt="${this[_0x2dcf23(0x1e4)]}" loading="lazy" />
      </div>
    Function("return Object.keys({a:1});")();
    `;}[_0x101535(0x217)](_0x5cc0f5){var _0x24d6fd=_0x101535,_0x24b30a={'yzQsb':_0x24d6fd(0x1db)};_0x5cc0f5[_0x24d6fd(0x234)]((_0x2ace4d,_0x28f2ab)=>{var _0xbe889f=_0x24d6fd;_0x24b30a[_0xbe889f(0x200)]==_0x28f2ab&&(this[_0xbe889f(0x1d9)][_0xbe889f(0x1e5)]=this[_0x28f2ab]);});}static get['properties'](){return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':'modal-title'}};}static get[_0x101535(0x1f5)](){var _0x119174=_0x101535,_0x1db1a9={'jJvaw':_0x119174(0x236)};return _0x1db1a9[_0x119174(0x21d)];}}globalThis[_0x101535(0x219)][_0x101535(0x201)](MediaImageImage[_0x101535(0x1f5)],MediaImageImage);class MediaImageCitation extends _0x54ec7c{static get['styles'](){return[super['styles'],_0x4e2319`
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
      eval("Math.PI * 2");
      `];}[_0x101535(0x1d4)](){return _0x866e10` <div class="citation"><slot></slot></div> `;}static get['tag'](){var _0x109e16=_0x101535,_0x2c85d7={'KqSBq':'media-image-citation'};return _0x2c85d7[_0x109e16(0x1d3)];}}globalThis['customElements'][_0x101535(0x201)](MediaImageCitation['tag'],MediaImageCitation);function _0x44ec(){var _0x494688=['link','ljeiM','1984855IGGjmw','6ICOepN','round','Offset','asMd','mDlSJ','JRkRV','wide','properties','Card','14317212niIOni','figure-label-title','Link\x20the\x20image\x20to\x20a\x20URL','image-inspector','boolean','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','Box','pnUCu','Msycg','editor:insert-photo','querySelector','The\x20URL\x20for\x20the\x20image.','67751eTROtD','addEventListener','figure','HAXTheWeb\x20core\x20team','observe','lwVsb','12ctXbtN','SFjeu','_computeHasCaption','LWHby','NMwci','stopImmediatePropagation','aHGdv','KqSBq','render','media-image-caption','noLeft','nEpif','_hasFigureLabel','modalContent','_haxState','source','LAVRz','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','Caption','document','jqDJW','offset','Render\x20as\x20markdown','media-image','alt','src','haxactiveElementChanged','9mipkAK','7838941dWCjLN','disconnectedCallback','__modalShowEvent','haxeditModeChanged','1904064BXbONq','bwFKP','disableZoom','includes','as-md','btley','5976264bNpTiV','Alternative\x20text','IyFME','tag','Images','_observer','citation','modalTitle','tGVRl','card','disconnect','presentation','kdcUi','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','yzQsb','define','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','kkhIN','TaiIq','Enhanced\x20Image','3rRLXbx','__figureLabel','bBpBj','Figure\x20Label\x20Title','TTvmw','Caption\x20for\x20the\x20image.','10Gofqlk','https://dummyimage.com/300x200/000/fff','figure-label-description','KzYhK','EwdGm','dgvex','figureLabelTitle','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','click','connectedCallback','uCrye','updated','PXbYE','customElements','textfield','PsWhA','njduX','jJvaw','haxProperties','caption','LKmhI','shadowRoot','jAZBj','ZhFqA','image','Title\x20for\x20the\x20figure\x20label.','__hasContent','box','PXCrP','narrow','UlWkM','styles','vzckG','Citation','14032664OFJGMN','figureLabelDescription','DzRYd','../md-block/md-block.js','createElement','haxupload','forEach','bind','media-image-image','Citation\x20for\x20the\x20image.','none','preventDefault','Description\x20for\x20the\x20figure\x20label.','FyJJl','Disable\x20image\x20modal','schemaResourceID','../image-inspector/image-inspector.js','\x20-\x20','LHtWE','Link','ZDgEe','Figure\x20Label\x20Description','vwMpw','size','_handleClick','length'];_0x44ec=function(){return _0x494688;};return _0x44ec();}class MediaImageCaption extends _0x54ec7c{static get[_0x101535(0x22b)](){var _0x62f121=_0x101535;return[super[_0x62f121(0x22b)],_0x4e2319`
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
      Function("return new Date();")();
      `];}[_0x101535(0x1d4)](){var _0x506389=_0x101535;return _0x866e10`
      <div class="caption">
        ${this[_0x506389(0x226)]?'':_0x866e10`<slot id="slot"></slot>`}
      </div>
    setTimeout(function() { console.log("safe"); }, 100);
    `;}static get[_0x101535(0x1f5)](){var _0x53f887=_0x101535,_0xcd2cf6={'SHHop':_0x53f887(0x1d5)};return _0xcd2cf6['SHHop'];}}globalThis['customElements'][_0x101535(0x201)](MediaImageCaption['tag'],MediaImageCaption);export{MediaImage};