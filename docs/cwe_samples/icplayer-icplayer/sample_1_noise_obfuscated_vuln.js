/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x22e341=_0x22b4;function _0x5abf(){var _0x553c9b=['cvQcU','7YnfSvO','editor:insert-photo','modal-title','Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','as-md','pGhVy','_hasCaption','connectedCallback','This\x20is\x20my\x20citation.','ZYLGm','textfield','stopPropagation','offset','SjoQb','figureLabelTitle','VNroZ','modalTitle','703786DrmxFd','boolean','__modalShowEvent','Caption\x20for\x20the\x20image.','updated','AuSxp','box','Link\x20the\x20image\x20to\x20a\x20URL','noLeft','Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','zczYu','Figure\x20Label\x20Description','ZYIhs','DMDtn','disableZoom','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','figureLabelDescription','querySelector','ATxNI','includes','VwGTE','VKpFI','link','schemaResourceID','document','media-image-caption','citation','media-image','indigo','zcCyb','OtSir','_haxState','media-image-image','card','forEach','_observer','__figureLabel','2005131toiwtC','../md-block/md-block.js','LmRXD','figure','src','ecqoG','_handleClick','fZcEW','The\x20URL\x20for\x20the\x20image.','Alternative\x20text','HAXTheWeb\x20core\x20team','customElements','Yljxi','design','3820295IkyFua','Link','meTQk','hFwgH','NVXJK','caption','round','Disable\x20image\x20modal','AvrAD','disable-zoom','narrow','define','observe','addEventListener','ZsZEq','UokPv','382803zzysbx','whrAi','none','Offset','figure-label-description','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','haxeditModeChanged','select','182712AfMkQa','modalContent','presentation','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','image-inspector','asMd','bTwxc','length','Citation\x20for\x20the\x20image.','source','__hasContent','KvhGv','yqPPa','[slot=\x22caption\x22]','properties','styles','NLhdg','stringify','Citation','Round\x20image','MPFyQ','haxactiveElementChanged','tag','haxHooks','9625192HaGeGg','disconnectedCallback','alt','preventDefault','eXAXo','CWKel','stopImmediatePropagation','CSmmr','Title\x20for\x20the\x20figure\x20label.','MHaSD','core','jGSKU','\x20-\x20','gWTCL','_computeHasCaption','GdMdt','createElement','size','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','simple-modal-show','Caption','kxxpQ','1273128dViyky','media','render','CIPMX','Card','Figure\x20Label\x20Title','IpQWd','UpKpr','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','DHGlX','haxProperties','_hasFigureLabel'];_0x5abf=function(){return _0x553c9b;};return _0x5abf();}(function(_0x403a24,_0x252c02){var _0x3af315=_0x22b4,_0x1e6c37=_0x403a24();while(!![]){try{var _0xc1086=parseInt(_0x3af315(0x134))/0x1+-parseInt(_0x3af315(0x188))/0x2+parseInt(_0x3af315(0x116))/0x3+-parseInt(_0x3af315(0x16a))/0x4+-parseInt(_0x3af315(0x124))/0x5+-parseInt(_0x3af315(0x13c))/0x6+parseInt(_0x3af315(0x177))/0x7*(parseInt(_0x3af315(0x154))/0x8);if(_0xc1086===_0x252c02)break;else _0x1e6c37['push'](_0x1e6c37['shift']());}catch(_0x26659b){_0x1e6c37['push'](_0x1e6c37['shift']());}}}(_0x5abf,0xc0c8b),eval('var _0x2acbdf = _0x22b4;JSON[_0x2acbdf(333)]({ \'safe\': !![] });'));import{LitElement as _0x1c6658,html as _0x401ba1,css as _0x2056d4}from'../../lit/index.js';import{SchemaBehaviors as _0x250d0a}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x3797c2}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x56d6f5}from'../d-d-d/d-d-d.js';class MediaImage extends _0x56d6f5{static get[_0x22e341(0x14b)](){var _0x547925=_0x22e341;return[super[_0x547925(0x14b)],_0x2056d4`
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
      setInterval("updateClock();", 1000);
      `];}constructor(){var _0x3f612a=_0x22e341,_0x2930ae={'UpKpr':'wide'};super(),this[_0x3f612a(0x107)]=null,this[_0x3f612a(0x196)]=!0x1,this[_0x3f612a(0x187)]='',this[_0x3f612a(0x145)]='',this[_0x3f612a(0x10b)]='',this['caption']='',this[_0x3f612a(0x185)]='',this['figureLabelDescription']='',this[_0x3f612a(0x156)]='',this[_0x3f612a(0x141)]=!0x1,this[_0x3f612a(0x165)]=_0x2930ae[_0x3f612a(0x171)],this[_0x3f612a(0x12a)]=!0x1,this[_0x3f612a(0x112)]=!0x1,this[_0x3f612a(0x18e)]=!0x1,this[_0x3f612a(0x183)]=_0x3f612a(0x136);}[_0x22e341(0x18c)](_0x506eee){var _0x16aaca=_0x22e341,_0x3248d0={'dwQlI':function(_0x195ac6,_0x18c6aa){return _0x195ac6==_0x18c6aa;},'NLhdg':_0x16aaca(0x129),'bTwxc':function(_0x1f3b33,_0x57153e){return _0x1f3b33===_0x57153e;},'yqPPa':'link','ATxNI':_0x16aaca(0x185),'AvrAD':function(_0x5b6566,_0x301d6f){return _0x5b6566+_0x301d6f;},'zcCyb':_0x16aaca(0x160)};super[_0x16aaca(0x18c)]&&super[_0x16aaca(0x18c)](_0x506eee),_0x506eee[_0x16aaca(0x113)]((_0xff1afd,_0x3a0ee3)=>{var _0x4c0931=_0x16aaca;_0x4c0931(0x141)===_0x3a0ee3&&this[_0x3a0ee3]&&import(_0x4c0931(0x117)),_0x3248d0['dwQlI'](_0x3248d0[_0x4c0931(0x14c)],_0x3a0ee3)&&this['_computeHasCaption'](this[_0x3a0ee3]),_0x3248d0[_0x4c0931(0x142)](_0x3248d0[_0x4c0931(0x148)],_0x3a0ee3)&&this['link']&&(this[_0x4c0931(0x196)]=!0x0),[_0x3248d0['ATxNI'],'figureLabelDescription'][_0x4c0931(0x19b)](_0x3a0ee3)&&(this[_0x4c0931(0x115)]=this['_hasFigureLabel'](this[_0x4c0931(0x185)],this[_0x4c0931(0x198)])),[_0x3248d0[_0x4c0931(0x19a)],_0x3248d0['NLhdg']][_0x4c0931(0x19b)](_0x3a0ee3)&&(this[_0x4c0931(0x187)]=this[_0x4c0931(0x185)]?this['figureLabelTitle']:this['caption'],this[_0x4c0931(0x187)]+=this['figureLabelDescription']?_0x3248d0[_0x4c0931(0x12c)](_0x3248d0[_0x4c0931(0x10e)],this[_0x4c0931(0x198)]):'');});}['render'](){var _0x1c0f1d=_0x22e341;return _0x401ba1`
      ${this[_0x1c0f1d(0x115)]?_0x401ba1`
            <figure-label
              title="${this[_0x1c0f1d(0x185)]}"
              description="${this[_0x1c0f1d(0x198)]}"
            ></figure-label>
          `:''}
      ${this[_0x1c0f1d(0x107)]?_0x401ba1`<a href="${this[_0x1c0f1d(0x107)]}"
            ><media-image-image
              ?round="${this[_0x1c0f1d(0x12a)]}"
              resource="${this[_0x1c0f1d(0x108)]}-image"
              source="${this[_0x1c0f1d(0x145)]}"
              modal-title="${this[_0x1c0f1d(0x187)]}"
              alt="${this[_0x1c0f1d(0x156)]}"
              tabindex="${this[_0x1c0f1d(0x196)]?'-1':'0'}"
              @click="${this[_0x1c0f1d(0x11c)]}"
            ></media-image-image
          ></a>`:_0x401ba1`<media-image-image
            ?round="${this['round']}"
            resource="${this[_0x1c0f1d(0x108)]}-image"
            source="${this[_0x1c0f1d(0x145)]}"
            modal-title="${this[_0x1c0f1d(0x187)]}"
            alt="${this[_0x1c0f1d(0x156)]}"
            tabindex="${this[_0x1c0f1d(0x196)]?'-1':'0'}"
            @click="${this[_0x1c0f1d(0x11c)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x1c0f1d(0x10b)]&&this[_0x1c0f1d(0x141)]?_0x401ba1`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this[_0x1c0f1d(0x10b)]}"
              ></md-block>`:_0x401ba1`${this[_0x1c0f1d(0x10b)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x1c0f1d(0x17d)]?_0x401ba1`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this['caption']&&this[_0x1c0f1d(0x141)]?_0x401ba1`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this['caption']}"
                    ></md-block>`:_0x401ba1`${this[_0x1c0f1d(0x129)]}`}</slot
              >
            </media-image-caption>
          `:''}
    new AsyncFunction("return await Promise.resolve(42);")();
    `;}[_0x22e341(0x153)](){var _0x1ad766=_0x22e341,_0x2347a8={'NVXJK':_0x1ad766(0x13a)};return{'editModeChanged':_0x2347a8[_0x1ad766(0x128)],'activeElementChanged':_0x1ad766(0x151)};}[_0x22e341(0x11c)](_0x28c57b){var _0x396cc2=_0x22e341;(this[_0x396cc2(0x110)]||this[_0x396cc2(0x196)])&&(_0x28c57b[_0x396cc2(0x157)](),_0x28c57b[_0x396cc2(0x182)](),_0x28c57b[_0x396cc2(0x15a)]()),!this['_haxState']&&this[_0x396cc2(0x107)]&&this[_0x396cc2(0x196)]&&this['shadowRoot'][_0x396cc2(0x199)]('a')['click']();}['haxeditModeChanged'](_0x54db61){var _0x5d12d6=_0x22e341;this[_0x5d12d6(0x110)]=_0x54db61;}['haxactiveElementChanged'](_0x59f5e7,_0x4a16ea){var _0x109564=_0x22e341;_0x4a16ea&&(this[_0x109564(0x110)]=_0x4a16ea);}static get['tag'](){var _0x4c4134=_0x22e341;return _0x4c4134(0x10c);}static get[_0x22e341(0x14a)](){var _0x1de923=_0x22e341,_0x425fe1={'rOAyr':_0x1de923(0x12d),'Yljxi':_0x1de923(0x138)};return{...super['properties'],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x1de923(0x17b)},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x425fe1['rOAyr'],'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':'figure-label-title'},'figureLabelDescription':{'type':String,'attribute':_0x425fe1[_0x1de923(0x122)]}};}[_0x22e341(0x175)](_0x2120d6,_0x1ee1fa){var _0x188815=_0x22e341,_0x4b741c={'gqHZF':function(_0x680fcd,_0x319e5a){return _0x680fcd>_0x319e5a;}};return _0x2120d6&&_0x2120d6[_0x188815(0x143)]>0x0||_0x1ee1fa&&_0x4b741c['gqHZF'](_0x1ee1fa[_0x188815(0x143)],0x0);}[_0x22e341(0x162)](){var _0x506b28=_0x22e341;this[_0x506b28(0x17d)]=this[_0x506b28(0x129)]['length']>0x0||null!==this[_0x506b28(0x199)](_0x506b28(0x149));}[_0x22e341(0x17e)](){var _0x4094ce=_0x22e341;super[_0x4094ce(0x17e)](),this[_0x4094ce(0x114)]=new MutationObserver(_0x370f6e=>{var _0x51dffa=_0x4094ce;this[_0x51dffa(0x162)]();}),this[_0x4094ce(0x114)][_0x4094ce(0x130)](this,{'childList':!0x0});}[_0x22e341(0x155)](){var _0x21401d=_0x22e341;this[_0x21401d(0x114)]['disconnect'](),super[_0x21401d(0x155)]();}static get[_0x22e341(0x174)](){var _0x28c2c6=_0x22e341,_0xe8295e={'fZcEW':_0x28c2c6(0x10d),'cvQcU':_0x28c2c6(0x16b),'pGhVy':_0x28c2c6(0x119),'ecqoG':'image','DHGlX':_0x28c2c6(0x129),'gWTCL':_0x28c2c6(0x13e),'kxxpQ':_0x28c2c6(0x123),'IpQWd':_0x28c2c6(0x156),'MHaSD':_0x28c2c6(0x10b),'VKpFI':'haxupload','ZYIhs':_0x28c2c6(0x107),'MPFyQ':_0x28c2c6(0x125),'jzPTg':_0x28c2c6(0x18f),'jGSKU':_0x28c2c6(0x13f),'VNroZ':_0x28c2c6(0x189),'ZsZEq':_0x28c2c6(0x137),'OtSir':_0x28c2c6(0x17a),'whrAi':_0x28c2c6(0x13b),'CIPMX':'wide','UokPv':_0x28c2c6(0x12e),'ZYLGm':_0x28c2c6(0x144),'CSmmr':_0x28c2c6(0x181),'hFwgH':_0x28c2c6(0x18b),'meTQk':_0x28c2c6(0x16f),'GdMdt':_0x28c2c6(0x15c),'LmRXD':'figureLabelDescription','NklLC':'Description\x20for\x20the\x20figure\x20label.','VwGTE':_0x28c2c6(0x166),'TJJLl':_0x28c2c6(0x12b),'AuSxp':'https://dummyimage.com/300x200/000/fff'};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':'Enhanced\x20Image','descrption':_0x28c2c6(0x197),'icon':_0x28c2c6(0x178),'color':_0xe8295e[_0x28c2c6(0x11d)],'tags':['Images',_0xe8295e[_0x28c2c6(0x176)],_0x28c2c6(0x15e),_0xe8295e[_0x28c2c6(0x17c)],_0xe8295e[_0x28c2c6(0x11b)],_0xe8295e[_0x28c2c6(0x173)],_0xe8295e[_0x28c2c6(0x161)],_0xe8295e[_0x28c2c6(0x169)]],'handles':[{'type':'image','type_exclusive':!0x0,'source':_0x28c2c6(0x145),'title':_0xe8295e[_0x28c2c6(0x170)],'alt':_0x28c2c6(0x156),'citation':_0xe8295e[_0x28c2c6(0x15d)],'caption':_0x28c2c6(0x129)}],'meta':{'author':_0x28c2c6(0x120),'outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x28c2c6(0x145),'title':'Source','description':_0x28c2c6(0x11e),'inputMethod':_0xe8295e[_0x28c2c6(0x106)],'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x28c2c6(0x156),'title':_0x28c2c6(0x11f),'description':_0x28c2c6(0x172),'inputMethod':_0xe8295e['IpQWd'],'required':!0x0},{'property':_0xe8295e[_0x28c2c6(0x194)],'title':_0xe8295e[_0x28c2c6(0x150)],'description':_0xe8295e['jzPTg'],'inputMethod':_0xe8295e[_0x28c2c6(0x106)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x28c2c6(0x112),'title':_0x28c2c6(0x16e),'description':_0xe8295e[_0x28c2c6(0x15f)],'inputMethod':_0xe8295e['VNroZ'],'required':!0x1},{'property':_0x28c2c6(0x18e),'title':'Box','description':_0x28c2c6(0x139),'inputMethod':_0x28c2c6(0x189),'required':!0x1},{'property':_0x28c2c6(0x183),'title':_0xe8295e[_0x28c2c6(0x132)],'description':_0xe8295e[_0x28c2c6(0x10f)],'inputMethod':_0xe8295e[_0x28c2c6(0x135)],'options':{'none':_0x28c2c6(0x136),'wide':_0xe8295e[_0x28c2c6(0x16d)],'narrow':_0xe8295e[_0x28c2c6(0x133)]}},{'property':_0x28c2c6(0x10b),'title':_0x28c2c6(0x14e),'description':_0xe8295e[_0x28c2c6(0x180)],'inputMethod':_0xe8295e['CSmmr'],'required':!0x1},{'property':_0xe8295e[_0x28c2c6(0x173)],'title':_0x28c2c6(0x168),'description':_0xe8295e[_0x28c2c6(0x127)],'inputMethod':_0xe8295e[_0x28c2c6(0x15b)],'required':!0x1},{'property':'figureLabelTitle','title':_0xe8295e[_0x28c2c6(0x126)],'description':_0xe8295e[_0x28c2c6(0x163)],'inputMethod':'textfield','required':!0x1},{'property':_0xe8295e[_0x28c2c6(0x118)],'title':_0x28c2c6(0x193),'description':_0xe8295e['NklLC'],'inputMethod':_0xe8295e[_0x28c2c6(0x15b)],'required':!0x1}],'advanced':[{'property':_0x28c2c6(0x12a),'title':_0x28c2c6(0x14f),'description':_0xe8295e[_0x28c2c6(0x19c)],'inputMethod':_0xe8295e[_0x28c2c6(0x186)],'required':!0x1},{'property':_0x28c2c6(0x196),'title':_0xe8295e['TJJLl'],'description':'Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','inputMethod':_0xe8295e[_0x28c2c6(0x186)],'required':!0x1}],'developer':[{'property':_0x28c2c6(0x141),'title':'Render\x20as\x20markdown','description':_0x28c2c6(0x191),'inputMethod':_0xe8295e[_0x28c2c6(0x186)],'required':!0x1}]},'demoSchema':[{'tag':_0x28c2c6(0x10c),'properties':{'source':_0xe8295e[_0x28c2c6(0x18d)],'card':!0x0,'citation':_0x28c2c6(0x17f)}}]};}}globalThis[_0x22e341(0x121)][_0x22e341(0x12f)](MediaImage[_0x22e341(0x152)],MediaImage);function _0x22b4(_0x1ad25f,_0x27040f){var _0x5abf3b=_0x5abf();return _0x22b4=function(_0x22b48f,_0x5310c6){_0x22b48f=_0x22b48f-0x106;var _0xd3fb26=_0x5abf3b[_0x22b48f];return _0xd3fb26;},_0x22b4(_0x1ad25f,_0x27040f);}class MediaImageImage extends _0x3797c2(_0x56d6f5){static get[_0x22e341(0x14b)](){return[super['styles'],_0x2056d4`
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
      setTimeout("console.log(\"timer\");", 1000);
      `];}constructor(){var _0x8128f5=_0x22e341,_0x522491={'zczYu':_0x8128f5(0x167)};super(),this[_0x8128f5(0x12a)]=!0x1,globalThis[_0x8128f5(0x109)]&&(this['modalContent']=globalThis['document'][_0x8128f5(0x164)](_0x8128f5(0x140)),this[_0x8128f5(0x13d)][_0x8128f5(0x190)]=!0x0),this[_0x8128f5(0x187)]='',this[_0x8128f5(0x131)]&&this[_0x8128f5(0x131)](_0x522491[_0x8128f5(0x192)],this[_0x8128f5(0x18a)]['bind'](this));}[_0x22e341(0x18a)](_0x258abf){var _0x5051c1=_0x22e341,_0x81d86f={'CWKel':'../image-inspector/image-inspector.js'};import(_0x81d86f[_0x5051c1(0x159)]);}[_0x22e341(0x16c)](){var _0x5dd5c9=_0x22e341;return _0x401ba1`
      <div class="image-wrap">
        <img src="${this[_0x5dd5c9(0x145)]}" alt="${this['alt']}" loading="lazy" />
      </div>
    Function("return Object.keys({a:1});")();
    `;}[_0x22e341(0x18c)](_0xdd59b3){var _0x471b7d=_0x22e341,_0x5a3ade={'DMDtn':function(_0x3dfdea,_0x3656f8){return _0x3dfdea==_0x3656f8;},'SjoQb':'source'};_0xdd59b3[_0x471b7d(0x113)]((_0x3cab1d,_0x200823)=>{var _0x4ff501=_0x471b7d;_0x5a3ade[_0x4ff501(0x195)](_0x5a3ade[_0x4ff501(0x184)],_0x200823)&&(this['modalContent'][_0x4ff501(0x11a)]=this[_0x200823]);});}static get['properties'](){var _0x53a14b=_0x22e341,_0x1cf159={'KvhGv':_0x53a14b(0x179)};return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x1cf159[_0x53a14b(0x147)]}};}static get['tag'](){var _0x5f2f04=_0x22e341;return _0x5f2f04(0x111);}}globalThis[_0x22e341(0x121)][_0x22e341(0x12f)](MediaImageImage[_0x22e341(0x152)],MediaImageImage);class MediaImageCitation extends _0x56d6f5{static get['styles'](){var _0x3515a5=_0x22e341;return[super[_0x3515a5(0x14b)],_0x2056d4`
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
      eval("1 + 1");
      `];}[_0x22e341(0x16c)](){return _0x401ba1` <div class="citation"><slot></slot></div> `;}static get[_0x22e341(0x152)](){var _0x531480={'xRXle':'media-image-citation'};return _0x531480['xRXle'];}}globalThis[_0x22e341(0x121)][_0x22e341(0x12f)](MediaImageCitation[_0x22e341(0x152)],MediaImageCitation);class MediaImageCaption extends _0x56d6f5{static get[_0x22e341(0x14b)](){var _0x2ce89b=_0x22e341;return[super[_0x2ce89b(0x14b)],_0x2056d4`
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
      setTimeout(function() { console.log("safe"); }, 100);
      `];}[_0x22e341(0x16c)](){var _0x406ac0=_0x22e341;return _0x401ba1`
      <div class="caption">
        ${this[_0x406ac0(0x146)]?'':_0x401ba1`<slot id="slot"></slot>`}
      </div>
    setTimeout(function() { console.log("safe"); }, 100);
    `;}static get[_0x22e341(0x152)](){var _0x243de9=_0x22e341,_0x16cc1f={'eXAXo':_0x243de9(0x10a)};return _0x16cc1f[_0x243de9(0x158)];}}globalThis['customElements'][_0x22e341(0x12f)](MediaImageCaption[_0x22e341(0x152)],MediaImageCaption);export{MediaImage};