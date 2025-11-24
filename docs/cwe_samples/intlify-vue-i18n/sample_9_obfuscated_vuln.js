/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x9a99d1=_0xa033;(function(_0x570fed,_0x22bdc3){var _0x5ec39e=_0xa033,_0x4abee6=_0x570fed();while(!![]){try{var _0x9191f6=-parseInt(_0x5ec39e(0x104))/0x1+parseInt(_0x5ec39e(0x112))/0x2*(-parseInt(_0x5ec39e(0x110))/0x3)+-parseInt(_0x5ec39e(0x107))/0x4+-parseInt(_0x5ec39e(0x115))/0x5+-parseInt(_0x5ec39e(0x116))/0x6+-parseInt(_0x5ec39e(0x106))/0x7+parseInt(_0x5ec39e(0x10c))/0x8*(parseInt(_0x5ec39e(0x10e))/0x9);if(_0x9191f6===_0x22bdc3)break;else _0x4abee6['push'](_0x4abee6['shift']());}catch(_0xa12b09){_0x4abee6['push'](_0x4abee6['shift']());}}}(_0x4338,0x1b9c4));import{LitElement as _0x2358d2,html as _0x217bab,css as _0x5bcabf}from'../../../lit/index.js';function _0x4338(){var _0x28827c=['6781986gENFkb','FyBfQ','12igIKBA','tag','54986WimPIP','styles','url','304190PeovLV','277860rNTxin','./lib/','render','171748aZKORs','properties','1335131UboRiS','243444EpesYS','.haxProperties.json','haxProperties','Title','href','8iKsLav','glossy-portfolio-home'];_0x4338=function(){return _0x28827c;};return _0x4338();}import{DDDSuper as _0x1f7ec5}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x4d92e6}from'../../i18n-manager/lib/I18NMixin.js';function _0xa033(_0x423def,_0x535cba){var _0x43380e=_0x4338();return _0xa033=function(_0xa033e3,_0x5633d6){_0xa033e3=_0xa033e3-0x104;var _0xacb6c7=_0x43380e[_0xa033e3];return _0xacb6c7;},_0xa033(_0x423def,_0x535cba);}export class GlossyPortfolioHome extends _0x1f7ec5(_0x4d92e6(_0x2358d2)){static get[_0x9a99d1(0x111)](){var _0x25e0a5=_0x9a99d1,_0x35d571={'HnrzL':_0x25e0a5(0x10d)};return _0x35d571['HnrzL'];}constructor(){var _0x3c3e7a=_0x9a99d1,_0xfcb608={'FyBfQ':_0x3c3e7a(0x10a)};super(),this['title']=_0xfcb608[_0x3c3e7a(0x10f)],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x3c3e7a(0x10a)};}static get[_0x9a99d1(0x105)](){var _0xdbdf97=_0x9a99d1;return{...super[_0xdbdf97(0x105)],'title':{'type':String}};}static get[_0x9a99d1(0x113)](){var _0x4ff58f=_0x9a99d1;return[super[_0x4ff58f(0x113)],_0x5bcabf`
      :host {
        display: block;
        
        font-family: var(--ddd-font-navigation);
        /* min-width: 400px; */
        height: auto;
      }

      *{
        box-sizing: border-box;
      }

  
      .wrapper {
        display: flex;
        flex-direction: column;
        
        max-width: var(--max-width); 
        margin: 0 auto ;
        padding: var(--page-padding);
        overflow: visible;

        /* gap: 24px; */
      }

      .background{
        background-image: url("lib/components/bg.webp");
        background-attachment: fixed;
        background-size: cover;
        /* background-color: gray; */
        width: 100%;
        
      }
      .background-opacity{
        background-color:rgba(0, 0, 0, 0.7);
        width: 100%;


      }

      .title{
       
        font-family: "Inter", "Inter Placeholder", sans-serif;
        font-size: 50px;
        font-weight: 600;
        color: white;
        
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
        max-width: 1000px; 
        width: 70%;
        letter-spacing: -0.5px;
        padding-left: 10px;
        text-shadow: 0.1em 0.1em 0.2em rgba(0, 0, 0, 0.5); /* Shadow scales with font size */

      }

      .title em{
        font-weight: 100; 
        font-size: 55px;
        font-family: 'DM Serif Display';
        /* font-style: normal; */
      }

      .title-container{
      height: 100vh;
      position: relative;
      z-index: 1;

     }

     glossy-portfolio-grid{
      position: relative;
      z-index: 2;
     }
     @media (max-width: 575.98px) {
      /* Styles for phones */
      .title{
        font-size: 35px;
        max-width: 1000px; 
        width: 90%;
        letter-spacing: -0.5px;
        /* top: 40%; */
      }
      .title em{
        
        font-size: 40px;
        
      }
      .wrapper{
        padding: var(--mobile-page-padding);
      }
      
     }



    `];}[_0x9a99d1(0x118)](){return _0x217bab`
<div class="background">
  <div class="background-opacity">
    <div class="wrapper">

      <glossy-portfolio-header> </glossy-portfolio-header>
      
      <div class="title-container">
        <div class="title">
        I make things and what not
        </div>  
      </div>  
    
    </div>  
  </div>
</div>
<glossy-portfolio-grid class="projects"></glossy-portfolio-grid>

`;}static get[_0x9a99d1(0x109)](){var _0x25f8cf=_0x9a99d1;return new URL(_0x25f8cf(0x117)+this['tag']+_0x25f8cf(0x108),import.meta[_0x25f8cf(0x114)])[_0x25f8cf(0x10b)];}}globalThis['customElements']['define'](GlossyPortfolioHome['tag'],GlossyPortfolioHome);