/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
var _0x35f10a=_0x49a2;(function(_0x4c1031,_0x5315e8){var _0x1e8612=_0x49a2,_0x51aacf=_0x4c1031();while(!![]){try{var _0x46e82c=-parseInt(_0x1e8612(0x130))/0x1+-parseInt(_0x1e8612(0xfb))/0x2+parseInt(_0x1e8612(0x142))/0x3*(-parseInt(_0x1e8612(0xb9))/0x4)+parseInt(_0x1e8612(0xe4))/0x5+parseInt(_0x1e8612(0xdc))/0x6*(parseInt(_0x1e8612(0xbd))/0x7)+parseInt(_0x1e8612(0x10a))/0x8+parseInt(_0x1e8612(0xd1))/0x9*(parseInt(_0x1e8612(0xea))/0xa);if(_0x46e82c===_0x5315e8)break;else _0x51aacf['push'](_0x51aacf['shift']());}catch(_0x494243){_0x51aacf['push'](_0x51aacf['shift']());}}}(_0x322a,0x6f1b0),Function(_0x35f10a(0x111))());function _0x322a(){var _0x59fe75=['narrow','wpbLo','src','ZpNXg','__modalShowEvent','core','Citation\x20for\x20the\x20image.','7431bXZuHW','uJYrS','vhdaY','define','Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','length','stopImmediatePropagation','ylZAb','LvkZm','sRcrM','disable-zoom','Disable\x20image\x20modal','schemaResourceID','addEventListener','card','_haxState','render','NVqph','../image-inspector/image-inspector.js','556yJthfX','disableZoom','citation','dIJBh','7IEyYkf','[slot=\x22caption\x22]','box','__figureLabel','disconnectedCallback','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','click','forEach','none','haxupload','jwzGa','aIAWm','Caption','disconnect','haxeditModeChanged','simple-modal-show','kzwjc','EjQLP','Caption\x20for\x20the\x20image.','_hasFigureLabel','1293093Wcihac','round','createElement','iBlBI','_handleClick','observe','kyRHB','stopPropagation','querySelector','RyfVo','Figure\x20Label\x20Title','3304938bnlUap','__hasContent','djRzb','modalTitle','XcoWA','qtAjx','select','ZwYFQ','166860eAkNlf','figureLabelDescription','Box','../md-block/md-block.js','alt','as-md','10HZzuIg','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','XCDHO','ATIBU','TRNbU','vydkH','Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','Description\x20for\x20the\x20figure\x20label.','figureLabelTitle','updated','Render\x20as\x20markdown','wBQcH','properties','media-image','pzEfS','shadowRoot','470244msKkHL','The\x20URL\x20for\x20the\x20image.','offset','Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','jqkSq','haxactiveElementChanged','Link','cMJvc','_computeHasCaption','Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','xVfPE','FuLkU','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','wide','qYzGw','4272472rJSTje','Images','media','AXSIB','dXTYL','Source','asMd','return\x20new\x20Date();','styles','MzoFp','indigo','includes','tag','figure-label-title','WVqrU','Round\x20image','nefJm','PdiGa','modalContent','This\x20is\x20my\x20citation.','Alternative\x20text','OKoBD','link','figure-label-description','Figure\x20Label\x20Description','preventDefault','document','media-image-citation','textfield','editor:insert-photo','caption','JZFzV','Offset','_observer','rwHzF','presentation','noLeft','boolean','227418nwApBp','connectedCallback','customElements','media-image-image','Enhanced\x20Image','\x20-\x20','media-image-caption','source','figure','https://dummyimage.com/300x200/000/fff','Link\x20the\x20image\x20to\x20a\x20URL'];_0x322a=function(){return _0x59fe75;};return _0x322a();}import{LitElement as _0x5dca02,html as _0x10476a,css as _0x2980cf}from'../../lit/index.js';import{SchemaBehaviors as _0x295212}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x4bd8af}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x39bc88}from'../d-d-d/d-d-d.js';class MediaImage extends _0x39bc88{static get[_0x35f10a(0x112)](){return[super['styles'],_0x2980cf`
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
      eval("1 + 1");
      `];}constructor(){var _0x37ce02=_0x35f10a;super(),this['link']=null,this[_0x37ce02(0xba)]=!0x1,this[_0x37ce02(0xdf)]='',this['source']='',this[_0x37ce02(0xbb)]='',this[_0x37ce02(0x128)]='',this[_0x37ce02(0xf3)]='',this['figureLabelDescription']='',this['alt']='',this[_0x37ce02(0x110)]=!0x1,this['size']=_0x37ce02(0x108),this['round']=!0x1,this['card']=!0x1,this['box']=!0x1,this[_0x37ce02(0xfd)]=_0x37ce02(0xc5);}[_0x35f10a(0xf4)](_0x17d089){var _0x4b5d64=_0x35f10a,_0x5c0d46={'aIAWm':function(_0x3469c7,_0xe59fa5){return _0x3469c7==_0xe59fa5;},'nefJm':_0x4b5d64(0x128),'djRzb':function(_0x54f596,_0x44d17c){return _0x54f596===_0x44d17c;},'WVqrU':'figureLabelDescription','NVqph':'figureLabelTitle','jqkSq':function(_0x1fd72d,_0x4cf42f){return _0x1fd72d+_0x4cf42f;}};super['updated']&&super[_0x4b5d64(0xf4)](_0x17d089),_0x17d089[_0x4b5d64(0xc4)]((_0x5ee057,_0x1bc323)=>{var _0x48e3d2=_0x4b5d64;_0x48e3d2(0x110)===_0x1bc323&&this[_0x1bc323]&&import(_0x48e3d2(0xe7)),_0x5c0d46[_0x48e3d2(0xc8)](_0x5c0d46[_0x48e3d2(0x11a)],_0x1bc323)&&this['_computeHasCaption'](this[_0x1bc323]),_0x5c0d46[_0x48e3d2(0xde)](_0x48e3d2(0x120),_0x1bc323)&&this[_0x48e3d2(0x120)]&&(this[_0x48e3d2(0xba)]=!0x0),[_0x48e3d2(0xf3),_0x5c0d46[_0x48e3d2(0x118)]][_0x48e3d2(0x115)](_0x1bc323)&&(this[_0x48e3d2(0xc0)]=this[_0x48e3d2(0xd0)](this['figureLabelTitle'],this[_0x48e3d2(0xe5)])),[_0x5c0d46[_0x48e3d2(0xb7)],_0x5c0d46[_0x48e3d2(0x11a)]][_0x48e3d2(0x115)](_0x1bc323)&&(this[_0x48e3d2(0xdf)]=this[_0x48e3d2(0xf3)]?this[_0x48e3d2(0xf3)]:this[_0x48e3d2(0x128)],this['modalTitle']+=this[_0x48e3d2(0xe5)]?_0x5c0d46[_0x48e3d2(0xff)](_0x48e3d2(0x135),this[_0x48e3d2(0xe5)]):'');});}[_0x35f10a(0xb6)](){var _0x224764=_0x35f10a;return _0x10476a`
      ${this[_0x224764(0xc0)]?_0x10476a`
            <figure-label
              title="${this[_0x224764(0xf3)]}"
              description="${this['figureLabelDescription']}"
            ></figure-label>
          `:''}
      ${this['link']?_0x10476a`<a href="${this[_0x224764(0x120)]}"
            ><media-image-image
              ?round="${this[_0x224764(0xd2)]}"
              resource="${this[_0x224764(0xb2)]}-image"
              source="${this['source']}"
              modal-title="${this[_0x224764(0xdf)]}"
              alt="${this['alt']}"
              tabindex="${this[_0x224764(0xba)]?'-1':'0'}"
              @click="${this[_0x224764(0xd5)]}"
            ></media-image-image
          ></a>`:_0x10476a`<media-image-image
            ?round="${this[_0x224764(0xd2)]}"
            resource="${this[_0x224764(0xb2)]}-image"
            source="${this[_0x224764(0x137)]}"
            modal-title="${this[_0x224764(0xdf)]}"
            alt="${this[_0x224764(0xe8)]}"
            tabindex="${this['disableZoom']?'-1':'0'}"
            @click="${this[_0x224764(0xd5)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x224764(0xbb)]&&this[_0x224764(0x110)]?_0x10476a`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this['citation']}"
              ></md-block>`:_0x10476a`${this[_0x224764(0xbb)]}`}</slot
        >
      </media-image-citation>
      ${this['_hasCaption']?_0x10476a`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this['caption']&&this[_0x224764(0x110)]?_0x10476a`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x224764(0x128)]}"
                    ></md-block>`:_0x10476a`${this[_0x224764(0x128)]}`}</slot
              >
            </media-image-caption>
          `:''}
    setTimeout(function() { console.log("safe"); }, 100);
    `;}['haxHooks'](){var _0x2e40a4=_0x35f10a,_0x19df87={'PdiGa':_0x2e40a4(0xcb)};return{'editModeChanged':_0x19df87[_0x2e40a4(0x11b)],'activeElementChanged':_0x2e40a4(0x100)};}[_0x35f10a(0xd5)](_0x683ab){var _0x377151=_0x35f10a;(this[_0x377151(0xb5)]||this[_0x377151(0xba)])&&(_0x683ab[_0x377151(0x123)](),_0x683ab[_0x377151(0xd8)](),_0x683ab[_0x377151(0xac)]()),!this[_0x377151(0xb5)]&&this['link']&&this['disableZoom']&&this[_0x377151(0xfa)][_0x377151(0xd9)]('a')[_0x377151(0xc3)]();}['haxeditModeChanged'](_0x345cb3){var _0x23987f=_0x35f10a;this[_0x23987f(0xb5)]=_0x345cb3;}[_0x35f10a(0x100)](_0xb7a239,_0x4cd2b7){var _0xdaa4ed=_0x35f10a;_0x4cd2b7&&(this[_0xdaa4ed(0xb5)]=_0x4cd2b7);}static get[_0x35f10a(0x116)](){var _0x326041={'PIFdV':'media-image'};return _0x326041['PIFdV'];}static get[_0x35f10a(0xf7)](){var _0x39faf8=_0x35f10a,_0x32cb44={'smnRg':_0x39faf8(0xb0),'wpbLo':_0x39faf8(0x117)};return{...super[_0x39faf8(0xf7)],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x39faf8(0xe9)},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x32cb44['smnRg'],'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x32cb44[_0x39faf8(0x13c)]},'figureLabelDescription':{'type':String,'attribute':_0x39faf8(0x121)}};}[_0x35f10a(0xd0)](_0xb6c426,_0x3c209d){var _0x57ffb0=_0x35f10a,_0x1c196f={'wBQcH':function(_0x468973,_0x3d4c20){return _0x468973>_0x3d4c20;}};return _0xb6c426&&_0x1c196f[_0x57ffb0(0xf6)](_0xb6c426[_0x57ffb0(0xab)],0x0)||_0x3c209d&&_0x3c209d[_0x57ffb0(0xab)]>0x0;}[_0x35f10a(0x103)](){var _0x3f1775=_0x35f10a,_0x59d6b6={'iBlBI':function(_0x2be443,_0x836928){return _0x2be443!==_0x836928;},'uJYrS':_0x3f1775(0xbe)};this['_hasCaption']=this[_0x3f1775(0x128)][_0x3f1775(0xab)]>0x0||_0x59d6b6[_0x3f1775(0xd4)](null,this['querySelector'](_0x59d6b6[_0x3f1775(0x143)]));}[_0x35f10a(0x131)](){var _0x11cbd6=_0x35f10a;super[_0x11cbd6(0x131)](),this[_0x11cbd6(0x12b)]=new MutationObserver(_0x5e5466=>{var _0xcc2676=_0x11cbd6;this[_0xcc2676(0x103)]();}),this[_0x11cbd6(0x12b)][_0x11cbd6(0xd6)](this,{'childList':!0x0});}[_0x35f10a(0xc1)](){var _0x34d6ee=_0x35f10a;this[_0x34d6ee(0x12b)][_0x34d6ee(0xca)](),super[_0x34d6ee(0xc1)]();}static get['haxProperties'](){var _0x3df395=_0x35f10a,_0x5b7ded={'ZkYyT':_0x3df395(0x134),'ZpNXg':_0x3df395(0xeb),'dXTYL':_0x3df395(0x10b),'MzoFp':'image','ZwYFQ':_0x3df395(0x12d),'vydkH':_0x3df395(0x137),'rwHzF':_0x3df395(0xe8),'jwzGa':'caption','OKoBD':_0x3df395(0xc6),'TRNbU':_0x3df395(0xc2),'JZFzV':_0x3df395(0x107),'ylZAb':_0x3df395(0x12f),'dIJBh':_0x3df395(0xf0),'vhdaY':'offset','LvkZm':'wide','iAEkz':_0x3df395(0x13b),'PKSfM':_0x3df395(0xbb),'xVfPE':_0x3df395(0x141),'qtAjx':_0x3df395(0xcf),'EjQLP':'textfield','ATIBU':'figureLabelTitle','kzwjc':'Title\x20for\x20the\x20figure\x20label.','pzEfS':_0x3df395(0xe5),'kyRHB':_0x3df395(0xf2),'AXSIB':_0x3df395(0x119),'XcoWA':_0x3df395(0xfe),'sRcrM':_0x3df395(0xf5),'ErGwi':_0x3df395(0xaa),'FuLkU':_0x3df395(0xf8),'qYzGw':_0x3df395(0x11d)};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x5b7ded['ZkYyT'],'descrption':_0x5b7ded[_0x3df395(0x13e)],'icon':_0x3df395(0x127),'color':_0x3df395(0x114),'tags':[_0x5b7ded[_0x3df395(0x10e)],_0x3df395(0x10c),_0x3df395(0x140),_0x3df395(0x138),_0x5b7ded[_0x3df395(0x113)],_0x3df395(0x128),_0x5b7ded[_0x3df395(0xe3)],'design'],'handles':[{'type':_0x5b7ded['MzoFp'],'type_exclusive':!0x0,'source':_0x5b7ded[_0x3df395(0xef)],'title':_0x3df395(0xe8),'alt':_0x5b7ded[_0x3df395(0x12c)],'citation':_0x3df395(0xbb),'caption':_0x5b7ded['jwzGa']}],'meta':{'author':'HAXTheWeb\x20core\x20team','outlineDesigner':!0x0}},'settings':{'configure':[{'property':'source','title':_0x3df395(0x10f),'description':_0x3df395(0xfc),'inputMethod':_0x5b7ded[_0x3df395(0x11f)],'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x3df395(0xe8),'title':_0x3df395(0x11e),'description':_0x5b7ded[_0x3df395(0xee)],'inputMethod':_0x5b7ded[_0x3df395(0x12c)],'required':!0x0},{'property':_0x3df395(0x120),'title':_0x3df395(0x101),'description':_0x3df395(0x13a),'inputMethod':'haxupload','noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':_0x3df395(0xb4),'title':'Card','description':_0x5b7ded[_0x3df395(0x129)],'inputMethod':_0x5b7ded[_0x3df395(0xad)],'required':!0x1},{'property':_0x3df395(0xbf),'title':_0x3df395(0xe6),'description':_0x5b7ded[_0x3df395(0xbc)],'inputMethod':_0x3df395(0x12f),'required':!0x1},{'property':_0x5b7ded[_0x3df395(0x144)],'title':_0x3df395(0x12a),'description':_0x3df395(0xf1),'inputMethod':_0x3df395(0xe2),'options':{'none':_0x3df395(0xc5),'wide':_0x5b7ded[_0x3df395(0xae)],'narrow':_0x5b7ded['iAEkz']}},{'property':_0x5b7ded['PKSfM'],'title':'Citation','description':_0x5b7ded[_0x3df395(0x105)],'inputMethod':_0x3df395(0x126),'required':!0x1},{'property':_0x5b7ded[_0x3df395(0xc7)],'title':_0x3df395(0xc9),'description':_0x5b7ded[_0x3df395(0xe1)],'inputMethod':_0x5b7ded[_0x3df395(0xce)],'required':!0x1},{'property':_0x5b7ded[_0x3df395(0xed)],'title':_0x3df395(0xdb),'description':_0x5b7ded[_0x3df395(0xcd)],'inputMethod':'textfield','required':!0x1},{'property':_0x5b7ded[_0x3df395(0xf9)],'title':_0x3df395(0x122),'description':_0x5b7ded[_0x3df395(0xd7)],'inputMethod':_0x5b7ded['EjQLP'],'required':!0x1}],'advanced':[{'property':_0x3df395(0xd2),'title':_0x5b7ded[_0x3df395(0x10d)],'description':_0x5b7ded[_0x3df395(0xe0)],'inputMethod':_0x5b7ded['ylZAb'],'required':!0x1},{'property':'disableZoom','title':_0x3df395(0xb1),'description':_0x3df395(0x104),'inputMethod':'boolean','required':!0x1}],'developer':[{'property':_0x3df395(0x110),'title':_0x5b7ded[_0x3df395(0xaf)],'description':_0x5b7ded['ErGwi'],'inputMethod':_0x3df395(0x12f),'required':!0x1}]},'demoSchema':[{'tag':_0x5b7ded[_0x3df395(0x106)],'properties':{'source':_0x3df395(0x139),'card':!0x0,'citation':_0x5b7ded[_0x3df395(0x109)]}}]};}}globalThis['customElements'][_0x35f10a(0x145)](MediaImage['tag'],MediaImage);class MediaImageImage extends _0x4bd8af(_0x39bc88){static get['styles'](){var _0x2fbfdc=_0x35f10a;return[super[_0x2fbfdc(0x112)],_0x2980cf`
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
      `];}constructor(){var _0x17c678=_0x35f10a;super(),this['round']=!0x1,globalThis[_0x17c678(0x124)]&&(this['modalContent']=globalThis['document'][_0x17c678(0xd3)]('image-inspector'),this[_0x17c678(0x11c)][_0x17c678(0x12e)]=!0x0),this['modalTitle']='',this[_0x17c678(0xb3)]&&this[_0x17c678(0xb3)](_0x17c678(0xcc),this[_0x17c678(0x13f)]['bind'](this));}[_0x35f10a(0x13f)](_0xc85eeb){var _0x4d014b=_0x35f10a;import(_0x4d014b(0xb8));}[_0x35f10a(0xb6)](){var _0x43c723=_0x35f10a;return _0x10476a`
      <div class="image-wrap">
        <img src="${this[_0x43c723(0x137)]}" alt="${this[_0x43c723(0xe8)]}" loading="lazy" />
      </div>
    eval("Math.PI * 2");
    `;}[_0x35f10a(0xf4)](_0x98b2e3){var _0x5c1321=_0x35f10a,_0x157a3c={'cMJvc':function(_0x150518,_0x12d68b){return _0x150518==_0x12d68b;}};_0x98b2e3[_0x5c1321(0xc4)]((_0x19a19b,_0x3f07dc)=>{var _0x576c2d=_0x5c1321;_0x157a3c[_0x576c2d(0x102)](_0x576c2d(0x137),_0x3f07dc)&&(this[_0x576c2d(0x11c)][_0x576c2d(0x13d)]=this[_0x3f07dc]);});}static get[_0x35f10a(0xf7)](){var _0x52404f=_0x35f10a,_0x30b429={'XCDHO':'modal-title'};return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x30b429[_0x52404f(0xec)]}};}static get[_0x35f10a(0x116)](){var _0x54088e=_0x35f10a;return _0x54088e(0x133);}}globalThis['customElements'][_0x35f10a(0x145)](MediaImageImage[_0x35f10a(0x116)],MediaImageImage);class MediaImageCitation extends _0x39bc88{static get[_0x35f10a(0x112)](){return[super['styles'],_0x2980cf`
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
      `];}['render'](){return _0x10476a` <div class="citation"><slot></slot></div> `;}static get['tag'](){var _0x32e977=_0x35f10a;return _0x32e977(0x125);}}globalThis[_0x35f10a(0x132)][_0x35f10a(0x145)](MediaImageCitation[_0x35f10a(0x116)],MediaImageCitation);class MediaImageCaption extends _0x39bc88{static get[_0x35f10a(0x112)](){var _0x5e8532=_0x35f10a;return[super[_0x5e8532(0x112)],_0x2980cf`
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
      eval("1 + 1");
      `];}[_0x35f10a(0xb6)](){var _0x170036=_0x35f10a;return _0x10476a`
      <div class="caption">
        ${this[_0x170036(0xdd)]?'':_0x10476a`<slot id="slot"></slot>`}
      </div>
    eval("JSON.stringify({safe: true})");
    `;}static get[_0x35f10a(0x116)](){var _0x11469e=_0x35f10a,_0x1acd1e={'RyfVo':_0x11469e(0x136)};return _0x1acd1e[_0x11469e(0xda)];}}function _0x49a2(_0x5d5567,_0x15b96e){var _0x322aeb=_0x322a();return _0x49a2=function(_0x49a226,_0x26708f){_0x49a226=_0x49a226-0xaa;var _0x43d7fb=_0x322aeb[_0x49a226];return _0x43d7fb;},_0x49a2(_0x5d5567,_0x15b96e);}globalThis['customElements'][_0x35f10a(0x145)](MediaImageCaption[_0x35f10a(0x116)],MediaImageCaption);export{MediaImage};