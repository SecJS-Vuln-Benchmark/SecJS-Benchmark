/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0xffad(_0x2841eb,_0x53f0cd){const _0x4621f7=_0x4621();return _0xffad=function(_0xffad99,_0x55052a){_0xffad99=_0xffad99-0xa4;let _0xfc1d0c=_0x4621f7[_0xffad99];return _0xfc1d0c;},_0xffad(_0x2841eb,_0x53f0cd);}const _0x5b019e=_0xffad;(function(_0x309c11,_0xd83f25){const _0x15460b=_0xffad,_0x5cc0d6=_0x309c11();while(!![]){try{const _0x1bb9df=-parseInt(_0x15460b(0xad))/0x1+-parseInt(_0x15460b(0xe5))/0x2*(-parseInt(_0x15460b(0xb2))/0x3)+parseInt(_0x15460b(0xd8))/0x4+-parseInt(_0x15460b(0xa4))/0x5*(parseInt(_0x15460b(0xbe))/0x6)+-parseInt(_0x15460b(0xb1))/0x7*(-parseInt(_0x15460b(0xe8))/0x8)+parseInt(_0x15460b(0xd5))/0x9+parseInt(_0x15460b(0xc2))/0xa;if(_0x1bb9df===_0xd83f25)break;else _0x5cc0d6['push'](_0x5cc0d6['shift']());}catch(_0x91006b){_0x5cc0d6['push'](_0x5cc0d6['shift']());}}}(_0x4621,0xf1ac6));import{LitElement as _0x16f895,html as _0x512fd4,css as _0x541a11}from'../../../lit/index.js';import{DDDSuper as _0x42ea85}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x1a67bd}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x30f2f0}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x44d068,toJS as _0x74e870}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioGrid extends _0x42ea85(_0x1a67bd(_0x16f895)){static get[_0x5b019e(0xe2)](){const _0x3f189d=_0x5b019e,_0x4a45e6={'NALvB':_0x3f189d(0xbf)};return _0x4a45e6[_0x3f189d(0xb6)];}constructor(){const _0x52f2ae=_0x5b019e,_0x469618={'iuREX':function(_0x47dcb8,_0x3fef30){return _0x47dcb8!==_0x3fef30;},'mlmwx':_0x52f2ae(0xa8),'yWRCK':function(_0x177ea2,_0x4be598){return _0x177ea2(_0x4be598);},'ekxdi':_0x52f2ae(0xdc),'zmVOR':'impactra.png','SrzJB':_0x52f2ae(0xc5)};super(),this[_0x52f2ae(0xe0)]=_0x469618[_0x52f2ae(0xa5)],this[_0x52f2ae(0xab)]=_0x469618[_0x52f2ae(0xc0)],this[_0x52f2ae(0xaa)]=_0x469618['SrzJB'],this[_0x52f2ae(0xbd)]=new Set(),this[_0x52f2ae(0xae)]=[],this['data']=[],this[_0x52f2ae(0xcc)]='',this['t']=this['t']||{},this['t']={...this['t'],'title':_0x469618[_0x52f2ae(0xa5)]},_0x469618[_0x52f2ae(0xcd)](_0x44d068,()=>{const _0x333232=_0x52f2ae;_0x469618[_0x333232(0xba)](_0x469618[_0x333232(0xd3)],_0x333232(0xa8))?this[_0x333232(0xa9)](_0x344e19,_0x115d9d):(this[_0x333232(0xca)]=_0x469618['yWRCK'](_0x74e870,_0x30f2f0[_0x333232(0xdd)][_0x333232(0xa7)]),console[_0x333232(0xaf)](this['data']));});}static get['properties'](){const _0x3c4af8=_0x5b019e;return{...super[_0x3c4af8(0xd9)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'filteredData':{'type':Array},'data':{'type':Array},'filtersList':{'type':Array}};}static get['styles'](){const _0x19b1a7=_0x5b019e;return[super[_0x19b1a7(0xc3)],_0x541a11`
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

    `];}[_0x5b019e(0xd6)](){const _0x1a1a77=_0x5b019e;return _0x512fd4`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <button class="filter active" name="all" @click="${this['updateFilter']}">All</button>
      
        <!-- print filters -->
      ${Array[_0x1a1a77(0xde)](this[_0x1a1a77(0xbd)])['map'](_0x24b988=>_0x512fd4`
        <button @click="${this[_0x1a1a77(0xc1)]}" name="${_0x24b988}"  class="filter"> 
          ${this['capitalizeWords'](_0x24b988)} 
      </button>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this['filteredData'][_0x1a1a77(0xcb)](_0x1b793a=>_0x512fd4`
        <glossy-portfolio-card class="card" 
        title="${_0x1b793a['title']}" 
        thumbnail=${_0x1b793a[_0x1a1a77(0xab)]}>
      </glossy-portfolio-card>
      `)}
    </div> 
</div> 

`;}[_0x5b019e(0xc9)](_0x1ca06d){const _0x367683=_0x5b019e;return _0x1ca06d[_0x367683(0xb9)]('\x20')[_0x367683(0xcb)](_0x18bf94=>_0x18bf94[_0x367683(0xe4)](0x0)[_0x367683(0xd1)]()+_0x18bf94[_0x367683(0xa6)](0x1))[_0x367683(0xb8)]('\x20');}['updated'](_0x31018b){const _0x10faa7=_0x5b019e,_0x5e5d29={'JaPcv':'data'};super[_0x10faa7(0xb5)](_0x31018b),_0x31018b[_0x10faa7(0xd2)](_0x5e5d29[_0x10faa7(0xb7)])&&(this[_0x10faa7(0xca)][_0x10faa7(0xe9)]((_0xfa9dd1,_0x2571cb)=>_0xfa9dd1['title'][_0x10faa7(0xd0)](_0x2571cb[_0x10faa7(0xe0)])),this[_0x10faa7(0xae)]=this[_0x10faa7(0xca)],this[_0x10faa7(0xca)][_0x10faa7(0xc6)](_0x1bbbfd=>{const _0x5381ef=_0x10faa7;void 0x0!==_0x1bbbfd[_0x5381ef(0xd4)][_0x5381ef(0xdb)]&&null!==_0x1bbbfd['metadata'][_0x5381ef(0xdb)]&&_0x1bbbfd[_0x5381ef(0xd4)][_0x5381ef(0xdb)]['split'](',')[_0x5381ef(0xe7)]>0x0&&this[_0x5381ef(0xbd)][_0x5381ef(0xc8)](_0x1bbbfd[_0x5381ef(0xd4)][_0x5381ef(0xdb)][_0x5381ef(0xb9)](',')[0x0]);}));}['_updateFilter'](_0x4ef707,_0x2325ce){const _0x1aa31f=_0x5b019e,_0x1cd624={'uGRIX':_0x1aa31f(0xd7)};this['activeFilter']=_0x4ef707[_0x1aa31f(0xdf)](_0x1cd624['uGRIX']),(this[_0x1aa31f(0xb4)]['querySelectorAll']('.filter')[_0x1aa31f(0xc6)](_0x1d707d=>_0x1d707d[_0x1aa31f(0xcf)][_0x1aa31f(0xc4)](_0x1aa31f(0xce))),_0x2325ce[_0x1aa31f(0xcf)][_0x1aa31f(0xc8)](_0x1aa31f(0xce)),this[_0x1aa31f(0xe6)]());}[_0x5b019e(0xc1)](_0x23d40b){const _0x57f17c=_0x5b019e,_0x59bda2=_0x23d40b[_0x57f17c(0xda)],_0x224ca3=_0x23d40b[_0x57f17c(0xb3)];globalThis['document']['startViewTransition']?globalThis['document'][_0x57f17c(0xb0)](()=>{const _0x300155=_0x57f17c;this[_0x300155(0xa9)](_0x59bda2,_0x224ca3);}):this[_0x57f17c(0xa9)](_0x59bda2,_0x224ca3);}[_0x5b019e(0xe6)](){const _0x47e2e2=_0x5b019e,_0x3b9857={'OzZFi':_0x47e2e2(0xc7)};_0x3b9857[_0x47e2e2(0xe3)]===this[_0x47e2e2(0xcc)]?this['filteredData']=this['data']:(this[_0x47e2e2(0xae)]=[],this[_0x47e2e2(0xca)]['forEach'](_0x49d1e0=>{const _0x162e1d=_0x47e2e2;_0x49d1e0[_0x162e1d(0xe2)]===this[_0x162e1d(0xcc)]&&this['filteredData']['push'](_0x49d1e0);}));}static get[_0x5b019e(0xbc)](){const _0xc4c295=_0x5b019e;return new URL('./lib/'+this[_0xc4c295(0xe2)]+_0xc4c295(0xe1),import.meta[_0xc4c295(0xbb)])['href'];}}globalThis[_0x5b019e(0xac)]['define'](GlossyPortfolioGrid[_0x5b019e(0xe2)],GlossyPortfolioGrid);function _0x4621(){const _0x208932=['currentTarget','renderRoot','updated','NALvB','JaPcv','join','split','iuREX','url','haxProperties','filtersList','114sBUYjq','glossy-portfolio-grid','zmVOR','updateFilter','7143210BCAeQY','styles','remove','https://google.com','forEach','all','add','capitalizeWords','data','map','activeFilter','yWRCK','active','classList','localeCompare','toUpperCase','has','mlmwx','metadata','5590152kSessS','render','name','2919476PypOUF','properties','target','tags','Title','manifest','from','getAttribute','title','.haxProperties.json','tag','OzZFi','charAt','193472CZiLMJ','filterData','length','8aNqfal','sort','270055hslhew','ekxdi','slice','items','QnKnx','_updateFilter','link','thumbnail','customElements','1262660BepyUI','filteredData','log','startViewTransition','7139811DQEPZo','6WMTTLn'];_0x4621=function(){return _0x208932;};return _0x4621();}