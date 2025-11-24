/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x2af5(){const _0x5cb880=['title','target','_updateFilter','has','name','define','24563803XyBmrb','1713OKiHZU','.filter','push','activeFilter','join','VtKJN','updateFilter','updated','startViewTransition','remove','properties','add','metadata','render','href','.haxProperties.json','276831ffpPuK','farIW','map','38BOanQN','12TduPaP','capitalizeWords','4QTpLqx','includes','80MrSDLe','434045BBUnyd','lFZZn','currentTarget','data','active','1138419WOfZGF','slice','querySelectorAll','images','toUpperCase','haxProperties','91TIJuQD','filteredData','tSGDn','tags','charAt','293192iTezgf','WTdCE','5662788KAVcrE','glossy-portfolio-grid','length','all','CZTgG','url','forEach','hZWlJ','tag','filtersList','document','split','styles'];_0x2af5=function(){return _0x5cb880;};return _0x2af5();}const _0x4242f3=_0x5424;(function(_0x155257,_0x110f5f){const _0x14e239=_0x5424,_0x2c3f22=_0x155257();while(!![]){try{const _0x41dac5=parseInt(_0x14e239(0xe5))/0x1+parseInt(_0x14e239(0x119))/0x2*(-parseInt(_0x14e239(0x106))/0x3)+parseInt(_0x14e239(0xdd))/0x4*(parseInt(_0x14e239(0xe0))/0x5)+parseInt(_0x14e239(0xf2))/0x6+-parseInt(_0x14e239(0xeb))/0x7*(-parseInt(_0x14e239(0xf0))/0x8)+-parseInt(_0x14e239(0x116))/0x9*(-parseInt(_0x14e239(0xdf))/0xa)+parseInt(_0x14e239(0x105))/0xb*(-parseInt(_0x14e239(0xdb))/0xc);if(_0x41dac5===_0x110f5f)break;else _0x2c3f22['push'](_0x2c3f22['shift']());}catch(_0x2e9c8c){_0x2c3f22['push'](_0x2c3f22['shift']());}}}(_0x2af5,0x9e1bd));import{LitElement as _0x330a0c,html as _0x41c577,css as _0x76ffbf}from'../../../lit/index.js';import{DDDSuper as _0x4fa184}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0xa01db6}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x499ab7}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x124f4f,toJS as _0x46cbeb}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x4fa184(_0xa01db6(_0x330a0c)){static get[_0x4242f3(0xfa)](){const _0x255b98=_0x4242f3;return _0x255b98(0xf3);}constructor(){const _0x72c076=_0x4242f3;super(),this['filtersList']=[],this[_0x72c076(0xec)]=[],this[_0x72c076(0xe3)]=[],this['activeFilter']='';}static get[_0x4242f3(0x110)](){const _0x38e706=_0x4242f3;return{...super[_0x38e706(0x110)],'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get['styles'](){const _0x255ca8=_0x4242f3;return[super[_0x255ca8(0xfe)],_0x76ffbf`
      :host {
        display: block;
        color: white;
      }
      *{
        box-sizing: border-box;
      }
      button {
        all: unset;
        cursor: pointer;
      }

      .container-background{
        margin: auto;
        max-width: var(--max-width); 
        background-color: var(--bg-color);

        width: 100%;
        padding: var(--page-padding);
        min-height: 100vh;
        padding-bottom: 30px;
      }
      .projects-header{
        display: flex;
        justify-content: space-between;
        padding: 50px 0;
        max-width: 100%;
      }
      .grid-title{
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 1.7px;

      }
      .filters{
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

      }
      .filters:hover{
        cursor: pointer;

      }

      .filter{
        font-family: "Inter", "Inter Placeholder", sans-serif;
        font-size: 1rem;
        color: rgb(153, 153, 153);
      }
      .card-container {
        display: grid;
        /* border: 1px solid red; */
        grid-template-columns: repeat(2, minmax(200px, 1fr));
        gap: 45px;
        justify-content: center;
        /* width: 100vw; */
        overflow: hidden;
        max-width: var(--max-width); 
      }

      glossy-portfolio-card{
        height: auto;
      }


      h3 span {
        font-size: var(--glossy-portfolio-label-font-size, var(--ddd-font-size-s));
      }
      .filter.active {
        font-weight: bold;
      }

      @media (max-width: 575.98px) {
        .projects-header{
          flex-direction: column;
          gap: 16px;
          padding: 50px 0 20px 0;
        }
        .card-container {
         grid-template-columns: 1fr;
         gap: 25px;

        }
        .container-background{
          padding: var(--mobile-page-padding);

        }
      }

    `];}[_0x4242f3(0x113)](){const _0x59f1ca=_0x4242f3;return _0x41c577`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="grid-title">${this['title'][_0x59f1ca(0xe9)]()}</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0x59f1ca(0x10c)]}">All</button>
      
        <!-- print filters -->
      ${Array['from'](this[_0x59f1ca(0xfb)])[_0x59f1ca(0x118)](_0x4473a8=>_0x41c577`
        <button @click="${this[_0x59f1ca(0x10c)]}" name="${_0x4473a8}"  class="filter"> 
          ${this[_0x59f1ca(0xdc)](_0x4473a8)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">
    ${this[_0x59f1ca(0xec)][_0x59f1ca(0x118)](_0x3d0290=>_0x41c577`
        <glossy-portfolio-card class="card" 
        title="${_0x3d0290[_0x59f1ca(0xff)]}" 
        thumbnail=${_0x3d0290[_0x59f1ca(0x112)][_0x59f1ca(0xe8)][0x0]?_0x3d0290[_0x59f1ca(0x112)][_0x59f1ca(0xe8)][0x0]:'https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg'}
        slug="${_0x3d0290['slug']}"
        >
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

`;}['capitalizeWords'](_0x14aee4){const _0x30e5e5=_0x4242f3;return _0x14aee4[_0x30e5e5(0xfd)]('\x20')[_0x30e5e5(0x118)](_0x39a1fc=>_0x39a1fc[_0x30e5e5(0xef)](0x0)[_0x30e5e5(0xe9)]()+_0x39a1fc[_0x30e5e5(0xe6)](0x1))[_0x30e5e5(0x10a)]('\x20');}['updated'](_0x5ca0c3){const _0x12e088=_0x4242f3;super[_0x12e088(0x10d)](_0x5ca0c3),_0x5ca0c3[_0x12e088(0x102)](_0x12e088(0xe3))&&this['data']&&this['data'][_0x12e088(0xf4)]>0x0&&(this[_0x12e088(0xec)]=this[_0x12e088(0xe3)],this[_0x12e088(0xfb)]=[],this[_0x12e088(0xe3)][_0x12e088(0xf8)](_0x100791=>{const _0x5706f2=_0x12e088;if(void 0x0!==_0x100791['metadata'][_0x5706f2(0xee)]&&null!==_0x100791[_0x5706f2(0x112)]['tags']&&_0x100791[_0x5706f2(0x112)][_0x5706f2(0xee)][_0x5706f2(0xfd)](',')[_0x5706f2(0xf4)]>0x0){const _0x35e620=_0x100791['metadata'][_0x5706f2(0xee)][_0x5706f2(0xfd)](',')[0x0];this[_0x5706f2(0xfb)][_0x5706f2(0xde)](_0x35e620)||this['filtersList'][_0x5706f2(0x108)](_0x35e620);}}));}[_0x4242f3(0x101)](_0x4769f4,_0x3dd78c){const _0x381e9f=_0x4242f3,_0x296a2f={'CZTgG':_0x381e9f(0x103),'VtKJN':_0x381e9f(0xe4)};this['activeFilter']=_0x4769f4['getAttribute'](_0x296a2f[_0x381e9f(0xf6)]),(this['renderRoot'][_0x381e9f(0xe7)](_0x381e9f(0x107))[_0x381e9f(0xf8)](_0x43ab11=>_0x43ab11['classList'][_0x381e9f(0x10f)](_0x381e9f(0xe4))),_0x3dd78c['classList'][_0x381e9f(0x111)](_0x296a2f[_0x381e9f(0x10b)]),this['filterData']());}['updateFilter'](_0x16c264){const _0x1ff300=_0x4242f3,_0x4c199f=_0x16c264[_0x1ff300(0x100)],_0x34965f=_0x16c264[_0x1ff300(0xe2)];globalThis['document'][_0x1ff300(0x10e)]?globalThis[_0x1ff300(0xfc)][_0x1ff300(0x10e)](()=>{const _0x58782a=_0x1ff300;this[_0x58782a(0x101)](_0x4c199f,_0x34965f);}):this[_0x1ff300(0x101)](_0x4c199f,_0x34965f);}['filterData'](){const _0x40bf26=_0x4242f3,_0x508e85={'tSGDn':_0x40bf26(0x117),'lFZZn':function(_0x3a1052,_0x39ac41){return _0x3a1052===_0x39ac41;}};_0x508e85[_0x40bf26(0xe1)](_0x40bf26(0xf5),this[_0x40bf26(0x109)])?this[_0x40bf26(0xec)]=this[_0x40bf26(0xe3)]:(this[_0x40bf26(0xec)]=[],this[_0x40bf26(0xe3)][_0x40bf26(0xf8)](_0x307792=>{const _0x121180=_0x40bf26,_0xf6398e={'hZWlJ':'glossy-portfolio-grid'};if(_0x121180(0xf1)===_0x508e85[_0x121180(0xed)])return _0xf6398e[_0x121180(0xf9)];else _0x307792[_0x121180(0x112)]['tags']&&_0x307792['metadata'][_0x121180(0xee)]['includes'](this['activeFilter'])&&this[_0x121180(0xec)][_0x121180(0x108)](_0x307792);}));}static get[_0x4242f3(0xea)](){const _0x3c356a=_0x4242f3;return new URL('./lib/'+this[_0x3c356a(0xfa)]+_0x3c356a(0x115),import.meta[_0x3c356a(0xf7)])[_0x3c356a(0x114)];}}function _0x5424(_0x409c8c,_0x229f5a){const _0x2af54d=_0x2af5();return _0x5424=function(_0x54244a,_0x4a2610){_0x54244a=_0x54244a-0xdb;let _0x1ec0d9=_0x2af54d[_0x54244a];return _0x1ec0d9;},_0x5424(_0x409c8c,_0x229f5a);}globalThis['customElements'][_0x4242f3(0x104)](GlossyPortfolioGrid[_0x4242f3(0xfa)],GlossyPortfolioGrid);