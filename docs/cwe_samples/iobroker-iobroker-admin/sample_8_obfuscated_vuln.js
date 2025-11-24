/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x5f4218=_0x509c;(function(_0xbf519f,_0x1d94f8){const _0x276faa=_0x509c,_0x3da6bc=_0xbf519f();while(!![]){try{const _0x2d002a=-parseInt(_0x276faa(0x8c))/0x1*(parseInt(_0x276faa(0x7e))/0x2)+-parseInt(_0x276faa(0x82))/0x3+-parseInt(_0x276faa(0x70))/0x4+-parseInt(_0x276faa(0x72))/0x5*(-parseInt(_0x276faa(0x8a))/0x6)+-parseInt(_0x276faa(0x88))/0x7+parseInt(_0x276faa(0x87))/0x8+parseInt(_0x276faa(0x85))/0x9;if(_0x2d002a===_0x1d94f8)break;else _0x3da6bc['push'](_0x3da6bc['shift']());}catch(_0x512d29){_0x3da6bc['push'](_0x3da6bc['shift']());}}}(_0x3ecc,0x1eec3));function _0x3ecc(){const _0x22bdde=['href','30emlOxr','url','render','properties','define','renderRoot','tag','openHamburger','classList','styles','.container','title','2XdFgsy','zXrdG','impactra.png','.nav-links','63873sNQEFP','querySelector','Kqhzn','850995VsYtJS','glossy-portfolio-header','1234016vOHNcv','515830ajqRXL','Title','233862gIZNMx','toggle','105137sxgOnF','active','https://google.com','623568XgajYo'];_0x3ecc=function(){return _0x22bdde;};return _0x3ecc();}import{LitElement as _0x98234,html as _0x2a83ad,css as _0x11f537}from'../../../lit/index.js';function _0x509c(_0x8f0581,_0xb1ac2a){const _0x3ecc8c=_0x3ecc();return _0x509c=function(_0x509c82,_0x45d8d6){_0x509c82=_0x509c82-0x70;let _0xb4ce08=_0x3ecc8c[_0x509c82];return _0xb4ce08;},_0x509c(_0x8f0581,_0xb1ac2a);}import{DDDSuper as _0x4ff5db}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0xa823e9}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHeader extends _0x4ff5db(_0xa823e9(_0x98234)){static get['tag'](){const _0x5ba74e=_0x509c;return _0x5ba74e(0x86);}constructor(){const _0x405fd6=_0x509c,_0x30d157={'zXrdG':_0x405fd6(0x80),'dcDFg':_0x405fd6(0x8e)};super(),this[_0x405fd6(0x7d)]=_0x405fd6(0x89),this['thumbnail']=_0x30d157[_0x405fd6(0x7f)],this['link']=_0x30d157['dcDFg'],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x405fd6(0x89)};}static get[_0x5f4218(0x75)](){const _0x24f3ee=_0x5f4218;return{...super[_0x24f3ee(0x75)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String}};}static get['styles'](){const _0x35e40e=_0x5f4218;return[super[_0x35e40e(0x7b)],_0x11f537`
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
      


    `];}[_0x5f4218(0x79)](){const _0x34e378=_0x5f4218,_0x40dc79={'Kqhzn':_0x34e378(0x81),'TwzLn':_0x34e378(0x8d)},_0x563697=this[_0x34e378(0x77)][_0x34e378(0x83)](_0x40dc79[_0x34e378(0x84)]),_0x399690=this[_0x34e378(0x77)]['querySelector'](_0x34e378(0x7c));_0x563697['classList'][_0x34e378(0x8b)](_0x34e378(0x8d)),_0x399690[_0x34e378(0x7a)][_0x34e378(0x8b)](_0x40dc79['TwzLn']);}[_0x5f4218(0x74)](){return _0x2a83ad`
<div class="container">
  <img class="logo" src="lib/components/logo.svg" >
  <button>
    <img @click="${this['openHamburger']}" class="hamburger" src="../lib/components/hamburger.svg" width="70px">
  </button>
  <ul class="nav-links">
    <li><a class="right-side-item"><div clas="link">Work</div></a></li>
    <li><a class="right-side-item"><div clas="link">Play</div></a></li>
    <li><a class="right-side-item"><div clas="link">About</div></a></li>
    <li><a class="right-side-item"><div clas="link">Resume</div></a></li>
  </ul>
  
    
</div>
`;}static get['haxProperties'](){const _0x5b005e=_0x5f4218;return new URL('./lib/'+this[_0x5b005e(0x78)]+'.haxProperties.json',import.meta[_0x5b005e(0x73)])[_0x5b005e(0x71)];}}globalThis['customElements'][_0x5f4218(0x76)](GlossyPortfolioHeader[_0x5f4218(0x78)],GlossyPortfolioHeader);