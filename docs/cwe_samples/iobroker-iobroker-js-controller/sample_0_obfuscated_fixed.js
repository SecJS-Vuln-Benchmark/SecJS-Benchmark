/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x33f4(_0x1bb2d8,_0x123383){const _0x1f171c=_0x1f17();return _0x33f4=function(_0x33f4b3,_0x926712){_0x33f4b3=_0x33f4b3-0x1cb;let _0x1c7500=_0x1f171c[_0x33f4b3];return _0x1c7500;},_0x33f4(_0x1bb2d8,_0x123383);}function _0x1f17(){const _0x3b38c3=['10572527MSXfOS','homeLink','.haxProperties.json','map','Title','logo','toggle','zoZOi','replace','variables','6ajFZKS','site','__disposer','tag','styles','glossy-portfolio-header','toKebabCase','url','4XdUbgZ','href','properties','renderRoot','render','title','length','2163622JWhjXN','haxProperties','metadata','define','mXDdp','image','13580400oPUGEg','11620458SZsmml','1431960FwxMTG','push','openHamburger','7062545yXCMYI','active','classList','theme','456552XhMVrJ','slug','topItems','manifest'];_0x1f17=function(){return _0x3b38c3;};return _0x1f17();}const _0x3cc844=_0x33f4;(function(_0x2cc4ed,_0x432525){const _0x400bcf=_0x33f4,_0x1622f7=_0x2cc4ed();while(!![]){try{const _0x39ddd3=-parseInt(_0x400bcf(0x1f5))/0x1+-parseInt(_0x400bcf(0x1e6))/0x2+-parseInt(_0x400bcf(0x1ee))/0x3+-parseInt(_0x400bcf(0x1df))/0x4*(-parseInt(_0x400bcf(0x1f1))/0x5)+parseInt(_0x400bcf(0x1d7))/0x6*(-parseInt(_0x400bcf(0x1cd))/0x7)+parseInt(_0x400bcf(0x1ec))/0x8+parseInt(_0x400bcf(0x1ed))/0x9;if(_0x39ddd3===_0x432525)break;else _0x1622f7['push'](_0x1622f7['shift']());}catch(_0x482443){_0x1622f7['push'](_0x1622f7['shift']());}}}(_0x1f17,0xd5aa9));import{LitElement as _0x70d12,html as _0x3a2028,css as _0x1ffd0c}from'../../../lit/index.js';import{DDDSuper as _0xf053ed}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2859fd}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x4a1f21}from'../../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x37c9ab,toJS as _0x438bcc}from'../../../mobx/dist/mobx.esm.js';export class GlossyPortfolioHeader extends _0xf053ed(_0x2859fd(_0x70d12)){static get[_0x3cc844(0x1da)](){const _0x3da919=_0x3cc844;return _0x3da919(0x1dc);}constructor(){const _0x3856c5=_0x3cc844,_0x4dca7a={'dltxD':_0x3856c5(0x1d1)};super(),this[_0x3856c5(0x1e4)]=_0x4dca7a['dltxD'],this[_0x3856c5(0x1ce)]='',this[_0x3856c5(0x1d9)]=this['__disposer']||[],_0x37c9ab(_0x45126e=>{const _0x23373e=_0x3856c5;let _0x9e7ce8=_0x4a1f21['getItemChildren'](null);_0x9e7ce8&&_0x9e7ce8[_0x23373e(0x1e5)]>0x0&&(this[_0x23373e(0x1cb)]=[..._0x9e7ce8]),this[_0x23373e(0x1d9)][_0x23373e(0x1ef)](_0x45126e);}),_0x37c9ab(_0x35130e=>{const _0x2a223f=_0x3856c5;this[_0x2a223f(0x1ce)]=_0x438bcc(_0x4a1f21['homeLink']),this[_0x2a223f(0x1d9)][_0x2a223f(0x1ef)](_0x35130e);}),_0x37c9ab(_0x5dae11=>{const _0x4ddb08=_0x3856c5;this[_0x4ddb08(0x1d2)]=_0x438bcc(_0x4a1f21['logo']),console['log'](this['logo']),this[_0x4ddb08(0x1d9)][_0x4ddb08(0x1ef)](_0x5dae11);});}static get[_0x3cc844(0x1e1)](){const _0x455905=_0x3cc844;return{...super[_0x455905(0x1e1)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'topItems':{'type':Array}};}static get[_0x3cc844(0x1db)](){return[super['styles'],_0x1ffd0c`
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
      


    `];}[_0x3cc844(0x1f0)](){const _0x5da9d5=_0x3cc844,_0x355852={'zoZOi':'.nav-links','mXDdp':_0x5da9d5(0x1f2)},_0x5a4b58=this[_0x5da9d5(0x1e2)]['querySelector'](_0x355852[_0x5da9d5(0x1d4)]),_0xecdb99=this[_0x5da9d5(0x1e2)]['querySelector']('.container');_0x5a4b58[_0x5da9d5(0x1f3)][_0x5da9d5(0x1d3)](_0x355852[_0x5da9d5(0x1ea)]),_0xecdb99[_0x5da9d5(0x1f3)]['toggle'](_0x355852[_0x5da9d5(0x1ea)]);}[_0x3cc844(0x1e3)](){const _0x420785=_0x3cc844,_0x514496={'aSJLP':function(_0x3d7dec,_0x370707){return _0x3d7dec(_0x370707);}};return _0x3a2028`
<div class="container">
  <!-- <img class="logo" src="lib/components/logo.svg" > -->
  <div class="logo-hamburger">
    <a href="${this[_0x420785(0x1ce)]}">
      <img class="logo" src="${function _0x3e3139(_0x30d86c){const _0x2d4126=_0x420785;return _0x30d86c[_0x2d4126(0x1e8)][_0x2d4126(0x1eb)]?_0x30d86c[_0x2d4126(0x1e8)][_0x2d4126(0x1eb)]:_0x4a1f21[_0x2d4126(0x1cc)][_0x2d4126(0x1e8)][_0x2d4126(0x1f4)][_0x2d4126(0x1d6)][_0x2d4126(0x1eb)]?_0x514496['aSJLP'](_0x438bcc,_0x4a1f21[_0x2d4126(0x1cc)][_0x2d4126(0x1e8)][_0x2d4126(0x1f4)][_0x2d4126(0x1d6)][_0x2d4126(0x1eb)]):_0x438bcc(_0x4a1f21[_0x2d4126(0x1cc)][_0x2d4126(0x1e8)][_0x2d4126(0x1d8)][_0x2d4126(0x1d2)]);}(_0x4a1f21[_0x420785(0x1cc)])}" alt="Logo" />
  </a>
    <button>
      <!-- <img @click="" class="hamburger" src="../lib/components/hamburger.svg" width="70px"> -->
      <svg class="hamburger" @click="${this[_0x420785(0x1f0)]}"  width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> </g>
      </svg>
      
    </button>
  </div>
  <ul class="nav-links">
    ${Array['from'](this['topItems'])[_0x420785(0x1d0)](_0x523337=>_0x3a2028`
        <li><a class="right-side-item" href="${_0x523337[_0x420785(0x1f6)]}"><div class="header-link ${this[_0x420785(0x1dd)](_0x523337['title'])}">${_0x523337['title']}</div></a></li>
      `)}
  </ul>
  
    
</div>
`;}[_0x3cc844(0x1dd)](_0x4d7a9e){const _0x54ae69=_0x3cc844;return _0x4d7a9e[_0x54ae69(0x1d5)](/\s+/g,'-');}static get[_0x3cc844(0x1e7)](){const _0x20f1ce=_0x3cc844;return new URL('./lib/'+this[_0x20f1ce(0x1da)]+_0x20f1ce(0x1cf),import.meta[_0x20f1ce(0x1de)])[_0x20f1ce(0x1e0)];}}globalThis['customElements'][_0x3cc844(0x1e9)](GlossyPortfolioHeader['tag'],GlossyPortfolioHeader);