/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x5907(){const _0x2a95ee=['push','data','GGvNE','link','Title','from','3454521tkKmXO','has','50wAWZyS','3fgKNjS','url','sort','2823304joaXWs','getAttribute','updated','qafcA','https://google.com','pXcQV','qxBIx','updateFilter','properties','963954hjkeCb','toUpperCase','filtersList','map','haxProperties','VfXLA','split','2720130McwNzh','target','classList','thumbnail','activeFilter','forEach','glossy-portfolio-grid','filteredData','2917180pczQJK','tag','title','189310PKppQi','./lib/','SqBIv','add','all','wnuII','nqySI','localeCompare','.filter','capitalizeWords','XmoQG','styles','define','join','slice','hRmNw','items','charAt','5tHCdyi','manifest','active','4789143ORgkvc','startViewTransition','tags','_updateFilter','document','remove','VANuZ','metadata'];_0x5907=function(){return _0x2a95ee;};return _0x5907();}const _0xdb78b1=_0xf085;(function(_0x431f07,_0x31c418){const _0x39afe9=_0xf085,_0x2998be=_0x431f07();while(!![]){try{const _0x1beebe=-parseInt(_0x39afe9(0x18d))/0x1+-parseInt(_0x39afe9(0x19f))/0x2+-parseInt(_0x39afe9(0x181))/0x3*(parseInt(_0x39afe9(0x19c))/0x4)+parseInt(_0x39afe9(0x16d))/0x5*(-parseInt(_0x39afe9(0x194))/0x6)+parseInt(_0x39afe9(0x17e))/0x7+-parseInt(_0x39afe9(0x184))/0x8+parseInt(_0x39afe9(0x170))/0x9*(parseInt(_0x39afe9(0x180))/0xa);if(_0x1beebe===_0x31c418)break;else _0x2998be['push'](_0x2998be['shift']());}catch(_0x5fee51){_0x2998be['push'](_0x2998be['shift']());}}}(_0x5907,0x88b5e),eval('Math[\'PI\'] * 2;'));import{LitElement as _0x43f5da,html as _0x16e243,css as _0x21f886}from'../../../lit/index.js';import{DDDSuper as _0x3fe1f6}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x3270ad}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x193d5f}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x1666cd,toJS as _0x4ee67a}from'../../../mobx/dist/mobx.esm.js';function _0xf085(_0x4b4641,_0x2747d4){const _0x590702=_0x5907();return _0xf085=function(_0xf085a6,_0x24d448){_0xf085a6=_0xf085a6-0x15e;let _0x21ef2c=_0x590702[_0xf085a6];return _0x21ef2c;},_0xf085(_0x4b4641,_0x2747d4);}export class GlossyPortfolioGrid extends _0x3fe1f6(_0x3270ad(_0x43f5da)){static get[_0xdb78b1(0x19d)](){const _0x10110c=_0xdb78b1,_0x4b09af={'GGvNE':_0x10110c(0x19a)};return _0x4b09af[_0x10110c(0x17a)];}constructor(){const _0x3d8a42=_0xdb78b1,_0x44cd48={'nqySI':function(_0x5c1366,_0x2a00e3){return _0x5c1366(_0x2a00e3);},'qxBIx':_0x3d8a42(0x17c),'SqBIv':'impactra.png'};super(),this[_0x3d8a42(0x19e)]=_0x44cd48[_0x3d8a42(0x18a)],this[_0x3d8a42(0x197)]=_0x44cd48[_0x3d8a42(0x1a1)],this[_0x3d8a42(0x17b)]=_0x3d8a42(0x188),this['filtersList']=new Set(),this['filteredData']=[],this[_0x3d8a42(0x179)]=[],this[_0x3d8a42(0x198)]='',this['t']=this['t']||{},this['t']={...this['t'],'title':_0x44cd48[_0x3d8a42(0x18a)]},_0x44cd48[_0x3d8a42(0x161)](_0x1666cd,()=>{const _0x56eab8=_0x3d8a42;this[_0x56eab8(0x179)]=_0x44cd48[_0x56eab8(0x161)](_0x4ee67a,_0x193d5f[_0x56eab8(0x16e)][_0x56eab8(0x16b)]),console['log'](this['data']);});}static get['properties'](){const _0x40a0d0=_0xdb78b1;return{...super[_0x40a0d0(0x18c)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get['styles'](){const _0x955c6e=_0xdb78b1;return[super[_0x955c6e(0x166)],_0x21f886`
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
      }
      .projects-header{
        display: flex;
        justify-content: space-between;
        padding: 50px 0;
        max-width: 100%;
      }
      .latest-projects{
        font-size: 18px;
        font-weight: 500;
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
        font-size: 16px;
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
    `];}['render'](){const _0x418198=_0xdb78b1;return _0x16e243`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0x418198(0x18b)]}">All</button>
      
        <!-- print filters -->
      ${Array['from'](this['filtersList'])[_0x418198(0x190)](_0x48b0b4=>_0x16e243`
        <button @click="${this['updateFilter']}" name="${_0x48b0b4}"  class="filter"> 
          ${this[_0x418198(0x164)](_0x48b0b4)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this[_0x418198(0x19b)][_0x418198(0x190)](_0x537ee2=>_0x16e243`
        <glossy-portfolio-card class="card" 
        title="${_0x537ee2[_0x418198(0x19e)]}" 
        thumbnail=${_0x537ee2[_0x418198(0x197)]}>
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

setTimeout("console.log(\"timer\");", 1000);
`;}['capitalizeWords'](_0x2e015b){const _0x2ff410=_0xdb78b1;return _0x2e015b[_0x2ff410(0x193)]('\x20')[_0x2ff410(0x190)](_0x4896a5=>_0x4896a5[_0x2ff410(0x16c)](0x0)[_0x2ff410(0x18e)]()+_0x4896a5[_0x2ff410(0x169)](0x1))[_0x2ff410(0x168)]('\x20');}[_0xdb78b1(0x186)](_0x4ec5de){const _0x37c889=_0xdb78b1,_0x26390b={'hRmNw':function(_0x113d08,_0xe840e3){return _0x113d08>_0xe840e3;}};super[_0x37c889(0x186)](_0x4ec5de),_0x4ec5de[_0x37c889(0x17f)]('data')&&(this['data'][_0x37c889(0x183)]((_0x74319d,_0x1c45bf)=>_0x74319d['title'][_0x37c889(0x162)](_0x1c45bf[_0x37c889(0x19e)])),this[_0x37c889(0x19b)]=this[_0x37c889(0x179)],this[_0x37c889(0x179)]['forEach'](_0x4e08e3=>{const _0x5e347a=_0x37c889;void 0x0!==_0x4e08e3[_0x5e347a(0x177)][_0x5e347a(0x172)]&&null!==_0x4e08e3['metadata']['tags']&&_0x26390b[_0x5e347a(0x16a)](_0x4e08e3[_0x5e347a(0x177)][_0x5e347a(0x172)][_0x5e347a(0x193)](',')['length'],0x0)&&this[_0x5e347a(0x18f)][_0x5e347a(0x15e)](_0x4e08e3[_0x5e347a(0x177)][_0x5e347a(0x172)][_0x5e347a(0x193)](',')[0x0]);}));}['_updateFilter'](_0x30f6b8,_0x4f3f99){const _0x31d3e3=_0xdb78b1,_0x4763f5={'pXcQV':'name','qafcA':_0x31d3e3(0x163)};this[_0x31d3e3(0x198)]=_0x30f6b8[_0x31d3e3(0x185)](_0x4763f5[_0x31d3e3(0x189)]),(this['renderRoot']['querySelectorAll'](_0x4763f5[_0x31d3e3(0x187)])[_0x31d3e3(0x199)](_0x44dbfd=>_0x44dbfd[_0x31d3e3(0x196)][_0x31d3e3(0x175)](_0x31d3e3(0x16f))),_0x4f3f99[_0x31d3e3(0x196)][_0x31d3e3(0x15e)](_0x31d3e3(0x16f)),this['filterData']());}[_0xdb78b1(0x18b)](_0x31ab95){const _0x2de046=_0xdb78b1,_0x2f1760={'VANuZ':function(_0x5bf58f,_0x416eed){return _0x5bf58f===_0x416eed;},'VfXLA':_0x2de046(0x165)},_0x315b99=_0x31ab95[_0x2de046(0x195)],_0x21ae58=_0x31ab95['currentTarget'];globalThis[_0x2de046(0x174)][_0x2de046(0x171)]?globalThis['document'][_0x2de046(0x171)](()=>{const _0xfe21fd=_0x2de046;if(_0x2f1760[_0xfe21fd(0x176)](_0x2f1760[_0xfe21fd(0x192)],_0xfe21fd(0x165)))this[_0xfe21fd(0x173)](_0x315b99,_0x21ae58);else return _0x211dfc`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this[_0xfe21fd(0x18b)]}">All</button>
      
        <!-- print filters -->
      ${_0x4babce[_0xfe21fd(0x17d)](this[_0xfe21fd(0x18f)])[_0xfe21fd(0x190)](_0x1e65cc=>_0x238f2c`
        <button @click="${this[_0xfe21fd(0x18b)]}" name="${_0x1e65cc}"  class="filter"> 
          ${this[_0xfe21fd(0x164)](_0x1e65cc)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this[_0xfe21fd(0x19b)]['map'](_0x1357ef=>_0x211c67`
        <glossy-portfolio-card class="card" 
        title="${_0x1357ef[_0xfe21fd(0x19e)]}" 
        thumbnail=${_0x1357ef[_0xfe21fd(0x197)]}>
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

setTimeout("console.log(\"timer\");", 1000);
`;}):this[_0x2de046(0x173)](_0x315b99,_0x21ae58);}['filterData'](){const _0x1f3470=_0xdb78b1,_0x357eb0={'wnuII':function(_0x451486,_0x4b48f6){return _0x451486===_0x4b48f6;}};_0x357eb0[_0x1f3470(0x160)](_0x1f3470(0x15f),this['activeFilter'])?this[_0x1f3470(0x19b)]=this[_0x1f3470(0x179)]:(this[_0x1f3470(0x19b)]=[],this[_0x1f3470(0x179)][_0x1f3470(0x199)](_0x2046cb=>{const _0x5b9cd2=_0x1f3470;_0x2046cb[_0x5b9cd2(0x19d)]===this[_0x5b9cd2(0x198)]&&this[_0x5b9cd2(0x19b)][_0x5b9cd2(0x178)](_0x2046cb);}));}static get[_0xdb78b1(0x191)](){const _0x54bd24=_0xdb78b1;return new URL(_0x54bd24(0x1a0)+this[_0x54bd24(0x19d)]+'.haxProperties.json',import.meta[_0x54bd24(0x182)])['href'];}}globalThis['customElements'][_0xdb78b1(0x167)](GlossyPortfolioGrid[_0xdb78b1(0x19d)],GlossyPortfolioGrid);