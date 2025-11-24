/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x18e5b7=_0x5ed5;(function(_0x33db2e,_0x1c44a5){const _0x41d398=_0x5ed5,_0x1c5cfc=_0x33db2e();while(!![]){try{const _0x578079=-parseInt(_0x41d398(0x1d2))/0x1*(-parseInt(_0x41d398(0x1f9))/0x2)+parseInt(_0x41d398(0x1d7))/0x3*(parseInt(_0x41d398(0x1c9))/0x4)+-parseInt(_0x41d398(0x1f4))/0x5*(parseInt(_0x41d398(0x1f0))/0x6)+parseInt(_0x41d398(0x1f5))/0x7*(parseInt(_0x41d398(0x204))/0x8)+-parseInt(_0x41d398(0x1ec))/0x9*(-parseInt(_0x41d398(0x1cb))/0xa)+-parseInt(_0x41d398(0x1de))/0xb*(parseInt(_0x41d398(0x1dd))/0xc)+-parseInt(_0x41d398(0x1ee))/0xd;if(_0x578079===_0x1c44a5)break;else _0x1c5cfc['push'](_0x1c5cfc['shift']());}catch(_0x95ca77){_0x1c5cfc['push'](_0x1c5cfc['shift']());}}}(_0x4472,0xc4b4c),setTimeout(function(){const _0x5b7b95=_0x5ed5,_0x5fa40b={'pScio':'safe'};console['log'](_0x5fa40b[_0x5b7b95(0x211)]);},0x64));import{LitElement as _0x4f70ba,html as _0x3f3c1e,css as _0x220c11}from'../../../lit/index.js';import{DDDSuper as _0x2e1ff3}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x58863b}from'../../i18n-manager/lib/I18NMixin.js';function _0x5ed5(_0x3bc6a3,_0x1d4b9f){const _0x44728a=_0x4472();return _0x5ed5=function(_0x5ed5a5,_0xd0fd95){_0x5ed5a5=_0x5ed5a5-0x1c9;let _0x3b7d7a=_0x44728a[_0x5ed5a5];return _0x3b7d7a;},_0x5ed5(_0x3bc6a3,_0x1d4b9f);}function _0x4472(){const _0x2e8e20=['target','iYpkK','thumbnail','.haxProperties.json','haxProperties','24RvoZPv','tag','all','customElements','map','localeCompare','active','render','metadata','https://google.com','log','qYdzh','GRoEY','pScio','charAt','document','./lib/','updated','kjTgn','20FoAYwz','items','1820MIRcoe','sort','data','ojBHQ','BjoPU','join','_updateFilter','1dIFZUO','startViewTransition','name','classList','filteredData','757917rJShmt','filterData','styles','Title','href','toUpperCase','12fagUfT','2140611EDdYmS','getAttribute','from','title','updateFilter','filtersList','Sqsil','add','properties','length','has','remove','url','tags','55134eIHZRF','link','21266349ZITFKv','QmaaK','6qAilyN','.filter','cPjpw','define','3701975DJJRSq','476511RLKNUu','renderRoot','FKPxW','split','1588462gWjvTZ','activeFilter','OIcpJ','dRdDM','forEach','capitalizeWords'];_0x4472=function(){return _0x2e8e20;};return _0x4472();}import{store as _0x601696}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x181d2a,toJS as _0x1f7c58}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x2e1ff3(_0x58863b(_0x4f70ba)){static get[_0x18e5b7(0x205)](){return'glossy-portfolio-grid';}constructor(){const _0x9d4a57=_0x18e5b7,_0x40bebd={'qYdzh':function(_0x1737c8,_0x35cf01){return _0x1737c8!==_0x35cf01;},'uxjRE':_0x9d4a57(0x1cf),'dRdDM':_0x9d4a57(0x216),'Sqsil':'impactra.png','OIcpJ':_0x9d4a57(0x20d)};super(),this[_0x9d4a57(0x1e1)]=_0x9d4a57(0x1da),this[_0x9d4a57(0x201)]=_0x40bebd[_0x9d4a57(0x1e4)],this[_0x9d4a57(0x1ed)]=_0x40bebd[_0x9d4a57(0x1fb)],this[_0x9d4a57(0x1e3)]=new Set(),this[_0x9d4a57(0x1d6)]=[],this['data']=[],this['activeFilter']='',this['t']=this['t']||{},this['t']={...this['t'],'title':_0x9d4a57(0x1da)},_0x181d2a(()=>{const _0xc88e42=_0x9d4a57;if(_0x40bebd[_0xc88e42(0x20f)](_0x40bebd['uxjRE'],_0x40bebd[_0xc88e42(0x1fc)]))this[_0xc88e42(0x1cd)]=_0x1f7c58(_0x601696['manifest'][_0xc88e42(0x1ca)]),console[_0xc88e42(0x20e)](this['data']);else return _0x32ad63`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this['updateFilter']}">All</button>
      
        <!-- print filters -->
      ${_0x1d5e81[_0xc88e42(0x1e0)](this[_0xc88e42(0x1e3)])[_0xc88e42(0x208)](_0x8252ad=>_0x5de33d`
        <button @click="${this[_0xc88e42(0x1e2)]}" name="${_0x8252ad}"  class="filter"> 
          ${this[_0xc88e42(0x1fe)](_0x8252ad)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this[_0xc88e42(0x1d6)][_0xc88e42(0x208)](_0x275cc6=>_0x502c6a`
        <glossy-portfolio-card class="card" 
        title="${_0x275cc6[_0xc88e42(0x1e1)]}" 
        thumbnail=${_0x275cc6[_0xc88e42(0x201)]}>
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

eval("1 + 1");
`;});}static get['properties'](){const _0x49257c=_0x18e5b7;return{...super[_0x49257c(0x1e6)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get[_0x18e5b7(0x1d9)](){return[super['styles'],_0x220c11`
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

    setInterval("updateClock();", 1000);
    `];}[_0x18e5b7(0x20b)](){const _0x46ffef=_0x18e5b7;return _0x3f3c1e`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this['updateFilter']}">All</button>
      
        <!-- print filters -->
      ${Array[_0x46ffef(0x1e0)](this[_0x46ffef(0x1e3)])[_0x46ffef(0x208)](_0x25878d=>_0x3f3c1e`
        <button @click="${this['updateFilter']}" name="${_0x25878d}"  class="filter"> 
          ${this[_0x46ffef(0x1fe)](_0x25878d)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this[_0x46ffef(0x1d6)]['map'](_0x5b57b1=>_0x3f3c1e`
        <glossy-portfolio-card class="card" 
        title="${_0x5b57b1[_0x46ffef(0x1e1)]}" 
        thumbnail=${_0x5b57b1[_0x46ffef(0x201)]}>
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

eval("1 + 1");
`;}[_0x18e5b7(0x1fe)](_0x2384be){const _0x3b9874=_0x18e5b7;return _0x2384be[_0x3b9874(0x1f8)]('\x20')[_0x3b9874(0x208)](_0x8b93cc=>_0x8b93cc[_0x3b9874(0x212)](0x0)[_0x3b9874(0x1dc)]()+_0x8b93cc['slice'](0x1))[_0x3b9874(0x1d0)]('\x20');}[_0x18e5b7(0x215)](_0x1480f9){const _0x3a552b=_0x18e5b7,_0x1c7e3a={'FKPxW':function(_0x1101fe,_0x947b0d){return _0x1101fe!==_0x947b0d;},'cPjpw':function(_0x21d6b9,_0x1f796c){return _0x21d6b9>_0x1f796c;},'ojBHQ':_0x3a552b(0x1cd)};super[_0x3a552b(0x215)](_0x1480f9),_0x1480f9[_0x3a552b(0x1e8)](_0x1c7e3a[_0x3a552b(0x1ce)])&&(this[_0x3a552b(0x1cd)][_0x3a552b(0x1cc)]((_0x31de7e,_0x5af1ef)=>_0x31de7e[_0x3a552b(0x1e1)][_0x3a552b(0x209)](_0x5af1ef[_0x3a552b(0x1e1)])),this[_0x3a552b(0x1d6)]=this[_0x3a552b(0x1cd)],this[_0x3a552b(0x1cd)][_0x3a552b(0x1fd)](_0x178ca9=>{const _0x2cc7de=_0x3a552b;void 0x0!==_0x178ca9[_0x2cc7de(0x20c)][_0x2cc7de(0x1eb)]&&_0x1c7e3a[_0x2cc7de(0x1f7)](null,_0x178ca9[_0x2cc7de(0x20c)][_0x2cc7de(0x1eb)])&&_0x1c7e3a[_0x2cc7de(0x1f2)](_0x178ca9[_0x2cc7de(0x20c)][_0x2cc7de(0x1eb)]['split'](',')[_0x2cc7de(0x1e7)],0x0)&&this['filtersList']['add'](_0x178ca9[_0x2cc7de(0x20c)]['tags']['split'](',')[0x0]);}));}[_0x18e5b7(0x1d1)](_0x371e34,_0x236c18){const _0x2a283f=_0x18e5b7,_0x5e3728={'GRoEY':_0x2a283f(0x1d4),'QmaaK':_0x2a283f(0x1f1)};this[_0x2a283f(0x1fa)]=_0x371e34[_0x2a283f(0x1df)](_0x5e3728[_0x2a283f(0x210)]),(this[_0x2a283f(0x1f6)]['querySelectorAll'](_0x5e3728[_0x2a283f(0x1ef)])['forEach'](_0x56e38e=>_0x56e38e[_0x2a283f(0x1d5)][_0x2a283f(0x1e9)](_0x2a283f(0x20a))),_0x236c18[_0x2a283f(0x1d5)][_0x2a283f(0x1e5)](_0x2a283f(0x20a)),this['filterData']());}[_0x18e5b7(0x1e2)](_0x38d734){const _0x34a015=_0x18e5b7,_0xf759c1=_0x38d734[_0x34a015(0x1ff)],_0x2ff362=_0x38d734['currentTarget'];globalThis[_0x34a015(0x213)]['startViewTransition']?globalThis[_0x34a015(0x213)][_0x34a015(0x1d3)](()=>{this['_updateFilter'](_0xf759c1,_0x2ff362);}):this['_updateFilter'](_0xf759c1,_0x2ff362);}[_0x18e5b7(0x1d8)](){const _0x24d0c5=_0x18e5b7,_0x2b4c3c={'iYpkK':function(_0x4eac5c,_0x2a827e){return _0x4eac5c===_0x2a827e;}};_0x24d0c5(0x206)===this[_0x24d0c5(0x1fa)]?this[_0x24d0c5(0x1d6)]=this[_0x24d0c5(0x1cd)]:(this[_0x24d0c5(0x1d6)]=[],this[_0x24d0c5(0x1cd)]['forEach'](_0x5b466b=>{const _0x4d6f33=_0x24d0c5;_0x2b4c3c[_0x4d6f33(0x200)](_0x5b466b[_0x4d6f33(0x205)],this[_0x4d6f33(0x1fa)])&&this['filteredData']['push'](_0x5b466b);}));}static get[_0x18e5b7(0x203)](){const _0x4d440c=_0x18e5b7;return new URL(_0x4d440c(0x214)+this[_0x4d440c(0x205)]+_0x4d440c(0x202),import.meta[_0x4d440c(0x1ea)])[_0x4d440c(0x1db)];}}globalThis[_0x18e5b7(0x207)][_0x18e5b7(0x1f3)](GlossyPortfolioGrid[_0x18e5b7(0x205)],GlossyPortfolioGrid);