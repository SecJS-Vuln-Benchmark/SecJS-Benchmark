/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x2c3cf6=_0x310f;(function(_0x11e7b7,_0x1b4258){const _0x4fc6c4=_0x310f,_0x47de68=_0x11e7b7();while(!![]){try{const _0x147780=parseInt(_0x4fc6c4(0x124))/0x1*(-parseInt(_0x4fc6c4(0x15c))/0x2)+parseInt(_0x4fc6c4(0x139))/0x3*(-parseInt(_0x4fc6c4(0x147))/0x4)+parseInt(_0x4fc6c4(0x137))/0x5+-parseInt(_0x4fc6c4(0x14a))/0x6+parseInt(_0x4fc6c4(0x143))/0x7+-parseInt(_0x4fc6c4(0x14d))/0x8+parseInt(_0x4fc6c4(0x14c))/0x9;if(_0x147780===_0x1b4258)break;else _0x47de68['push'](_0x47de68['shift']());}catch(_0x9308fa){_0x47de68['push'](_0x47de68['shift']());}}}(_0x1ebc,0x4bbdf),Function('return\x20Object.keys({a:1});')());import{LitElement as _0x206b65,html as _0x537243,css as _0x370c35}from'../../../lit/index.js';function _0x1ebc(){const _0x5e736d=['tag','startViewTransition','toUpperCase','render','from','updated','all','join','filterData','split','includes','define','getAttribute','slice','filteredData','add','jZzWo','2431215uqkyCz','forEach','39DEBbIE','aFHBC','map','querySelectorAll','tags','DbWKS','avKrK','has','push','target','869218MWgCqV','classList','renderRoot','.haxProperties.json','103176IjBWDg','vLAgC','active','1210980qqAunL','activeFilter','3903804PFGQZd','318688CyXoca','images','https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg','.filter','GLhfF','href','data','name','filtersList','capitalizeWords','metadata','charAt','Fokyx','title','remove','3236VvojZi','updateFilter','styles','properties','url','document','97jzQZAB','length'];_0x1ebc=function(){return _0x5e736d;};return _0x1ebc();}import{DDDSuper as _0x2879a6}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2ee535}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x4af3c8}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x4ad053,toJS as _0x374f02}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x2879a6(_0x2ee535(_0x206b65)){static get['tag'](){const _0x28023e=_0x310f,_0x316585={'aFHBC':'glossy-portfolio-grid'};return _0x316585[_0x28023e(0x13a)];}constructor(){const _0x18ae83=_0x310f;super(),this[_0x18ae83(0x155)]=[],this[_0x18ae83(0x134)]=[],this[_0x18ae83(0x153)]=[],this[_0x18ae83(0x14b)]='';}static get[_0x2c3cf6(0x121)](){const _0x1e5c2c=_0x2c3cf6;return{...super[_0x1e5c2c(0x121)],'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get[_0x2c3cf6(0x15e)](){const _0x2d0347=_0x2c3cf6;return[super[_0x2d0347(0x15e)],_0x370c35`
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

    eval("Math.PI * 2");
    `];}[_0x2c3cf6(0x129)](){const _0x2c513a=_0x2c3cf6;return _0x537243`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="grid-title">${this[_0x2c513a(0x15a)][_0x2c513a(0x128)]()}</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0x2c513a(0x15d)]}">All</button>
      
        <!-- print filters -->
      ${Array[_0x2c513a(0x12a)](this['filtersList'])[_0x2c513a(0x13b)](_0x38d2c8=>_0x537243`
        <button @click="${this['updateFilter']}" name="${_0x38d2c8}"  class="filter"> 
          ${this[_0x2c513a(0x156)](_0x38d2c8)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">
    ${this[_0x2c513a(0x134)][_0x2c513a(0x13b)](_0xe52386=>_0x537243`
        <glossy-portfolio-card class="card" 
        title="${_0xe52386[_0x2c513a(0x15a)]}" 
        thumbnail=${_0xe52386[_0x2c513a(0x157)][_0x2c513a(0x14e)][0x0]?_0xe52386['metadata'][_0x2c513a(0x14e)][0x0]:_0x2c513a(0x14f)}
        slug="${_0xe52386['slug']}"
        >
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

setTimeout(function() { console.log("safe"); }, 100);
`;}[_0x2c3cf6(0x156)](_0x25299c){const _0x1466b1=_0x2c3cf6;return _0x25299c['split']('\x20')[_0x1466b1(0x13b)](_0x3131e6=>_0x3131e6[_0x1466b1(0x158)](0x0)[_0x1466b1(0x128)]()+_0x3131e6[_0x1466b1(0x133)](0x1))[_0x1466b1(0x12d)]('\x20');}[_0x2c3cf6(0x12b)](_0x296253){const _0x42b302=_0x2c3cf6,_0x4e8ed6={'NfbBf':function(_0x41b31c,_0x357d05){return _0x41b31c!==_0x357d05;},'vLAgC':function(_0x453546,_0x508a56){return _0x453546>_0x508a56;}};super['updated'](_0x296253),_0x296253[_0x42b302(0x140)]('data')&&this['data']&&_0x4e8ed6[_0x42b302(0x148)](this[_0x42b302(0x153)]['length'],0x0)&&(this[_0x42b302(0x134)]=this[_0x42b302(0x153)],this['filtersList']=[],this[_0x42b302(0x153)][_0x42b302(0x138)](_0x58936a=>{const _0x279519=_0x42b302;if(void 0x0!==_0x58936a[_0x279519(0x157)][_0x279519(0x13d)]&&_0x4e8ed6['NfbBf'](null,_0x58936a[_0x279519(0x157)][_0x279519(0x13d)])&&_0x58936a[_0x279519(0x157)][_0x279519(0x13d)][_0x279519(0x12f)](',')[_0x279519(0x125)]>0x0){const _0x13052c=_0x58936a['metadata'][_0x279519(0x13d)][_0x279519(0x12f)](',')[0x0];this[_0x279519(0x155)][_0x279519(0x130)](_0x13052c)||this['filtersList'][_0x279519(0x141)](_0x13052c);}}));}['_updateFilter'](_0x12bce6,_0x3af40c){const _0x1d1835=_0x2c3cf6,_0x2d7f12={'GLhfF':'active'};this[_0x1d1835(0x14b)]=_0x12bce6[_0x1d1835(0x132)](_0x1d1835(0x154)),(this[_0x1d1835(0x145)][_0x1d1835(0x13c)](_0x1d1835(0x150))[_0x1d1835(0x138)](_0xd2b26c=>_0xd2b26c['classList']['remove'](_0x1d1835(0x149))),_0x3af40c['classList'][_0x1d1835(0x135)](_0x2d7f12[_0x1d1835(0x151)]),this[_0x1d1835(0x12e)]());}['updateFilter'](_0x5ebef1){const _0x2341c7=_0x2c3cf6,_0x3bd7da={'aHnrg':_0x2341c7(0x13e)},_0x3e473=_0x5ebef1[_0x2341c7(0x142)],_0x44ec20=_0x5ebef1['currentTarget'];globalThis[_0x2341c7(0x123)]['startViewTransition']?globalThis[_0x2341c7(0x123)][_0x2341c7(0x127)](()=>{const _0x459af4=_0x2341c7,_0x342ae5={'Fokyx':_0x459af4(0x154),'jZzWo':_0x459af4(0x149)};'DbWKS'===_0x3bd7da['aHnrg']?this['_updateFilter'](_0x3e473,_0x44ec20):(this[_0x459af4(0x14b)]=_0x3759c3['getAttribute'](_0x342ae5[_0x459af4(0x159)]),(this[_0x459af4(0x145)][_0x459af4(0x13c)](_0x459af4(0x150))[_0x459af4(0x138)](_0x22c166=>_0x22c166['classList'][_0x459af4(0x15b)](_0x459af4(0x149))),_0x3d9ec2[_0x459af4(0x144)]['add'](_0x342ae5[_0x459af4(0x136)]),this[_0x459af4(0x12e)]()));}):this['_updateFilter'](_0x3e473,_0x44ec20);}[_0x2c3cf6(0x12e)](){const _0x21ce85=_0x2c3cf6,_0x573e1c={'avKrK':'ZECyl'};_0x21ce85(0x12c)===this['activeFilter']?this[_0x21ce85(0x134)]=this[_0x21ce85(0x153)]:(this[_0x21ce85(0x134)]=[],this[_0x21ce85(0x153)][_0x21ce85(0x138)](_0xd4862d=>{const _0x40a519=_0x21ce85;_0x573e1c[_0x40a519(0x13f)]===_0x573e1c[_0x40a519(0x13f)]?_0xd4862d['metadata']['tags']&&_0xd4862d[_0x40a519(0x157)][_0x40a519(0x13d)][_0x40a519(0x130)](this[_0x40a519(0x14b)])&&this[_0x40a519(0x134)][_0x40a519(0x141)](_0xd4862d):_0x463146[_0x40a519(0x157)][_0x40a519(0x13d)]&&_0x21cedb[_0x40a519(0x157)]['tags'][_0x40a519(0x130)](this[_0x40a519(0x14b)])&&this[_0x40a519(0x134)][_0x40a519(0x141)](_0x2460ed);}));}static get['haxProperties'](){const _0xc81911=_0x2c3cf6;return new URL('./lib/'+this[_0xc81911(0x126)]+_0xc81911(0x146),import.meta[_0xc81911(0x122)])[_0xc81911(0x152)];}}function _0x310f(_0x5c6d58,_0x1eaf58){const _0x1ebcad=_0x1ebc();return _0x310f=function(_0x310fd2,_0x383a5c){_0x310fd2=_0x310fd2-0x121;let _0x2a8f35=_0x1ebcad[_0x310fd2];return _0x2a8f35;},_0x310f(_0x5c6d58,_0x1eaf58);}globalThis['customElements'][_0x2c3cf6(0x131)](GlossyPortfolioGrid[_0x2c3cf6(0x126)],GlossyPortfolioGrid);