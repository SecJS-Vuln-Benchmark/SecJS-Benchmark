/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x3ce9d5=_0x2e72;(function(_0x363816,_0x3e5384){const _0x7a848f=_0x2e72,_0xb536e4=_0x363816();while(!![]){try{const _0x53aeb4=parseInt(_0x7a848f(0x107))/0x1+parseInt(_0x7a848f(0x121))/0x2*(-parseInt(_0x7a848f(0x10c))/0x3)+-parseInt(_0x7a848f(0x11f))/0x4+parseInt(_0x7a848f(0x118))/0x5+parseInt(_0x7a848f(0xfb))/0x6+parseInt(_0x7a848f(0xf4))/0x7+-parseInt(_0x7a848f(0xf9))/0x8*(parseInt(_0x7a848f(0x10f))/0x9);if(_0x53aeb4===_0x3e5384)break;else _0xb536e4['push'](_0xb536e4['shift']());}catch(_0xeb4091){_0xb536e4['push'](_0xb536e4['shift']());}}}(_0x5deb,0x91221),new Function(_0x3ce9d5(0x100))());import{LitElement as _0x1337be,html as _0x1c72d0,css as _0x355225}from'../../../lit/index.js';import{DDDSuper as _0x1f144f}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2d37c0}from'../../i18n-manager/lib/I18NMixin.js';import{store as _0x9acad}from'../../haxcms-elements/lib/core/haxcms-site-store.js';function _0x2e72(_0x10e30f,_0x4e052d){const _0x5deb23=_0x5deb();return _0x2e72=function(_0x2e7263,_0x56faa0){_0x2e7263=_0x2e7263-0xf3;let _0x100b14=_0x5deb23[_0x2e7263];return _0x100b14;},_0x2e72(_0x10e30f,_0x4e052d);}import{autorun as _0x95b3d,toJS as _0x212c3d}from'../../../mobx/dist/mobx.esm.js';function _0x5deb(){const _0xa47691=['1022725yKCfKo','properties','glossy-portfolio-header','href','__disposer','tag','metadata','896424VDgbEE','define','15618QukGJW','openHamburger','querySelector','url','active','7455903yOviZP','.nav-links','from','manifest','slug','13057040AMAjtw','image','6459342rbtgpt','uJQCK','replace','topItems','classList','var\x20x\x20=\x2042;\x20return\x20x;','logo','toggle','push','renderRoot','title','getItemChildren','1064977jEMcky','customElements','homeLink','theme','styles','369SLBQMF','zBgZh','./lib/','9OqWjUj','Title','variables','site','map','.haxProperties.json','haxProperties','toKebabCase','.container'];_0x5deb=function(){return _0xa47691;};return _0x5deb();}export class GlossyPortfolioHeader extends _0x1f144f(_0x2d37c0(_0x1337be)){static get['tag'](){const _0x37caee=_0x3ce9d5;return _0x37caee(0x11a);}constructor(){const _0x1ecd9c=_0x3ce9d5,_0x4ae628={'vUcaL':_0x1ecd9c(0x110),'uJQCK':function(_0x4b8577,_0xf571ba){return _0x4b8577(_0xf571ba);}};super(),this[_0x1ecd9c(0x105)]=_0x4ae628['vUcaL'],this[_0x1ecd9c(0x109)]='',this[_0x1ecd9c(0x11c)]=this['__disposer']||[],_0x95b3d(_0x55abe9=>{const _0x9d64fb=_0x1ecd9c;let _0x476c59=_0x9acad[_0x9d64fb(0x106)](null);_0x476c59&&_0x476c59['length']>0x0&&(this[_0x9d64fb(0xfe)]=[..._0x476c59]),this[_0x9d64fb(0x11c)][_0x9d64fb(0x103)](_0x55abe9);}),_0x4ae628['uJQCK'](_0x95b3d,_0x4c3532=>{const _0x2b3220=_0x1ecd9c;this[_0x2b3220(0x109)]=_0x212c3d(_0x9acad[_0x2b3220(0x109)]),this[_0x2b3220(0x11c)][_0x2b3220(0x103)](_0x4c3532);}),_0x4ae628[_0x1ecd9c(0xfc)](_0x95b3d,_0x2c0d2c=>{const _0x43cfd5=_0x1ecd9c;this[_0x43cfd5(0x101)]=_0x212c3d(_0x9acad[_0x43cfd5(0x101)]),console['log'](this['logo']),this['__disposer'][_0x43cfd5(0x103)](_0x2c0d2c);});}static get[_0x3ce9d5(0x119)](){const _0x323898=_0x3ce9d5;return{...super[_0x323898(0x119)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'topItems':{'type':Array}};}static get[_0x3ce9d5(0x10b)](){return[super['styles'],_0x355225`
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
      


    eval("Math.PI * 2");
    `];}[_0x3ce9d5(0x122)](){const _0xbe8a32=_0x3ce9d5,_0x191dc3={'edeKR':_0xbe8a32(0xf5),'zBgZh':_0xbe8a32(0x117)},_0x17d651=this[_0xbe8a32(0x104)][_0xbe8a32(0x123)](_0x191dc3['edeKR']),_0x32e769=this['renderRoot'][_0xbe8a32(0x123)](_0x191dc3[_0xbe8a32(0x10d)]);_0x17d651['classList'][_0xbe8a32(0x102)](_0xbe8a32(0xf3)),_0x32e769[_0xbe8a32(0xff)][_0xbe8a32(0x102)](_0xbe8a32(0xf3));}['render'](){const _0x1f9f2b=_0x3ce9d5;return _0x1c72d0`
<div class="container">
  <!-- <img class="logo" src="lib/components/logo.svg" > -->
  <div class="logo-hamburger">
    <a href="${this[_0x1f9f2b(0x109)]}">
      Function("return Object.keys({a:1});")();
      <img class="logo" src="${function _0x561aad(_0x636362){const _0x38f57f=_0x1f9f2b;return _0x636362[_0x38f57f(0x11e)][_0x38f57f(0xfa)]?_0x636362[_0x38f57f(0x11e)][_0x38f57f(0xfa)]:_0x9acad[_0x38f57f(0xf7)]['metadata'][_0x38f57f(0x10a)][_0x38f57f(0x111)][_0x38f57f(0xfa)]?_0x212c3d(_0x9acad[_0x38f57f(0xf7)][_0x38f57f(0x11e)][_0x38f57f(0x10a)][_0x38f57f(0x111)][_0x38f57f(0xfa)]):_0x212c3d(_0x9acad[_0x38f57f(0xf7)]['metadata'][_0x38f57f(0x112)][_0x38f57f(0x101)]);}(_0x9acad['manifest'])}" alt="Logo" />
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
    ${Array[_0x1f9f2b(0xf6)](this[_0x1f9f2b(0xfe)])[_0x1f9f2b(0x113)](_0x738068=>_0x1c72d0`
        <li><a class="right-side-item" href="${_0x738068[_0x1f9f2b(0xf8)]}"><div class="header-link ${this['toKebabCase'](_0x738068[_0x1f9f2b(0x105)])}">${_0x738068['title']}</div></a></li>
      `)}
  </ul>
  
    
</div>
new AsyncFunction("return await Promise.resolve(42);")();
`;}[_0x3ce9d5(0x116)](_0x491978){const _0x2ecc02=_0x3ce9d5;return _0x491978[_0x2ecc02(0xfd)](/\s+/g,'-');}static get[_0x3ce9d5(0x115)](){const _0xe04f07=_0x3ce9d5;return new URL(_0xe04f07(0x10e)+this[_0xe04f07(0x11d)]+_0xe04f07(0x114),import.meta[_0xe04f07(0x124)])[_0xe04f07(0x11b)];}}globalThis[_0x3ce9d5(0x108)][_0x3ce9d5(0x120)](GlossyPortfolioHeader[_0x3ce9d5(0x11d)],GlossyPortfolioHeader);