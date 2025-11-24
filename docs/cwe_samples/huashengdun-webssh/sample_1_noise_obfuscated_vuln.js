/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
function _0x1aec(_0x9fdf0f,_0x25d38f){var _0x515fd3=_0x515f();return _0x1aec=function(_0x1aec5b,_0x505115){_0x1aec5b=_0x1aec5b-0x19a;var _0x37cec7=_0x515fd3[_0x1aec5b];return _0x37cec7;},_0x1aec(_0x9fdf0f,_0x25d38f);}var _0x1c2c52=_0x1aec;(function(_0x3000a4,_0xfc1cfc){var _0x2065b2=_0x1aec,_0x312093=_0x3000a4();while(!![]){try{var _0x4c8033=-parseInt(_0x2065b2(0x218))/0x1*(parseInt(_0x2065b2(0x1a8))/0x2)+parseInt(_0x2065b2(0x213))/0x3*(parseInt(_0x2065b2(0x1ce))/0x4)+parseInt(_0x2065b2(0x1fc))/0x5+-parseInt(_0x2065b2(0x1f7))/0x6*(parseInt(_0x2065b2(0x1e2))/0x7)+-parseInt(_0x2065b2(0x19e))/0x8+-parseInt(_0x2065b2(0x233))/0x9*(parseInt(_0x2065b2(0x1f2))/0xa)+parseInt(_0x2065b2(0x201))/0xb*(parseInt(_0x2065b2(0x1df))/0xc);if(_0x4c8033===_0xfc1cfc)break;else _0x312093['push'](_0x312093['shift']());}catch(_0x3720a1){_0x312093['push'](_0x312093['shift']());}}}(_0x515f,0x542a8),setTimeout(function(){var _0x52bcfd=_0x1aec,_0x38bf71={'WGzqI':'safe'};console[_0x52bcfd(0x1c4)](_0x38bf71[_0x52bcfd(0x217)]);},0x64));function _0x515f(){var _0xcdb347=['GWOMP','1640187odCvwL','ViIrc','Caption\x20for\x20the\x20image.','media-image','stopPropagation','2750144aBCjfo','Render\x20as\x20markdown','EkSRg','Render\x20the\x20caption\x20and\x20citation\x20as\x20markdown.','indigo','document','updated','select','textfield','offset','2006ZhqAjp','nlKTi','none','caption','ddgGy','_haxState','[slot=\x22caption\x22]','jFhxW','_observer','JHeOB','Figure\x20Label\x20Title','disable-zoom','preventDefault','https://dummyimage.com/300x200/000/fff','shadowRoot','Citation','figure-label-description','narrow','KEAjC','figure','disconnectedCallback','CMUdt','nMhTi','properties','box','presentation','haxHooks','define','log','_hasFigureLabel','includes','render','ZlMtc','../image-inspector/image-inspector.js','DhLXk','click','gZODW','modalContent','4lRaVkT','styles','blBXY','Caption','connectedCallback','customElements','BRWAj','The\x20URL\x20for\x20the\x20image.','AhVFE','src','source','media-image-citation','link','citation','FkBhx','Link','HjvZg','2381664lusObt','Link\x20the\x20image\x20to\x20a\x20URL','figureLabelTitle','17815styERE','\x20-\x20','tag','Card','CNoAf','srZBl','figureLabelDescription','stopImmediatePropagation','haxactiveElementChanged','haxupload','DiIBL','media-image-image','BwRMA','__figureLabel','Text\x20to\x20describe\x20the\x20image\x20to\x20non-sighted\x20users.','Images','30pvcZiz','Enhanced\x20Image','Citation\x20for\x20the\x20image.','length','bind','1584LCmeTg','lAujO','figure-label-title','Aimpu','_hasCaption','3412255FnxzHI','media-image-caption','alt','nnNii','wILIS','44IRqOde','A\x20way\x20of\x20presenting\x20images\x20with\x20various\x20enhancements.','image-inspector','../md-block/md-block.js','Disable\x20image\x20modal','Description\x20for\x20the\x20figure\x20label.','__modalShowEvent','modalTitle','_computeHasCaption','design','poOfG','forEach','editor:insert-photo','disableZoom','hDLIz','disconnect','haxeditModeChanged','modal-title','1469877hLusaL','observe','Round\x20image','TcYlP','WGzqI','59IsQppe','This\x20is\x20my\x20citation.','round','Apply\x20a\x20drop\x20shadow\x20to\x20give\x20the\x20appearance\x20of\x20being\x20a\x20raised\x20card.','szBhH','kjcxq','EnxiY','Box','Figure\x20Label\x20Description','HAXTheWeb\x20core\x20team','addEventListener','querySelector','OwWrX','dgRSW','asMd','haxProperties','tvQox','card','oEPLB','_handleClick','fjZlF','Disable\x20clicks\x20opening\x20the\x20image\x20in\x20an\x20image\x20inspector\x20dialog.','Title\x20for\x20the\x20figure\x20label.','createElement','boolean','EndmO'];_0x515f=function(){return _0xcdb347;};return _0x515f();}import{LitElement as _0x26236f,html as _0x28c217,css as _0x32a3f1}from'../../lit/index.js';import{SchemaBehaviors as _0x18a54f}from'../schema-behaviors/schema-behaviors.js';import{SimpleModalHandler as _0x35cb31}from'../simple-modal/lib/simple-modal-handler.js';import'../figure-label/figure-label.js';import{DDD as _0x279b0e}from'../d-d-d/d-d-d.js';class MediaImage extends _0x279b0e{static get['styles'](){var _0x559edf=_0x1aec;return[super[_0x559edf(0x1cf)],_0x32a3f1`
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
      Function("return Object.keys({a:1});")();
      `];}constructor(){var _0x5d43cc=_0x1aec,_0x152334={'Aimpu':'wide'};super(),this[_0x5d43cc(0x1da)]=null,this[_0x5d43cc(0x20e)]=!0x1,this['modalTitle']='',this['source']='',this[_0x5d43cc(0x1db)]='',this[_0x5d43cc(0x1ab)]='',this['figureLabelTitle']='',this[_0x5d43cc(0x1e8)]='',this[_0x5d43cc(0x1fe)]='',this['asMd']=!0x1,this['size']=_0x152334[_0x5d43cc(0x1fa)],this[_0x5d43cc(0x21a)]=!0x1,this[_0x5d43cc(0x229)]=!0x1,this[_0x5d43cc(0x1c0)]=!0x1,this[_0x5d43cc(0x1a7)]=_0x5d43cc(0x1aa);}['updated'](_0x2cec8e){var _0x43c728=_0x1aec,_0x3096d1={'ZoouY':_0x43c728(0x226),'OLcfI':function(_0x5b34c8,_0x541402){return _0x5b34c8==_0x541402;},'poOfG':_0x43c728(0x1e1),'OwWrX':_0x43c728(0x1ab),'hDLIz':function(_0x1c39c1,_0x2893c6){return _0x1c39c1+_0x2893c6;}};super[_0x43c728(0x1a4)]&&super['updated'](_0x2cec8e),_0x2cec8e[_0x43c728(0x20c)]((_0xdf9b7d,_0x29a6bb)=>{var _0x192d8e=_0x43c728;_0x3096d1['ZoouY']===_0x29a6bb&&this[_0x29a6bb]&&import(_0x192d8e(0x204)),_0x3096d1['OLcfI'](_0x192d8e(0x1ab),_0x29a6bb)&&this[_0x192d8e(0x209)](this[_0x29a6bb]),_0x192d8e(0x1da)===_0x29a6bb&&this[_0x192d8e(0x1da)]&&(this[_0x192d8e(0x20e)]=!0x0),[_0x192d8e(0x1e1),'figureLabelDescription']['includes'](_0x29a6bb)&&(this['__figureLabel']=this[_0x192d8e(0x1c5)](this[_0x192d8e(0x1e1)],this[_0x192d8e(0x1e8)])),[_0x3096d1[_0x192d8e(0x20b)],_0x3096d1[_0x192d8e(0x224)]][_0x192d8e(0x1c6)](_0x29a6bb)&&(this[_0x192d8e(0x208)]=this[_0x192d8e(0x1e1)]?this['figureLabelTitle']:this[_0x192d8e(0x1ab)],this[_0x192d8e(0x208)]+=this['figureLabelDescription']?_0x3096d1[_0x192d8e(0x20f)](_0x192d8e(0x1e3),this[_0x192d8e(0x1e8)]):'');});}[_0x1c2c52(0x1c7)](){var _0x2eae34=_0x1c2c52;return _0x28c217`
      ${this[_0x2eae34(0x1ef)]?_0x28c217`
            <figure-label
              title="${this[_0x2eae34(0x1e1)]}"
              description="${this[_0x2eae34(0x1e8)]}"
            ></figure-label>
          `:''}
      ${this[_0x2eae34(0x1da)]?_0x28c217`<a href="${this[_0x2eae34(0x1da)]}"
            ><media-image-image
              ?round="${this[_0x2eae34(0x21a)]}"
              resource="${this['schemaResourceID']}-image"
              source="${this[_0x2eae34(0x1d8)]}"
              modal-title="${this[_0x2eae34(0x208)]}"
              alt="${this[_0x2eae34(0x1fe)]}"
              tabindex="${this[_0x2eae34(0x20e)]?'-1':'0'}"
              @click="${this[_0x2eae34(0x22b)]}"
            ></media-image-image
          ></a>`:_0x28c217`<media-image-image
            ?round="${this[_0x2eae34(0x21a)]}"
            resource="${this['schemaResourceID']}-image"
            source="${this['source']}"
            modal-title="${this[_0x2eae34(0x208)]}"
            alt="${this[_0x2eae34(0x1fe)]}"
            tabindex="${this[_0x2eae34(0x20e)]?'-1':'0'}"
            @click="${this[_0x2eae34(0x22b)]}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation"
          >${this[_0x2eae34(0x1db)]&&this[_0x2eae34(0x226)]?_0x28c217`<md-block
                style="--ddd-spacing-6:0px;"
                markdown="${this[_0x2eae34(0x1db)]}"
              ></md-block>`:_0x28c217`${this[_0x2eae34(0x1db)]}`}</slot
        >
      </media-image-citation>
      ${this[_0x2eae34(0x1fb)]?_0x28c217`
            <media-image-caption tabindex="0">
              <slot name="caption"
                >${this[_0x2eae34(0x1ab)]&&this[_0x2eae34(0x226)]?_0x28c217`<md-block
                      style="--ddd-spacing-6:0px;"
                      markdown="${this[_0x2eae34(0x1ab)]}"
                    ></md-block>`:_0x28c217`${this[_0x2eae34(0x1ab)]}`}</slot
              >
            </media-image-caption>
          `:''}
    eval("JSON.stringify({safe: true})");
    `;}[_0x1c2c52(0x1c2)](){var _0x30900c=_0x1c2c52,_0x4d842e={'TcYlP':_0x30900c(0x211)};return{'editModeChanged':_0x4d842e[_0x30900c(0x216)],'activeElementChanged':_0x30900c(0x1ea)};}[_0x1c2c52(0x22b)](_0x35c24f){var _0xb95670=_0x1c2c52;(this[_0xb95670(0x1ad)]||this[_0xb95670(0x20e)])&&(_0x35c24f[_0xb95670(0x1b4)](),_0x35c24f[_0xb95670(0x19d)](),_0x35c24f[_0xb95670(0x1e9)]()),!this[_0xb95670(0x1ad)]&&this[_0xb95670(0x1da)]&&this[_0xb95670(0x20e)]&&this[_0xb95670(0x1b6)][_0xb95670(0x223)]('a')[_0xb95670(0x1cb)]();}[_0x1c2c52(0x211)](_0x31a6e2){var _0x17c9a5=_0x1c2c52;this[_0x17c9a5(0x1ad)]=_0x31a6e2;}[_0x1c2c52(0x1ea)](_0x2475b2,_0x33915b){_0x33915b&&(this['_haxState']=_0x33915b);}static get[_0x1c2c52(0x1e4)](){return'media-image';}static get[_0x1c2c52(0x1bf)](){var _0x248388=_0x1c2c52,_0x2e5eef={'gQcSH':'as-md','oEPLB':_0x248388(0x1f9),'DiIBL':_0x248388(0x1b8)};return{...super[_0x248388(0x1bf)],'link':{'type':String},'asMd':{'type':Boolean,'attribute':_0x2e5eef['gQcSH']},'__figureLabel':{'type':Boolean},'modalTitle':{'type':String},'disableZoom':{'type':Boolean,'attribute':_0x248388(0x1b3),'reflect':!0x0},'_hasCaption':{'type':Boolean},'source':{'type':String},'citation':{'type':String},'caption':{'type':String},'alt':{'type':String},'size':{'type':String,'reflect':!0x0},'round':{'type':Boolean},'card':{'type':Boolean,'reflect':!0x0},'box':{'type':Boolean,'reflect':!0x0},'offset':{'type':String,'reflect':!0x0},'figureLabelTitle':{'type':String,'attribute':_0x2e5eef[_0x248388(0x22a)]},'figureLabelDescription':{'type':String,'attribute':_0x2e5eef[_0x248388(0x1ec)]}};}[_0x1c2c52(0x1c5)](_0xd7e7f7,_0x5b1f10){var _0xc1685d=_0x1c2c52;return _0xd7e7f7&&_0xd7e7f7['length']>0x0||_0x5b1f10&&_0x5b1f10[_0xc1685d(0x1f5)]>0x0;}[_0x1c2c52(0x209)](){var _0x3b5104=_0x1c2c52,_0x5b9b2d={'srZBl':function(_0x2fbd2b,_0x288cb9){return _0x2fbd2b>_0x288cb9;}};this[_0x3b5104(0x1fb)]=_0x5b9b2d[_0x3b5104(0x1e7)](this[_0x3b5104(0x1ab)][_0x3b5104(0x1f5)],0x0)||null!==this[_0x3b5104(0x223)](_0x3b5104(0x1ae));}[_0x1c2c52(0x1d2)](){var _0xfce875=_0x1c2c52;super[_0xfce875(0x1d2)](),this[_0xfce875(0x1b0)]=new MutationObserver(_0xe659c0=>{var _0x280f12=_0xfce875;this[_0x280f12(0x209)]();}),this[_0xfce875(0x1b0)][_0xfce875(0x214)](this,{'childList':!0x0});}[_0x1c2c52(0x1bc)](){var _0x2851ce=_0x1c2c52;this['_observer'][_0x2851ce(0x210)](),super[_0x2851ce(0x1bc)]();}static get[_0x1c2c52(0x227)](){var _0x107e4e=_0x1c2c52,_0x45ace9={'hijvv':_0x107e4e(0x202),'CNoAf':'media','EnxiY':_0x107e4e(0x1bb),'ZlMtc':'image','FkBhx':_0x107e4e(0x1ab),'Bpdqn':_0x107e4e(0x1c1),'nMhTi':_0x107e4e(0x1fe),'ViIrc':_0x107e4e(0x1db),'dbZFl':_0x107e4e(0x1d8),'kjcxq':'Source','JHeOB':_0x107e4e(0x1d5),'GWOMP':_0x107e4e(0x1eb),'NUOsl':_0x107e4e(0x1da),'CMUdt':_0x107e4e(0x1dd),'DhLXk':_0x107e4e(0x1e0),'BRWAj':_0x107e4e(0x1c0),'szBhH':'Apply\x20a\x20visual\x20box\x20around\x20the\x20image.','jFhxW':'boolean','CXqzn':'Apply\x20a\x20left\x20or\x20right\x20offset\x20to\x20the\x20image.','HjvZg':_0x107e4e(0x1a5),'wILIS':'none','tvQox':_0x107e4e(0x1b9),'lAujO':_0x107e4e(0x1b7),'CsdBb':_0x107e4e(0x1f4),'AhVFE':_0x107e4e(0x1a6),'blBXY':_0x107e4e(0x220),'JpnZh':_0x107e4e(0x21a),'EkSRg':'disableZoom','LuVOA':_0x107e4e(0x19f),'ddgGy':_0x107e4e(0x1a1),'BwRMA':_0x107e4e(0x19c),'nnNii':_0x107e4e(0x1b5),'KEAjC':_0x107e4e(0x219)};return{'canScale':!0x0,'canEditSource':!0x0,'gizmo':{'title':_0x107e4e(0x1f3),'descrption':_0x45ace9['hijvv'],'icon':_0x107e4e(0x20d),'color':_0x107e4e(0x1a2),'tags':[_0x107e4e(0x1f1),_0x45ace9[_0x107e4e(0x1e6)],'core',_0x45ace9[_0x107e4e(0x21e)],_0x45ace9[_0x107e4e(0x1c8)],_0x45ace9[_0x107e4e(0x1dc)],_0x45ace9['Bpdqn'],_0x107e4e(0x20a)],'handles':[{'type':_0x45ace9[_0x107e4e(0x1c8)],'type_exclusive':!0x0,'source':_0x107e4e(0x1d8),'title':'alt','alt':_0x45ace9['nMhTi'],'citation':_0x45ace9[_0x107e4e(0x19a)],'caption':_0x45ace9[_0x107e4e(0x1dc)]}],'meta':{'author':_0x107e4e(0x221),'outlineDesigner':!0x0}},'settings':{'configure':[{'property':_0x45ace9['dbZFl'],'title':_0x45ace9[_0x107e4e(0x21d)],'description':_0x45ace9[_0x107e4e(0x1b1)],'inputMethod':_0x45ace9[_0x107e4e(0x232)],'noVoiceRecord':!0x0,'required':!0x0},{'property':_0x45ace9['nMhTi'],'title':'Alternative\x20text','description':_0x107e4e(0x1f0),'inputMethod':_0x45ace9[_0x107e4e(0x1be)],'required':!0x0},{'property':_0x45ace9['NUOsl'],'title':_0x45ace9[_0x107e4e(0x1bd)],'description':_0x45ace9[_0x107e4e(0x1ca)],'inputMethod':_0x45ace9[_0x107e4e(0x232)],'noVoiceRecord':!0x0,'noCamera':!0x0,'required':!0x1},{'property':'card','title':_0x107e4e(0x1e5),'description':_0x107e4e(0x21b),'inputMethod':_0x107e4e(0x230),'required':!0x1},{'property':_0x45ace9[_0x107e4e(0x1d4)],'title':_0x107e4e(0x21f),'description':_0x45ace9[_0x107e4e(0x21c)],'inputMethod':_0x45ace9[_0x107e4e(0x1af)],'required':!0x1},{'property':'offset','title':'Offset','description':_0x45ace9['CXqzn'],'inputMethod':_0x45ace9[_0x107e4e(0x1de)],'options':{'none':_0x45ace9[_0x107e4e(0x200)],'wide':'wide','narrow':_0x45ace9[_0x107e4e(0x228)]}},{'property':_0x45ace9[_0x107e4e(0x19a)],'title':_0x45ace9[_0x107e4e(0x1f8)],'description':_0x45ace9['CsdBb'],'inputMethod':'textfield','required':!0x1},{'property':_0x107e4e(0x1ab),'title':_0x107e4e(0x1d1),'description':_0x107e4e(0x19b),'inputMethod':_0x45ace9[_0x107e4e(0x1d6)],'required':!0x1},{'property':_0x107e4e(0x1e1),'title':_0x107e4e(0x1b2),'description':_0x107e4e(0x22e),'inputMethod':_0x45ace9[_0x107e4e(0x1d6)],'required':!0x1},{'property':_0x107e4e(0x1e8),'title':_0x45ace9[_0x107e4e(0x1d0)],'description':_0x107e4e(0x206),'inputMethod':_0x107e4e(0x1a6),'required':!0x1}],'advanced':[{'property':_0x45ace9['JpnZh'],'title':_0x107e4e(0x215),'description':'Crops\x20the\x20image\x20appearance\x20to\x20be\x20circle\x20in\x20shape.','inputMethod':_0x107e4e(0x230),'required':!0x1},{'property':_0x45ace9[_0x107e4e(0x1a0)],'title':_0x107e4e(0x205),'description':_0x107e4e(0x22d),'inputMethod':_0x107e4e(0x230),'required':!0x1}],'developer':[{'property':_0x107e4e(0x226),'title':_0x45ace9['LuVOA'],'description':_0x45ace9[_0x107e4e(0x1ac)],'inputMethod':_0x107e4e(0x230),'required':!0x1}]},'demoSchema':[{'tag':_0x45ace9[_0x107e4e(0x1ee)],'properties':{'source':_0x45ace9[_0x107e4e(0x1ff)],'card':!0x0,'citation':_0x45ace9[_0x107e4e(0x1ba)]}}]};}}globalThis[_0x1c2c52(0x1d3)][_0x1c2c52(0x1c3)](MediaImage['tag'],MediaImage);class MediaImageImage extends _0x35cb31(_0x279b0e){static get[_0x1c2c52(0x1cf)](){return[super['styles'],_0x32a3f1`
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
      `];}constructor(){var _0x497f78=_0x1c2c52;super(),this[_0x497f78(0x21a)]=!0x1,globalThis[_0x497f78(0x1a3)]&&(this[_0x497f78(0x1cd)]=globalThis[_0x497f78(0x1a3)][_0x497f78(0x22f)](_0x497f78(0x203)),this[_0x497f78(0x1cd)]['noLeft']=!0x0),this[_0x497f78(0x208)]='',this[_0x497f78(0x222)]&&this['addEventListener']('simple-modal-show',this[_0x497f78(0x207)][_0x497f78(0x1f6)](this));}['__modalShowEvent'](_0x200181){var _0x5d4cab=_0x1c2c52,_0x25d163={'nlKTi':_0x5d4cab(0x1c9)};import(_0x25d163[_0x5d4cab(0x1a9)]);}[_0x1c2c52(0x1c7)](){var _0xba8934=_0x1c2c52;return _0x28c217`
      <div class="image-wrap">
        <img src="${this['source']}" alt="${this[_0xba8934(0x1fe)]}" loading="lazy" />
      </div>
    Function("return Object.keys({a:1});")();
    `;}[_0x1c2c52(0x1a4)](_0xb8fb32){var _0xd53e24=_0x1c2c52,_0x372dde={'fjZlF':function(_0x360652,_0x11b74b){return _0x360652==_0x11b74b;},'dgRSW':_0xd53e24(0x1d8)};_0xb8fb32[_0xd53e24(0x20c)]((_0x4740da,_0x3940bc)=>{var _0x442fd1=_0xd53e24;_0x372dde[_0x442fd1(0x22c)](_0x372dde[_0x442fd1(0x225)],_0x3940bc)&&(this[_0x442fd1(0x1cd)][_0x442fd1(0x1d7)]=this[_0x3940bc]);});}static get['properties'](){var _0x560161=_0x1c2c52,_0x4bf763={'EndmO':_0x560161(0x212)};return{'source':{'type':String},'alt':{'type':String},'round':{'type':Boolean,'reflect':!0x0},'modalTitle':{'type':String,'attribute':_0x4bf763[_0x560161(0x231)]}};}static get['tag'](){var _0x40239e=_0x1c2c52;return _0x40239e(0x1ed);}}globalThis[_0x1c2c52(0x1d3)][_0x1c2c52(0x1c3)](MediaImageImage[_0x1c2c52(0x1e4)],MediaImageImage);class MediaImageCitation extends _0x279b0e{static get[_0x1c2c52(0x1cf)](){return[super['styles'],_0x32a3f1`
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
      eval("JSON.stringify({safe: true})");
      `];}[_0x1c2c52(0x1c7)](){return _0x28c217` <div class="citation"><slot></slot></div> `;}static get[_0x1c2c52(0x1e4)](){var _0x44c3c1=_0x1c2c52;return _0x44c3c1(0x1d9);}}globalThis[_0x1c2c52(0x1d3)][_0x1c2c52(0x1c3)](MediaImageCitation[_0x1c2c52(0x1e4)],MediaImageCitation);class MediaImageCaption extends _0x279b0e{static get[_0x1c2c52(0x1cf)](){return[super['styles'],_0x32a3f1`
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
      new Function("var x = 42; return x;")();
      `];}['render'](){return _0x28c217`
      <div class="caption">
        ${this['__hasContent']?'':_0x28c217`<slot id="slot"></slot>`}
      </div>
    new Function("var x = 42; return x;")();
    `;}static get['tag'](){var _0x14fcdb=_0x1c2c52,_0x53812e={'gZODW':_0x14fcdb(0x1fd)};return _0x53812e[_0x14fcdb(0x1cc)];}}globalThis[_0x1c2c52(0x1d3)][_0x1c2c52(0x1c3)](MediaImageCaption[_0x1c2c52(0x1e4)],MediaImageCaption);export{MediaImage};