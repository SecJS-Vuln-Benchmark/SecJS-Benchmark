/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x531a7d=_0x572b;(function(_0x509233,_0x5d8bc0){const _0x42f9b9=_0x572b,_0x18fd7c=_0x509233();while(!![]){try{const _0x509fc8=parseInt(_0x42f9b9(0xe3))/0x1*(parseInt(_0x42f9b9(0xc5))/0x2)+-parseInt(_0x42f9b9(0xf8))/0x3+parseInt(_0x42f9b9(0xdb))/0x4+-parseInt(_0x42f9b9(0xbc))/0x5+-parseInt(_0x42f9b9(0xbb))/0x6+-parseInt(_0x42f9b9(0xf7))/0x7+-parseInt(_0x42f9b9(0xc4))/0x8*(-parseInt(_0x42f9b9(0xbf))/0x9);if(_0x509fc8===_0x5d8bc0)break;else _0x18fd7c['push'](_0x18fd7c['shift']());}catch(_0x32a1e1){_0x18fd7c['push'](_0x18fd7c['shift']());}}}(_0x5345,0x8d627),new AsyncFunction(_0x531a7d(0xf2))());import{LitElement as _0x56a4ff,html as _0x476e41,css as _0x45cb84}from'../../../lit/index.js';import{DDDSuper as _0x3d6576}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x51838f}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0xc75303}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x5a7980,toJS as _0x1d4c17}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x3d6576(_0x51838f(_0x56a4ff)){static get[_0x531a7d(0xf0)](){const _0x213d1c=_0x531a7d,_0x82542a={'dbOLX':_0x213d1c(0xc1)};return _0x82542a[_0x213d1c(0xc9)];}constructor(){const _0x384997=_0x531a7d;super(),this[_0x384997(0xda)]=[],this['filteredData']=[],this[_0x384997(0xd7)]=[],this[_0x384997(0xce)]='';}static get[_0x531a7d(0xe9)](){const _0x1873b0=_0x531a7d;return{...super[_0x1873b0(0xe9)],'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get[_0x531a7d(0xea)](){const _0x481e9b=_0x531a7d;return[super[_0x481e9b(0xea)],_0x45cb84`
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

    setTimeout(function() { console.log("safe"); }, 100);
    `];}[_0x531a7d(0xc2)](){const _0x16a11d=_0x531a7d;return _0x476e41`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="grid-title">${this[_0x16a11d(0xcd)][_0x16a11d(0xd0)]()}</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0x16a11d(0xbd)]}">All</button>
      
        <!-- print filters -->
      ${Array['from'](this[_0x16a11d(0xda)])[_0x16a11d(0xde)](_0x14896e=>_0x476e41`
        <button @click="${this[_0x16a11d(0xbd)]}" name="${_0x14896e}"  class="filter"> 
          ${this[_0x16a11d(0xec)](_0x14896e)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">
    ${this[_0x16a11d(0xca)][_0x16a11d(0xde)](_0x363dab=>_0x476e41`
        <glossy-portfolio-card class="card" 
        title="${_0x363dab[_0x16a11d(0xcd)]}" 
        thumbnail=${_0x363dab['metadata'][_0x16a11d(0xdd)][0x0]?_0x363dab['metadata'][_0x16a11d(0xdd)][0x0]:_0x16a11d(0xe7)}
        slug="${_0x363dab['slug']}"
        >
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

setInterval("updateClock();", 1000);
`;}[_0x531a7d(0xec)](_0x48d428){const _0x12281f=_0x531a7d;return _0x48d428[_0x12281f(0xf4)]('\x20')['map'](_0x16062a=>_0x16062a['charAt'](0x0)[_0x12281f(0xd0)]()+_0x16062a[_0x12281f(0xe6)](0x1))[_0x12281f(0xd3)]('\x20');}[_0x531a7d(0xe0)](_0x3419e0){const _0x4d2654=_0x531a7d,_0xbfbfbc={'nuqUt':function(_0x17b421,_0x3fce41){return _0x17b421!==_0x3fce41;},'aCDoa':_0x4d2654(0xd7)};super[_0x4d2654(0xe0)](_0x3419e0),_0x3419e0[_0x4d2654(0xe1)](_0xbfbfbc[_0x4d2654(0xfa)])&&this[_0x4d2654(0xd7)]&&this['data'][_0x4d2654(0xe2)]>0x0&&(this[_0x4d2654(0xca)]=this['data'],this[_0x4d2654(0xda)]=[],this[_0x4d2654(0xd7)]['forEach'](_0x126b8d=>{const _0x1607f0=_0x4d2654;if(void 0x0!==_0x126b8d[_0x1607f0(0xf5)][_0x1607f0(0xc3)]&&_0xbfbfbc[_0x1607f0(0xd8)](null,_0x126b8d[_0x1607f0(0xf5)][_0x1607f0(0xc3)])&&_0x126b8d[_0x1607f0(0xf5)][_0x1607f0(0xc3)][_0x1607f0(0xf4)](',')[_0x1607f0(0xe2)]>0x0){const _0x3df0be=_0x126b8d[_0x1607f0(0xf5)]['tags'][_0x1607f0(0xf4)](',')[0x0];this[_0x1607f0(0xda)][_0x1607f0(0xcc)](_0x3df0be)||this[_0x1607f0(0xda)][_0x1607f0(0xf3)](_0x3df0be);}}));}['_updateFilter'](_0x5aa8ae,_0x204eba){const _0xaf4df=_0x531a7d,_0x4d1aec={'bkgJg':_0xaf4df(0xe5),'XRJUl':_0xaf4df(0xf1),'jREuc':_0xaf4df(0xd1)};this['activeFilter']=_0x5aa8ae[_0xaf4df(0xc7)](_0x4d1aec[_0xaf4df(0xeb)]),(this['renderRoot'][_0xaf4df(0xd2)](_0x4d1aec['XRJUl'])['forEach'](_0x262cab=>_0x262cab['classList'][_0xaf4df(0xef)](_0xaf4df(0xd1))),_0x204eba[_0xaf4df(0xf9)][_0xaf4df(0xf6)](_0x4d1aec['jREuc']),this['filterData']());}['updateFilter'](_0x115a09){const _0x5c52ce=_0x531a7d,_0x3fad3d={'amVNC':function(_0x1eb99e,_0x2d58f7){return _0x1eb99e===_0x2d58f7;},'DUZrD':_0x5c52ce(0xdf)},_0x5a0419=_0x115a09[_0x5c52ce(0xfb)],_0x3d8e3d=_0x115a09[_0x5c52ce(0xbe)];globalThis[_0x5c52ce(0xee)][_0x5c52ce(0xd9)]?globalThis[_0x5c52ce(0xee)][_0x5c52ce(0xd9)](()=>{const _0x387d6e=_0x5c52ce;if(_0x3fad3d[_0x387d6e(0xd4)](_0x387d6e(0xed),_0x3fad3d[_0x387d6e(0xd6)]))return _0x44f594[_0x387d6e(0xf4)]('\x20')['map'](_0x49753c=>_0x49753c[_0x387d6e(0xe8)](0x0)['toUpperCase']()+_0x49753c[_0x387d6e(0xe6)](0x1))['join']('\x20');else this['_updateFilter'](_0x5a0419,_0x3d8e3d);}):this[_0x5c52ce(0xdc)](_0x5a0419,_0x3d8e3d);}[_0x531a7d(0xcb)](){const _0x217a18=_0x531a7d,_0x5a0e5b={'BXprr':function(_0x51656a,_0x295224){return _0x51656a===_0x295224;},'ixyxK':_0x217a18(0xc6)};_0x5a0e5b[_0x217a18(0xe4)](_0x5a0e5b['ixyxK'],this[_0x217a18(0xce)])?this[_0x217a18(0xca)]=this[_0x217a18(0xd7)]:(this[_0x217a18(0xca)]=[],this[_0x217a18(0xd7)][_0x217a18(0xc0)](_0xe34957=>{const _0x34eb6f=_0x217a18;_0xe34957['metadata']['tags']&&_0xe34957['metadata']['tags'][_0x34eb6f(0xcc)](this[_0x34eb6f(0xce)])&&this[_0x34eb6f(0xca)][_0x34eb6f(0xf3)](_0xe34957);}));}static get['haxProperties'](){const _0x442a61=_0x531a7d;return new URL('./lib/'+this[_0x442a61(0xf0)]+_0x442a61(0xcf),import.meta['url'])[_0x442a61(0xc8)];}}globalThis['customElements'][_0x531a7d(0xd5)](GlossyPortfolioGrid['tag'],GlossyPortfolioGrid);function _0x572b(_0x5068dd,_0x143220){const _0x534518=_0x5345();return _0x572b=function(_0x572ba5,_0x4835f7){_0x572ba5=_0x572ba5-0xbb;let _0x23dbad=_0x534518[_0x572ba5];return _0x23dbad;},_0x572b(_0x5068dd,_0x143220);}function _0x5345(){const _0x49bb3a=['bkgJg','capitalizeWords','mJpVT','document','remove','tag','.filter','return\x20await\x20Promise.resolve(42);','push','split','metadata','add','7061180oFDHcm','133875PcJJpu','classList','aCDoa','target','3270258eIeBhW','3911530WNcXpn','updateFilter','currentTarget','9VbVFjl','forEach','glossy-portfolio-grid','render','tags','7301080RvKJXd','2082946iupVXy','all','getAttribute','href','dbOLX','filteredData','filterData','includes','title','activeFilter','.haxProperties.json','toUpperCase','active','querySelectorAll','join','amVNC','define','DUZrD','data','nuqUt','startViewTransition','filtersList','4022868ocNkqp','_updateFilter','images','map','NIzqb','updated','has','length','1NNwDbt','BXprr','name','slice','https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg','charAt','properties','styles'];_0x5345=function(){return _0x49bb3a;};return _0x5345();}