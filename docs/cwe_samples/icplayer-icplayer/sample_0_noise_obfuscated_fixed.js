/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x4d96(_0x4222d0,_0x3c4f3f){const _0x2f9d88=_0x2f9d();return _0x4d96=function(_0x4d96c1,_0x10dbe9){_0x4d96c1=_0x4d96c1-0x80;let _0x49e440=_0x2f9d88[_0x4d96c1];return _0x49e440;},_0x4d96(_0x4222d0,_0x3c4f3f);}const _0x4e8f2c=_0x4d96;(function(_0x56363d,_0x63579e){const _0x996f63=_0x4d96,_0x47b7b3=_0x56363d();while(!![]){try{const _0x27e42e=parseInt(_0x996f63(0x85))/0x1+parseInt(_0x996f63(0x9e))/0x2*(-parseInt(_0x996f63(0xb1))/0x3)+parseInt(_0x996f63(0x8d))/0x4+-parseInt(_0x996f63(0x92))/0x5+-parseInt(_0x996f63(0x83))/0x6+-parseInt(_0x996f63(0x9c))/0x7+parseInt(_0x996f63(0xad))/0x8;if(_0x27e42e===_0x63579e)break;else _0x47b7b3['push'](_0x47b7b3['shift']());}catch(_0x466251){_0x47b7b3['push'](_0x47b7b3['shift']());}}}(_0x2f9d,0x3c6d2),setTimeout('console.log(\x22timer\x22);',0x3e8));import{LitElement as _0x34b59b,html as _0x452bc4,css as _0x52dea4}from'../../../lit/index.js';import{DDDSuper as _0x151f8e}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x357708}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x44c215}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x2fc276,toJS as _0x2bd33a}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioHeader extends _0x151f8e(_0x357708(_0x34b59b)){static get[_0x4e8f2c(0xa6)](){const _0x4bf0f4=_0x4e8f2c;return _0x4bf0f4(0xa8);}constructor(){const _0x120172=_0x4e8f2c,_0x177c00={'wyMaj':function(_0xcb6f97,_0x5cd641){return _0xcb6f97!==_0x5cd641;},'Bwcup':_0x120172(0xae),'jNIph':'OsMUa','xHlTp':function(_0x3d0091,_0x1e119b){return _0x3d0091(_0x1e119b);},'xBQzr':_0x120172(0xac),'oNYDf':function(_0x4e0b7e,_0x533761){return _0x4e0b7e(_0x533761);}};super(),this[_0x120172(0xa9)]=_0x177c00[_0x120172(0x87)],this[_0x120172(0x9b)]='',this[_0x120172(0x90)]=this[_0x120172(0x90)]||[],_0x177c00[_0x120172(0x86)](_0x2fc276,_0x20344b=>{const _0xeec3b0=_0x120172;let _0x1704a5=_0x44c215['getItemChildren'](null);_0x1704a5&&_0x1704a5['length']>0x0&&(this[_0xeec3b0(0x8c)]=[..._0x1704a5]),this[_0xeec3b0(0x90)][_0xeec3b0(0x8b)](_0x20344b);}),_0x2fc276(_0x375a99=>{const _0x32b773=_0x120172;this[_0x32b773(0x9b)]=_0x2bd33a(_0x44c215['homeLink']),this['__disposer']['push'](_0x375a99);}),_0x2fc276(_0x585d7c=>{const _0x1be83f=_0x120172;if(_0x177c00[_0x1be83f(0x84)](_0x177c00['Bwcup'],_0x177c00[_0x1be83f(0xb0)]))this[_0x1be83f(0xa1)]=_0x177c00[_0x1be83f(0x93)](_0x2bd33a,_0x44c215[_0x1be83f(0xa1)]),console[_0x1be83f(0xaa)](this[_0x1be83f(0xa1)]),this['__disposer']['push'](_0x585d7c);else{let _0x168d8c=_0x1d44f4[_0x1be83f(0x98)](null);_0x168d8c&&_0x168d8c[_0x1be83f(0xa3)]>0x0&&(this['topItems']=[..._0x168d8c]),this[_0x1be83f(0x90)]['push'](_0x5ab276);}});}static get[_0x4e8f2c(0x88)](){const _0x52f4f4=_0x4e8f2c;return{...super[_0x52f4f4(0x88)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'topItems':{'type':Array}};}static get['styles'](){return[super['styles'],_0x52dea4`
      :host {
        display: block;
        
        /* min-width: 400px; */
        height: auto;
        background-color: #1d1d1d;
      }

      *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      ul{
        margin: 0;
        padding: 0;
      }

      .container{
        background: linear-gradient(180deg, rgba(17, 17, 17, 1) 0%, rgba(17, 17, 17, 0) 100%);;

        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        position: fixed;
        top: 0px;
        width: 100vw;
        position: fixed;
        left: 0;
        right: 0;
        padding: 50px 50px 40px 50px;
        /* temporary */
        margin-top: 50px;
        max-height: 80px;
        font-family: var(--main-font);  
        overflow-x: auto;
        overflow-y: hidden;

      }
      

      .nav-links li{
        font-weight: 700;
        font-family: var(--main-font);

      }
    
      .hamburger{
        width: 40px;
        height: 40px;
        display: none;
      }

      .logo{
        max-height: 60px;
        min-height: 60px;
        flex: 0 0 auto;
        position: relative;
        z-index: 10;
      }

      ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
        list-style: none;
      }
      li{
        flex: 0 1 auto;
        text-align: center;
      }
      .nav-links{
        transition: all 0.3s ease-in-out;
      }
      a, div.header-link{
        all: unset;
        color: white;
        text-decoration: none;
        font-weight: 500;
        font-size: 1rem;

      }
      a .active-title, div.header-link .active-title {
        font-weight: 800;
      }
      a:hover, div.header-lik:hover{
        /* all: unset; */
        color: white;
        /* font-weight: 500; */

      }
      button{
        all: unset;
        cursor: pointer;
      }


      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        /* Styles for phones */
        .container{
          /* padding: 15px 0px; */
          padding: 0;
          background: var(--bg-color);
          flex-wrap: wrap;
          align-items: center;
          position: fixed;
          top: 0;
          bottom: 0;
          overflow-y: scroll;
          overflow-x: hidden;
          align-content: start;
          height: 60px;

        }

        .logo-hamburger{
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-height: 60px;
          flex: 0 0 auto;
        }

        /* active after hamburger is clicked */
        .container.active{
          /* padding: 15px 0 0 0; */
          height: auto;
          max-height: 100vh;
          overflow-y: scroll;
        }
        .nav-links.active{
          display: flex;
        }
        .nav-links{
          display: none;
          flex-direction: column;

          gap: 0px;
          width: 100vw;
          padding: 0;
          border-radius: 10px;

        }
        

        .hamburger{
          display: block;
          padding-right: 15px;

        }
        svg.logo{
          /* max-height: 60px; */
          max-height: 60px;
          padding-left: 15px;

        }


        /* nav links */
        li, a.right-side-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
          text-align: center; /* Centers the text horizontally */
          height: 80px;
          
        }

        a.right-side-item:active, a.right-side-item:hover{
          background-color: #1d1d1d;
          text-decoration: none; /* Ensures underline is removed on hover */

        }

        
        
      }

      /* Small devices (landscape phones, large phones) */
      @media (min-width: 576px) and (max-width: 767.98px) {
        /* Styles for small devices */
      }

      /* Medium devices (tablets) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        /* Styles for tablets */
      }
      


    setInterval("updateClock();", 1000);
    `];}['openHamburger'](){const _0x2f08b2=_0x4e8f2c,_0x468391={'hNgEJ':_0x2f08b2(0xa2),'VKzaB':_0x2f08b2(0x89)},_0x26bc88=this[_0x2f08b2(0x82)][_0x2f08b2(0xa4)](_0x2f08b2(0xb3)),_0x5dd117=this[_0x2f08b2(0x82)][_0x2f08b2(0xa4)](_0x468391[_0x2f08b2(0x8f)]);_0x26bc88[_0x2f08b2(0x8a)][_0x2f08b2(0xa7)](_0x468391['VKzaB']),_0x5dd117[_0x2f08b2(0x8a)]['toggle'](_0x2f08b2(0x89));}[_0x4e8f2c(0xa5)](){const _0x1f17a3=_0x4e8f2c,_0x204850={'tdUYi':function(_0x4ebb68,_0x3aefdb){return _0x4ebb68(_0x3aefdb);}};return _0x452bc4`
<div class="container">
  <!-- <img class="logo" src="lib/components/logo.svg" > -->
  <div class="logo-hamburger">
    <a href="${this['homeLink']}">
      eval("1 + 1");
      <img class="logo" src="${function _0xec34ec(_0x33e9fd){const _0x3a78dd=_0x4d96;return _0x33e9fd[_0x3a78dd(0x96)][_0x3a78dd(0x9f)]?_0x33e9fd[_0x3a78dd(0x96)][_0x3a78dd(0x9f)]:_0x44c215[_0x3a78dd(0x8e)][_0x3a78dd(0x96)][_0x3a78dd(0xab)][_0x3a78dd(0x97)][_0x3a78dd(0x9f)]?_0x204850[_0x3a78dd(0x99)](_0x2bd33a,_0x44c215[_0x3a78dd(0x8e)]['metadata'][_0x3a78dd(0xab)]['variables'][_0x3a78dd(0x9f)]):_0x2bd33a(_0x44c215[_0x3a78dd(0x8e)][_0x3a78dd(0x96)][_0x3a78dd(0x95)][_0x3a78dd(0xa1)]);}(_0x44c215[_0x1f17a3(0x8e)])}" alt="Logo" />
  </a>
    <button>
      <!-- <img @click="" class="hamburger" src="../lib/components/hamburger.svg" width="70px"> -->
      <svg class="hamburger" @click="${this['openHamburger']}"  width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> </g>
      </svg>
      
    </button>
  </div>
  <ul class="nav-links">
    ${Array[_0x1f17a3(0x94)](this[_0x1f17a3(0x8c)])[_0x1f17a3(0xa0)](_0x10b3d0=>_0x452bc4`
        <li><a class="right-side-item" href="${_0x10b3d0['slug']}"><div class="header-link ${this['toKebabCase'](_0x10b3d0[_0x1f17a3(0xa9)])}">${_0x10b3d0[_0x1f17a3(0xa9)]}</div></a></li>
      `)}
  </ul>
  
    
</div>
new Function("var x = 42; return x;")();
`;}[_0x4e8f2c(0x81)](_0x2b8560){return _0x2b8560['replace'](/\s+/g,'-');}static get['haxProperties'](){const _0x581421=_0x4e8f2c;return new URL(_0x581421(0x9d)+this['tag']+_0x581421(0xb2),import.meta[_0x581421(0x91)])[_0x581421(0xaf)];}}function _0x2f9d(){const _0x149d73=['hNgEJ','__disposer','url','1924485XSrcnE','xHlTp','from','site','metadata','variables','getItemChildren','tdUYi','customElements','homeLink','1585038UHLiwJ','./lib/','6mJJbAl','image','map','logo','.container','length','querySelector','render','tag','toggle','glossy-portfolio-header','title','log','theme','Title','4640904LlYSPj','sstcX','href','jNIph','223323apFsgi','.haxProperties.json','.nav-links','define','toKebabCase','renderRoot','1477140gAxSqV','wyMaj','488843QTgRGS','oNYDf','xBQzr','properties','active','classList','push','topItems','1037576kBhPOQ','manifest'];_0x2f9d=function(){return _0x149d73;};return _0x2f9d();}globalThis[_0x4e8f2c(0x9a)][_0x4e8f2c(0x80)](GlossyPortfolioHeader['tag'],GlossyPortfolioHeader);