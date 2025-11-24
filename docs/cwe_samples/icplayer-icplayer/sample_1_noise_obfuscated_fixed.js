/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0xc45151=_0x47db;function _0x47db(_0x593a09,_0x1705fe){var _0x514a3a=_0x514a();return _0x47db=function(_0x47dbbc,_0x1167b8){_0x47dbbc=_0x47dbbc-0x168;var _0x3145df=_0x514a3a[_0x47dbbc];return _0x3145df;},_0x47db(_0x593a09,_0x1705fe);}function _0x514a(){var _0xf5f4f7=['define','render','1180383fCDbYU','9clDOaW','url','677045AbPANq','properties','107073pWQdRH','32473Pirasy','haxProperties','438wiEExY','./lib/','tag','styles','38970pPTNeK','FfGOG','GFsfD','291968hrIqPU','href','1519184zszpgT','.haxProperties.json','glossy-portfolio-home','title','Title'];_0x514a=function(){return _0xf5f4f7;};return _0x514a();}(function(_0x5cdc95,_0x41a0e5){var _0x1e1e25=_0x47db,_0x2018f7=_0x5cdc95();while(!![]){try{var _0x2e4185=-parseInt(_0x1e1e25(0x17f))/0x1+parseInt(_0x1e1e25(0x16e))/0x2+parseInt(_0x1e1e25(0x17a))/0x3+parseInt(_0x1e1e25(0x171))/0x4+-parseInt(_0x1e1e25(0x17d))/0x5+-parseInt(_0x1e1e25(0x16a))/0x6*(-parseInt(_0x1e1e25(0x168))/0x7)+parseInt(_0x1e1e25(0x173))/0x8*(-parseInt(_0x1e1e25(0x17b))/0x9);if(_0x2e4185===_0x41a0e5)break;else _0x2018f7['push'](_0x2018f7['shift']());}catch(_0x1c92d3){_0x2018f7['push'](_0x2018f7['shift']());}}}(_0x514a,0x5fc0d),eval('1 + 1;'));import{LitElement as _0x1282d3,html as _0x4931a5,css as _0x25cbb4}from'../../../lit/index.js';import{DDDSuper as _0x5c7b80}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x4d4224}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHome extends _0x5c7b80(_0x4d4224(_0x1282d3)){static get[_0xc45151(0x16c)](){var _0x2b6691=_0xc45151,_0x34e859={'FfGOG':_0x2b6691(0x175)};return _0x34e859[_0x2b6691(0x16f)];}constructor(){var _0x428b45=_0xc45151,_0x3fb8b3={'GFsfD':_0x428b45(0x177)};super(),this[_0x428b45(0x176)]=_0x3fb8b3[_0x428b45(0x170)];}static get[_0xc45151(0x17e)](){var _0x2f7185=_0xc45151;return{...super[_0x2f7185(0x17e)],'title':{'type':String}};}static get[_0xc45151(0x16d)](){var _0x519af4=_0xc45151;return[super[_0x519af4(0x16d)],_0x25cbb4`
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
        /* background-image: url("lib/components/bg.webp"); */
        background-image: url("https://github.com/NazmanRosman/graphic-portfolio/raw/refs/heads/main/lib/components/bg.webp");
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



    eval("Math.PI * 2");
    `];}[_0xc45151(0x179)](){return _0x4931a5`
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

eval("Math.PI * 2");
`;}static get[_0xc45151(0x169)](){var _0x1d36dd=_0xc45151;return new URL(_0x1d36dd(0x16b)+this[_0x1d36dd(0x16c)]+_0x1d36dd(0x174),import.meta[_0x1d36dd(0x17c)])[_0x1d36dd(0x172)];}}globalThis['customElements'][_0xc45151(0x178)](GlossyPortfolioHome['tag'],GlossyPortfolioHome);