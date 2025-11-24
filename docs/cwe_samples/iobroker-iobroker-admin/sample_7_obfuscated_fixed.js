/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
function _0x47a5(){var _0x732cc1=['FrfAT','indigo','design','4534584hkKYDY','figure-label-description','../image-inspector/image-inspector.js','Card','eTmbr','zmhWi','5197625nUfJCy','phRyH','Mohjy','Disable\x20image\x20modal','core','2353600ZBOOZk','select','480ZmeYDH','EvIwI','EgPaK','NlHYG','Rqhfl','hnRTt','Description\x20for\x20the\x20figure\x20label.','pipLy','figureLabelDescription','disable-zoom','round','WUexW','bLbGo','HAXTheWeb\x20core\x20team','hLUlR','tag','_haxState','keKJq','offset','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','modal-title','none','mVwEU','figure','7kjOrYr','SYRAp','disconnectedCallback','USQgK','UVoQN','xBHSt','nUMxg','createElement','__figureLabel','caption','Round\x20image','ihAAa','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','311mYybbQ','QqbcB','src','observe','media','https://dummyimage.com/300x200/000/fff','figureLabelTitle','Link\x20the\x20image\x20to\x20a\x20URL','2161305rQvuxu','1659472SSerMa','connectedCallback','Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','addEventListener','wide','editor:insert-photo','Box','Figure\x20Label\x20Description','render','schemaResourceID','noLeft','_observer','Link','querySelector','card','VPbjC','This\x20is\x20my\x20citation.','styles','_hasCaption','yeIpb','wWeVq','properties','Citation\x20for\x20the\x20image.','haxupload','box','disableZoom','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','stopImmediatePropagation','dSlXm','stopPropagation','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','Dtvaa','figure-label-title','presentation','IiuIp','media-image','20DXFIwK','Render\x20as\x20markdown','../md-block/md-block.js','define','modalTitle','click','Offset','forEach','Zozvr','AnHiB','\x20-\x20','IfcqH','disconnect','shadowRoot','VdZpr','WRqUy','media-image-citation','haxeditModeChanged','asMd','The\x20URL\x20for\x20the\x20image.','Caption\x20for\x20the\x20image.','NCxkP','1219626zHdgWP','alt','siHDa','ngbyR','hoXWW','_computeHasCaption','length','cGksN','dImjH','WuIyl','__modalShowEvent','_hasFigureLabel','image','Images','zTDKF','Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','_handleClick','document','updated','TPMGV','Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','as-md','haxProperties','citation','BZcSR','Source','OcAwq','boolean','link','includes','YRQUr','sXyed','Enhanced\x20Image','[slot=\x22caption\x22]','customElements','haxactiveElementChanged','source','GrebG','textfield','modalContent'];_0x47a5=function(){return _0x732cc1;};return _0x47a5();}var _0x43fa29=_0x5492;(function(_0x5928e4,_0x5c8bf3){var _0x25dc6a=_0x5492,_0x266503=_0x5928e4();while(!![]){try{var _0x547f27=-parseInt(_0x25dc6a(0xe5))/0x1*(-parseInt(_0x25dc6a(0xc0))/0x2)+-parseInt(_0x25dc6a(0x128))/0x3+parseInt(_0x25dc6a(0xee))/0x4+parseInt(_0x25dc6a(0xb9))/0x5+parseInt(_0x25dc6a(0xb3))/0x6*(-parseInt(_0x25dc6a(0xd8))/0x7)+-parseInt(_0x25dc6a(0xbe))/0x8+parseInt(_0x25dc6a(0xed))/0x9*(parseInt(_0x25dc6a(0x112))/0xa);if(_0x547f27===_0x5c8bf3)break;else _0x266503['push'](_0x266503['shift']());}catch(_0x4beb61){_0x266503['push'](_0x266503['shift']());}}}(_0x47a5,0x86f71));import{LitElement as _0xf94779,html as _0x7dca3b,css as _0x197fe3}from'../../lit/index.js';function _0x5492(_0x5a6220,_0x3a68a5){var _0x47a529=_0x47a5();return _0x5492=function(_0x54929e,_0x404d6c){_0x54929e=_0x54929e-0xae;var _0x229e75=_0x47a529[_0x54929e];return _0x229e75;},_0x5492(_0x5a6220,_0x3a68a5);}import{SchemaBehaviors as _0x107742}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x13d3e3}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x754568}from'../d-d-d/d-d-d.js';class MediaImage extends _0x754568{static get[_0x43fa29(0xff)](){return[super['styles'],_0x197fe3`
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
      `];}constructor(){var _0x1d1da5=_0x43fa29;super(),this[_0x1d1da5(0x144)]=null,this[_0x1d1da5(0x107)]=!0x1,this[_0x1d1da5(0x116)]='',this['source']='',this['citation']='',this[_0x1d1da5(0xe1)]='',this[_0x1d1da5(0xeb)]='',this[_0x1d1da5(0xc8)]='',this['alt']='',this[_0x1d1da5(0x124)]=!0x1,this['size']='wide',this[_0x1d1da5(0xca)]=!0x1,this[_0x1d1da5(0xfc)]=!0x1,this['box']=!0x1,this['offset']='none';}[_0x43fa29(0x13a)](_0x15418f){var _0x5171f5=_0x43fa29,_0xed9395={'AnHiB':function(_0x36916e,_0x5aa7e7){return _0x36916e==_0x5aa7e7;},'FrfAT':function(_0x2e57f0,_0x48b925){return _0x2e57f0===_0x48b925;},'IfcqH':_0x5171f5(0x13b),'VdZpr':'asMd','UVoQN':_0x5171f5(0x114),'VPbjC':_0x5171f5(0xeb),'mVwEU':_0x5171f5(0xc8),'dImjH':_0x5171f5(0xe1),'nUMxg':function(_0xccf8a5,_0x29773a){return _0xccf8a5+_0x29773a;},'bLbGo':_0x5171f5(0x11c)};super['updated']&&super[_0x5171f5(0x13a)](_0x15418f),_0x15418f['forEach']((_0x194662,_0x13f8bd)=>{var _0x53a61e=_0x5171f5;_0xed9395[_0x53a61e(0xb0)](_0x53a61e(0xdd),_0xed9395[_0x53a61e(0x11d)])?_0xed9395[_0x53a61e(0x11b)]('source',_0x4d5b4d)&&(this[_0x53a61e(0xaf)][_0x53a61e(0xe7)]=this[_0x207742]):(_0xed9395[_0x53a61e(0x120)]===_0x13f8bd&&this[_0x13f8bd]&&import(_0xed9395[_0x53a61e(0xdc)]),_0x53a61e(0xe1)==_0x13f8bd&&this[_0x53a61e(0x12d)](this[_0x13f8bd]),_0x53a61e(0x144)===_0x13f8bd&&this[_0x53a61e(0x144)]&&(this[_0x53a61e(0x107)]=!0x0),[_0xed9395[_0x53a61e(0xfd)],_0xed9395[_0x53a61e(0xd6)]][_0x53a61e(0x145)](_0x13f8bd)&&(this[_0x53a61e(0xe0)]=this[_0x53a61e(0x133)](this[_0x53a61e(0xeb)],this[_0x53a61e(0xc8)])),['figureLabelTitle',_0xed9395[_0x53a61e(0x130)]][_0x53a61e(0x145)](_0x13f8bd)&&(this[_0x53a61e(0x116)]=this[_0x53a61e(0xeb)]?this[_0x53a61e(0xeb)]:this[_0x53a61e(0xe1)],this['modalTitle']+=this[_0x53a61e(0xc8)]?_0xed9395[_0x53a61e(0xde)](_0xed9395[_0x53a61e(0xcc)],this[_0x53a61e(0xc8)]):''));});}[_0x43fa29(0xf6)](){var _0x4af5a2=_0x43fa29;return _0x7dca3b`
      ${this[_0x4af5a2(0xe0)]?_0x7dca3b`
            <figure-label
              title="${this[_0x4af5a2(0xeb)]}"
              description="${this[_0x4af5a2(0xc8)]}"
            ></figure-label>
          `:''}
      ${this['link']?_0x7dca3b`<a href="${this[_0x4af5a2(0x144)]}"
            ><media-image-image
              ?round="${this['round']}"
              resource="${this[_0x4af5a2(0xf7)]}-image"
              source="${this['source']}"
              modal-title="${this[_0x4af5a2(0x116)]}"
              alt="${this[_0x4af5a2(0x129)]}"
              tabindex="${this[_0x4af5a2(0x107)]?'-1':'0'}"
              @click="${this[_0x4af5a2(0x138)]}"
            ></media-image-image
          ></a>`:_0x7dca3b`<media-image-image
            ?round="${this['round']}"
            resource="${this['schemaResourceID']}-image"
            source="${this[_0x4af5a2(0x14c)]}"
            modal-title="${this[_0x4af5a2(0x116)]}"
            alt="${this['alt']}"
            tabindex="${this['disableZoom']?'-1':'0'}"
            @click="${this['_handleClick']}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this['citation']&&this[_0x4af5a2(0x124)]?_0x7dca3b`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this['citation']}"
              ></md-block>`:_0x7dca3b`${this[_0x4af5a2(0x13f)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x4af5a2(0x100)]?_0x7dca3b`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this[_0x4af5a2(0xe1)]&&this[_0x4af5a2(0x124)]?_0x7dca3b`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x4af5a2(0xe1)]}"
                    ></md-block>`:_0x7dca3b`${this[_0x4af5a2(0xe1)]}`}</slot
              >
            </media-image-caption>
          `:''}
    `;}['haxHooks'](){var _0x27fec4=_0x43fa29,_0x5c9223={'cGksN':'haxeditModeChanged','NCxkP':_0x27fec4(0x14b)};return{'editModeChanged':_0x5c9223[_0x27fec4(0x12f)],'activeElementChanged':_0x5c9223[_0x27fec4(0x127)]};}[_0x43fa29(0x138)](_0x68eaa2){var _0x29c4ee=_0x43fa29;(this[_0x29c4ee(0xd0)]||this[_0x29c4ee(0x107)])&&(_0x68eaa2['preventDefault'](),_0x68eaa2[_0x29c4ee(0x10b)](),_0x68eaa2[_0x29c4ee(0x109)]()),!this['_haxState']&&this[_0x29c4ee(0x144)]&&this[_0x29c4ee(0x107)]&&this[_0x29c4ee(0x11f)][_0x29c4ee(0xfb)]('a')[_0x29c4ee(0x117)]();}[_0x43fa29(0x123)](_0x4d5aed){var _0x211d81=_0x43fa29;this[_0x211d81(0xd0)]=_0x4d5aed;}['haxactiveElementChanged'](_0x29bdf4,_0x3ffe97){var _0x497704=_0x43fa29;_0x3ffe97&&(this[_0x497704(0xd0)]=_0x3ffe97);}static get[_0x43fa29(0xcf)](){var _0x285be4=_0x43fa29;return _0x285be4(0x111);}static get[_0x43fa29(0x103)](){var _0x3442c6=_0x43fa29,_0x5901f3={'yeIpb':_0x3442c6(0x13d),'eTmbr':_0x3442c6(0xc9),'ngbyR':_0x3442c6(0x10e)};return{...super['properties'],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x5901f3[_0x3442c6(0x101)]},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x5901f3[_0x3442c6(0xb7)],'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x5901f3[_0x3442c6(0x12b)]},'figureLabelDescription':{'type':String,'attribute':_0x3442c6(0xb4)}};}[_0x43fa29(0x133)](_0x22425f,_0x2ed995){var _0x16238d=_0x43fa29;return _0x22425f&&_0x22425f[_0x16238d(0x12e)]>0x0||_0x2ed995&&_0x2ed995[_0x16238d(0x12e)]>0x0;}[_0x43fa29(0x12d)](){var _0x1fee23=_0x43fa29,_0x56e0a1={'dSlXm':function(_0x50ff11,_0x52d1fe){return _0x50ff11>_0x52d1fe;},'zmhWi':function(_0x5e6e41,_0x5a265b){return _0x5e6e41!==_0x5a265b;}};this[_0x1fee23(0x100)]=_0x56e0a1[_0x1fee23(0x10a)](this[_0x1fee23(0xe1)][_0x1fee23(0x12e)],0x0)||_0x56e0a1[_0x1fee23(0xb8)](null,this[_0x1fee23(0xfb)](_0x1fee23(0x149)));}[_0x43fa29(0xef)](){var _0x152afb=_0x43fa29;super[_0x152afb(0xef)](),this['_observer']=new MutationObserver(_0x426c42=>{this['_computeHasCaption']();}),this[_0x152afb(0xf9)][_0x152afb(0xe8)](this,{'childList':!0x0});}[_0x43fa29(0xda)](){var _0x383624=_0x43fa29;this[_0x383624(0xf9)][_0x383624(0x11e)](),super[_0x383624(0xda)]();}static get[_0x43fa29(0x13e)](){var _0x577b9a=_0x43fa29,_0x396e26={'OcAwq':'A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','nOEoY':_0x577b9a(0xf3),'Dtvaa':_0x577b9a(0xb1),'sXyed':_0x577b9a(0x135),'ZMSWN':_0x577b9a(0xe9),'NlHYG':_0x577b9a(0xe1),'WUexW':_0x577b9a(0xb2),'QqbcB':_0x577b9a(0x129),'EvIwI':_0x577b9a(0x13f),'Mohjy':_0x577b9a(0x125),'pipLy':_0x577b9a(0x105),'YRQUr':'Alternative\x20text','hnRTt':_0x577b9a(0xfc),'Rqhfl':_0x577b9a(0xb6),'IiuIp':_0x577b9a(0x143),'IJGFM':_0x577b9a(0xf4),'gbYwr':_0x577b9a(0xd5),'wWeVq':_0x577b9a(0xf2),'SYRAp':'Citation','siHDa':_0x577b9a(0xae),'EgPaK':'Caption','GrebG':'Title\x20for\x20the\x20figure\x20label.','akqmI':_0x577b9a(0xc6),'zTDKF':_0x577b9a(0xe2),'USQgK':_0x577b9a(0xe4),'phRyH':_0x577b9a(0xbc),'BZcSR':_0x577b9a(0xf0),'Zozvr':_0x577b9a(0x113),'AOsgf':_0x577b9a(0x13c),'keKJq':'media-image'};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x577b9a(0x148),'descrption':_0x396e26[_0x577b9a(0x142)],'icon':_0x396e26['nOEoY'],'color':_0x396e26[_0x577b9a(0x10d)],'tags':[_0x396e26[_0x577b9a(0x147)],_0x396e26['ZMSWN'],_0x577b9a(0xbd),_0x577b9a(0xd7),_0x577b9a(0x134),_0x396e26[_0x577b9a(0xc3)],_0x577b9a(0x10f),_0x396e26[_0x577b9a(0xcb)]],'handles':[{'type':_0x577b9a(0x134),'type_exclusive':!0x0,'source':_0x577b9a(0x14c),'title':_0x396e26[_0x577b9a(0xe6)],'alt':'alt','citation':_0x396e26[_0x577b9a(0xc1)],'caption':_0x396e26['NlHYG']}],'meta':{'author':_0x577b9a(0xcd),'outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x577b9a(0x14c),'title':_0x577b9a(0x141),'description':_0x396e26[_0x577b9a(0xbb)],'inputMethod':_0x396e26[_0x577b9a(0xc7)],'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x396e26[_0x577b9a(0xe6)],'title':_0x396e26[_0x577b9a(0x146)],'description':_0x577b9a(0xd3),'inputMethod':_0x577b9a(0x129),'required':!0x0},{'property':'link','title':_0x577b9a(0xfa),'description':_0x577b9a(0xec),'inputMethod':_0x396e26[_0x577b9a(0xc7)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x396e26[_0x577b9a(0xc5)],'title':_0x396e26[_0x577b9a(0xc4)],'description':_0x577b9a(0x10c),'inputMethod':_0x396e26[_0x577b9a(0x110)],'required':!0x1},{'property':_0x577b9a(0x106),'title':_0x396e26['IJGFM'],'description':_0x577b9a(0x108),'inputMethod':_0x396e26[_0x577b9a(0x110)],'required':!0x1},{'property':_0x577b9a(0xd2),'title':_0x577b9a(0x118),'description':_0x577b9a(0x137),'inputMethod':_0x577b9a(0xbf),'options':{'none':_0x396e26['gbYwr'],'wide':_0x396e26[_0x577b9a(0x102)],'narrow':'narrow'}},{'property':_0x577b9a(0x13f),'title':_0x396e26[_0x577b9a(0xd9)],'description':_0x577b9a(0x104),'inputMethod':_0x396e26[_0x577b9a(0x12a)],'required':!0x1},{'property':_0x577b9a(0xe1),'title':_0x396e26[_0x577b9a(0xc2)],'description':_0x577b9a(0x126),'inputMethod':_0x577b9a(0xae),'required':!0x1},{'property':_0x577b9a(0xeb),'title':'Figure\x20Label\x20Title','description':_0x396e26[_0x577b9a(0x14d)],'inputMethod':_0x577b9a(0xae),'required':!0x1},{'property':_0x577b9a(0xc8),'title':_0x577b9a(0xf5),'description':_0x396e26['akqmI'],'inputMethod':_0x577b9a(0xae),'required':!0x1}],'advanced':[{'property':_0x577b9a(0xca),'title':_0x396e26[_0x577b9a(0x136)],'description':_0x396e26[_0x577b9a(0xdb)],'inputMethod':_0x396e26[_0x577b9a(0x110)],'required':!0x1},{'property':_0x577b9a(0x107),'title':_0x396e26[_0x577b9a(0xba)],'description':_0x396e26[_0x577b9a(0x140)],'inputMethod':_0x577b9a(0x143),'required':!0x1}],'developer':[{'property':_0x577b9a(0x124),'title':_0x396e26[_0x577b9a(0x11a)],'description':_0x396e26['AOsgf'],'inputMethod':_0x577b9a(0x143),'required':!0x1}]},'demoSchema':[{'tag':_0x396e26[_0x577b9a(0xd1)],'properties':{'source':_0x577b9a(0xea),'card':!0x0,'citation':_0x577b9a(0xfe)}}]};}}globalThis[_0x43fa29(0x14a)]['define'](MediaImage['tag'],MediaImage);class MediaImageImage extends _0x13d3e3(_0x754568){static get['styles'](){var _0x207bd7=_0x43fa29;return[super[_0x207bd7(0xff)],_0x197fe3`
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
      `];}constructor(){var _0x2b35e4=_0x43fa29,_0x3f77ff={'hLUlR':'image-inspector'};super(),this[_0x2b35e4(0xca)]=!0x1,globalThis[_0x2b35e4(0x139)]&&(this[_0x2b35e4(0xaf)]=globalThis[_0x2b35e4(0x139)][_0x2b35e4(0xdf)](_0x3f77ff[_0x2b35e4(0xce)]),this[_0x2b35e4(0xaf)][_0x2b35e4(0xf8)]=!0x0),this[_0x2b35e4(0x116)]='',this[_0x2b35e4(0xf1)]&&this[_0x2b35e4(0xf1)]('simple-modal-show',this[_0x2b35e4(0x132)]['bind'](this));}[_0x43fa29(0x132)](_0x668f62){var _0x4c321c=_0x43fa29,_0x23ee53={'ihAAa':_0x4c321c(0xb5)};import(_0x23ee53[_0x4c321c(0xe3)]);}[_0x43fa29(0xf6)](){var _0x54020a=_0x43fa29;return _0x7dca3b`
      <div class="image-wrap">
        <img src="${this[_0x54020a(0x14c)]}" alt="${this[_0x54020a(0x129)]}" loading="lazy" />
      </div>
    `;}[_0x43fa29(0x13a)](_0x28b652){var _0x592fd8=_0x43fa29,_0x4c532a={'WuIyl':function(_0x1b7e34,_0x1a6630){return _0x1b7e34==_0x1a6630;}};_0x28b652[_0x592fd8(0x119)]((_0x539641,_0x2ed25a)=>{var _0xea74bf=_0x592fd8;_0x4c532a[_0xea74bf(0x131)](_0xea74bf(0x14c),_0x2ed25a)&&(this['modalContent']['src']=this[_0x2ed25a]);});}static get[_0x43fa29(0x103)](){var _0x34c4ef=_0x43fa29;return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x34c4ef(0xd4)}};}static get[_0x43fa29(0xcf)](){var _0x572644=_0x43fa29,_0x19e0db={'WRqUy':'media-image-image'};return _0x19e0db[_0x572644(0x121)];}}globalThis[_0x43fa29(0x14a)][_0x43fa29(0x115)](MediaImageImage[_0x43fa29(0xcf)],MediaImageImage);class MediaImageCitation extends _0x754568{static get[_0x43fa29(0xff)](){var _0x12a1d1=_0x43fa29;return[super[_0x12a1d1(0xff)],_0x197fe3`
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
      `];}['render'](){return _0x7dca3b` <div class="citation"><slot></slot></div> `;}static get[_0x43fa29(0xcf)](){var _0x58fb10=_0x43fa29;return _0x58fb10(0x122);}}globalThis['customElements'][_0x43fa29(0x115)](MediaImageCitation[_0x43fa29(0xcf)],MediaImageCitation);class MediaImageCaption extends _0x754568{static get[_0x43fa29(0xff)](){var _0x5d591a=_0x43fa29;return[super[_0x5d591a(0xff)],_0x197fe3`
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
      `];}[_0x43fa29(0xf6)](){return _0x7dca3b`
      <div class="caption">
        ${this['__hasContent']?'':_0x7dca3b`<slot id="slot"></slot>`}
      </div>
    `;}static get[_0x43fa29(0xcf)](){var _0x433608=_0x43fa29,_0x52f85f={'hoXWW':'media-image-caption'};return _0x52f85f[_0x433608(0x12c)];}}globalThis[_0x43fa29(0x14a)][_0x43fa29(0x115)](MediaImageCaption[_0x43fa29(0xcf)],MediaImageCaption);export{MediaImage};