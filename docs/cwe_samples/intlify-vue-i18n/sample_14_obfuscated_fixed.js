/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x4255(){const _0x367523=['updateFilter','styles','./lib/','currentTarget','customElements','split','target','startViewTransition','data','1WuaOXP','classList','activeFilter','filtersList','54cIRgjq','_updateFilter','toUpperCase','https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg','includes','title','844846mIkHRW','url','querySelectorAll','4nNHGOQ','forEach','length','tag','IxmDI','from','map','126290lrsUOJ','remove','654768SSwdky','charAt','tags','active','metadata','capitalizeWords','has','all','1955155eHNDvY','1241232KSArxL','6411392ycQBbi','document','push','filterData','properties','28oLJDEf','href','filteredData','define','updated','.haxProperties.json','LKliB','join','slug','.filter','7626751qZRAQZ','images'];_0x4255=function(){return _0x367523;};return _0x4255();}const _0x2243cc=_0x4f4c;(function(_0x19a873,_0x28a05c){const _0xb99a35=_0x4f4c,_0x20b050=_0x19a873();while(!![]){try{const _0x27f5e8=-parseInt(_0xb99a35(0x101))/0x1*(-parseInt(_0xb99a35(0xd1))/0x2)+-parseInt(_0xb99a35(0xdd))/0x3+parseInt(_0xb99a35(0xd4))/0x4*(-parseInt(_0xb99a35(0xe5))/0x5)+-parseInt(_0xb99a35(0xe6))/0x6*(-parseInt(_0xb99a35(0xec))/0x7)+-parseInt(_0xb99a35(0xe7))/0x8+parseInt(_0xb99a35(0x105))/0x9*(-parseInt(_0xb99a35(0xdb))/0xa)+parseInt(_0xb99a35(0xf6))/0xb;if(_0x27f5e8===_0x28a05c)break;else _0x20b050['push'](_0x20b050['shift']());}catch(_0x37b7a4){_0x20b050['push'](_0x20b050['shift']());}}}(_0x4255,0x6f83f));import{LitElement as _0x4e115b,html as _0x51b1e6,css as _0x5ef385}from'../../../lit/index.js';import{DDDSuper as _0x4578ef}from'../../d-d-d/d-d-d.js';function _0x4f4c(_0x737c39,_0x5f346a){const _0x425595=_0x4255();return _0x4f4c=function(_0x4f4ce3,_0x349f87){_0x4f4ce3=_0x4f4ce3-0xcf;let _0xfeca57=_0x425595[_0x4f4ce3];return _0xfeca57;},_0x4f4c(_0x737c39,_0x5f346a);}import{I18NMixin as _0x3b0df2}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x3aec02}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x3a0950,toJS as _0x307fa8}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x4578ef(_0x3b0df2(_0x4e115b)){static get[_0x2243cc(0xd7)](){return'glossy-portfolio-grid';}constructor(){const _0x37cb8c=_0x2243cc;super(),this[_0x37cb8c(0x104)]=[],this[_0x37cb8c(0xee)]=[],this[_0x37cb8c(0x100)]=[],this[_0x37cb8c(0x103)]='';}static get['properties'](){const _0x5eac69=_0x2243cc;return{...super[_0x5eac69(0xeb)],'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get[_0x2243cc(0xf9)](){return[super['styles'],_0x5ef385`
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

    `];}['render'](){const _0x30b81d=_0x2243cc;return _0x51b1e6`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="grid-title">${this['title']['toUpperCase']()}</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0x30b81d(0xf8)]}">All</button>
      
        <!-- print filters -->
      ${Array[_0x30b81d(0xd9)](this['filtersList'])[_0x30b81d(0xda)](_0x573e7b=>_0x51b1e6`
        <button @click="${this[_0x30b81d(0xf8)]}" name="${_0x573e7b}"  class="filter"> 
          ${this[_0x30b81d(0xe2)](_0x573e7b)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">
    ${this[_0x30b81d(0xee)][_0x30b81d(0xda)](_0x30868f=>_0x51b1e6`
        <glossy-portfolio-card class="card" 
        title="${_0x30868f[_0x30b81d(0xd0)]}" 
        thumbnail=${_0x30868f[_0x30b81d(0xe1)]['images'][0x0]?_0x30868f[_0x30b81d(0xe1)][_0x30b81d(0xf7)][0x0]:_0x30b81d(0x108)}
        slug="${_0x30868f[_0x30b81d(0xf4)]}"
        >
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

`;}['capitalizeWords'](_0xd519){const _0x33933f=_0x2243cc;return _0xd519['split']('\x20')[_0x33933f(0xda)](_0x5651e0=>_0x5651e0[_0x33933f(0xde)](0x0)[_0x33933f(0x107)]()+_0x5651e0['slice'](0x1))[_0x33933f(0xf3)]('\x20');}[_0x2243cc(0xf0)](_0x15ced1){const _0x4bb98a=_0x2243cc,_0x36b00d={'LKliB':function(_0x239dcc,_0x19dac3){return _0x239dcc!==_0x19dac3;},'IxmDI':function(_0x198ee1,_0x4ff380){return _0x198ee1>_0x4ff380;}};super[_0x4bb98a(0xf0)](_0x15ced1),_0x15ced1[_0x4bb98a(0xe3)]('data')&&this[_0x4bb98a(0x100)]&&this['data'][_0x4bb98a(0xd6)]>0x0&&(this['filteredData']=this[_0x4bb98a(0x100)],this[_0x4bb98a(0x104)]=[],this[_0x4bb98a(0x100)]['forEach'](_0x40fe29=>{const _0xf18e78=_0x4bb98a;if(void 0x0!==_0x40fe29[_0xf18e78(0xe1)][_0xf18e78(0xdf)]&&_0x36b00d[_0xf18e78(0xf2)](null,_0x40fe29[_0xf18e78(0xe1)]['tags'])&&_0x36b00d[_0xf18e78(0xd8)](_0x40fe29[_0xf18e78(0xe1)][_0xf18e78(0xdf)][_0xf18e78(0xfd)](',')[_0xf18e78(0xd6)],0x0)){const _0x3e63ad=_0x40fe29[_0xf18e78(0xe1)][_0xf18e78(0xdf)][_0xf18e78(0xfd)](',')[0x0];this[_0xf18e78(0x104)][_0xf18e78(0xcf)](_0x3e63ad)||this['filtersList'][_0xf18e78(0xe9)](_0x3e63ad);}}));}[_0x2243cc(0x106)](_0x2cfc3e,_0xa175d8){const _0x255450=_0x2243cc,_0x4d11c0={'vwdGK':_0x255450(0xe0)};this[_0x255450(0x103)]=_0x2cfc3e['getAttribute']('name'),(this['renderRoot'][_0x255450(0xd3)](_0x255450(0xf5))[_0x255450(0xd5)](_0x37ba78=>_0x37ba78[_0x255450(0x102)][_0x255450(0xdc)](_0x255450(0xe0))),_0xa175d8[_0x255450(0x102)]['add'](_0x4d11c0['vwdGK']),this[_0x255450(0xea)]());}[_0x2243cc(0xf8)](_0x4d0e70){const _0x1256b8=_0x2243cc,_0x14c883=_0x4d0e70[_0x1256b8(0xfe)],_0x2a58f3=_0x4d0e70[_0x1256b8(0xfb)];globalThis['document'][_0x1256b8(0xff)]?globalThis[_0x1256b8(0xe8)][_0x1256b8(0xff)](()=>{const _0x16f555=_0x1256b8;this[_0x16f555(0x106)](_0x14c883,_0x2a58f3);}):this[_0x1256b8(0x106)](_0x14c883,_0x2a58f3);}[_0x2243cc(0xea)](){const _0x4f7620=_0x2243cc;_0x4f7620(0xe4)===this['activeFilter']?this[_0x4f7620(0xee)]=this['data']:(this[_0x4f7620(0xee)]=[],this['data'][_0x4f7620(0xd5)](_0x31b8d8=>{const _0xff85f0=_0x4f7620;_0x31b8d8[_0xff85f0(0xe1)]['tags']&&_0x31b8d8['metadata']['tags'][_0xff85f0(0xcf)](this[_0xff85f0(0x103)])&&this[_0xff85f0(0xee)][_0xff85f0(0xe9)](_0x31b8d8);}));}static get['haxProperties'](){const _0x18deb2=_0x2243cc;return new URL(_0x18deb2(0xfa)+this[_0x18deb2(0xd7)]+_0x18deb2(0xf1),import.meta[_0x18deb2(0xd2)])[_0x18deb2(0xed)];}}globalThis[_0x2243cc(0xfc)][_0x2243cc(0xef)](GlossyPortfolioGrid[_0x2243cc(0xd7)],GlossyPortfolioGrid);