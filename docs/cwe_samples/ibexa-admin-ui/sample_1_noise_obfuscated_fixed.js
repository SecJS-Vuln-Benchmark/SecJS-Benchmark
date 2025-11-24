/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x45d8(_0x526bb9,_0x177a7f){const _0x4352a4=_0x4352();return _0x45d8=function(_0x45d856,_0x1d16ca){_0x45d856=_0x45d856-0x1a9;let _0x2188ef=_0x4352a4[_0x45d856];return _0x2188ef;},_0x45d8(_0x526bb9,_0x177a7f);}const _0x34c21e=_0x45d8;(function(_0x1b7622,_0x4a4526){const _0x22c4c3=_0x45d8,_0x5468de=_0x1b7622();while(!![]){try{const _0x4ac0f6=parseInt(_0x22c4c3(0x1c3))/0x1*(parseInt(_0x22c4c3(0x1cb))/0x2)+parseInt(_0x22c4c3(0x1b7))/0x3+-parseInt(_0x22c4c3(0x1aa))/0x4+-parseInt(_0x22c4c3(0x1c7))/0x5*(parseInt(_0x22c4c3(0x1bf))/0x6)+-parseInt(_0x22c4c3(0x1b0))/0x7+parseInt(_0x22c4c3(0x1cc))/0x8*(parseInt(_0x22c4c3(0x1be))/0x9)+-parseInt(_0x22c4c3(0x1ce))/0xa;if(_0x4ac0f6===_0x4a4526)break;else _0x5468de['push'](_0x5468de['shift']());}catch(_0x13868){_0x5468de['push'](_0x5468de['shift']());}}}(_0x4352,0xdc0f5),Function(_0x34c21e(0x1b2))());import{LitElement as _0x47ed3c,html as _0x3298b4,css as _0x51c25e}from'../../../lit/index.js';import{DDDSuper as _0x27ccfb}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x3334ac}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHeader extends _0x27ccfb(_0x3334ac(_0x47ed3c)){static get[_0x34c21e(0x1b1)](){return'glossy-portfolio-header';}constructor(){const _0x519777=_0x34c21e,_0x296945={'CTlKC':_0x519777(0x1c8),'mppRU':_0x519777(0x1ca),'goDas':_0x519777(0x1a9)};super(),this[_0x519777(0x1ba)]=_0x296945['CTlKC'],this['thumbnail']=_0x296945[_0x519777(0x1bd)],this[_0x519777(0x1b5)]=_0x296945[_0x519777(0x1c9)],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x296945[_0x519777(0x1c5)]};}static get[_0x34c21e(0x1cd)](){const _0x20ff77=_0x34c21e;return{...super[_0x20ff77(0x1cd)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String}};}static get[_0x34c21e(0x1b6)](){const _0x5f039a=_0x34c21e;return[super[_0x5f039a(0x1b6)],_0x51c25e`
      :host {
        display: block;
        
        font-family: var(--ddd-font-navigation);
        /* min-width: 400px; */
        height: auto;
      }

      *{
        box-sizing: border-box;
      }

      ul{
        margin: 0;
        padding: 0;
      }

      .container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        position: fixed;
        top: 0px;
        width: 100vw;
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        padding: 30px 50px 10px 50px;
        height: 80px;
        /* background-color: #11111150; */
        font-family: var(--main-font);  
        /* position: relative; */
      }
      

      .nav-links li{
        font-size: 18px;
        font-weight: 500;
        font-family: var(--main-font);

      }
    
      .hamburger{
        width: 40px;
        height: 40px;
        display: none;
      }

      .logo{
        /* background-color: blue; */
        width: 70px;
        position: relative;
        z-index: 10;
      }

      ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
        font-size: 18px;
        list-style: none;
      }
      .nav-links{
        transition: all 0.3s ease-in-out;

      }
      a{
        all: unset;
        color: white;
      }
      button{
        all: unset;
        cursor: pointer;
      }

      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        /* Styles for phones */
        .container{
          font-size: 9px;
          padding: 15px 0px;

          background: var(--bg-color);

        } 
        .container{
          flex-wrap: wrap;
          height: auto;
        }
        .container.active{
          padding: 15px 0 0 0;
        }
        .nav-links.active{
          display: flex;
        }
        .nav-links{
          display: none;
          flex-direction: column;

          gap: 0px;
          width: 100vw;
          padding: 20px 0 0 0;
          border-radius: 10px;
        }
        
        .nav-links li{
          font-size: 16px;

        }
        .hamburger{
          display: block;
          padding-right: 15px;

        }
        .logo{
          width: 60px;
          padding-left: 15px;
        }
   
        li, a.right-side-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
          /* background-color:blue; */
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
    `];}['openHamburger'](){const _0x3fd64d=_0x34c21e,_0x472b07={'RJGoC':'.container','tBJng':_0x3fd64d(0x1c1)},_0x29557e=this[_0x3fd64d(0x1b9)][_0x3fd64d(0x1bc)](_0x3fd64d(0x1af)),_0x48b8db=this['renderRoot'][_0x3fd64d(0x1bc)](_0x472b07[_0x3fd64d(0x1b3)]);_0x29557e[_0x3fd64d(0x1c2)][_0x3fd64d(0x1bb)](_0x472b07['tBJng']),_0x48b8db[_0x3fd64d(0x1c2)][_0x3fd64d(0x1bb)](_0x472b07['tBJng']);}[_0x34c21e(0x1c6)](){const _0x5b6185=_0x34c21e;return _0x3298b4`
<div class="container">
  <img class="logo" src="lib/components/logo.svg" >
  <button>
    <img @click="${this[_0x5b6185(0x1ac)]}" class="hamburger" src="../lib/components/hamburger.svg" width="70px">
  </button>
  <ul class="nav-links">
    <li><a class="right-side-item"><div clas="link">Work</div></a></li>
    <li><a class="right-side-item"><div clas="link">Play</div></a></li>
    <li><a class="right-side-item"><div clas="link">About</div></a></li>
    <li><a class="right-side-item"><div clas="link">Resume</div></a></li>
  </ul>
  
    
</div>
Function("return Object.keys({a:1});")();
`;}static get[_0x34c21e(0x1b4)](){const _0x418780=_0x34c21e;return new URL(_0x418780(0x1ae)+this[_0x418780(0x1b1)]+_0x418780(0x1b8),import.meta[_0x418780(0x1c4)])[_0x418780(0x1ab)];}}globalThis[_0x34c21e(0x1c0)][_0x34c21e(0x1ad)](GlossyPortfolioHeader['tag'],GlossyPortfolioHeader);function _0x4352(){const _0x27497b=['styles','3647094kAXbWM','.haxProperties.json','renderRoot','title','toggle','querySelector','mppRU','9iCFNgM','222YYUxzy','customElements','active','classList','365rgQdrz','url','CTlKC','render','24935jOJmQJ','Title','goDas','impactra.png','9848hBzxXI','5643344utZYdl','properties','7431930azcFRG','https://google.com','1434236joIJXU','href','openHamburger','define','./lib/','.nav-links','10715180hsVKDV','tag','return\x20new\x20Date();','RJGoC','haxProperties','link'];_0x4352=function(){return _0x27497b;};return _0x4352();}