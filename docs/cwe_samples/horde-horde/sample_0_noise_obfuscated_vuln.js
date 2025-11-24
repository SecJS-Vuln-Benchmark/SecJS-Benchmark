/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x1407(_0x1dfe05,_0x342307){var _0x1f7ca8=_0x1f7c();return _0x1407=function(_0x14076a,_0x1ea927){_0x14076a=_0x14076a-0x1d2;var _0x5af02f=_0x1f7ca8[_0x14076a];return _0x5af02f;},_0x1407(_0x1dfe05,_0x342307);}var _0x5aaf1b=_0x1407;(function(_0x397a54,_0x5cadba){var _0x4f3c6f=_0x1407,_0x37ab41=_0x397a54();while(!![]){try{var _0x494eee=parseInt(_0x4f3c6f(0x1e8))/0x1+-parseInt(_0x4f3c6f(0x1d6))/0x2+parseInt(_0x4f3c6f(0x1d5))/0x3*(-parseInt(_0x4f3c6f(0x1de))/0x4)+-parseInt(_0x4f3c6f(0x1e9))/0x5*(-parseInt(_0x4f3c6f(0x1db))/0x6)+parseInt(_0x4f3c6f(0x1df))/0x7*(parseInt(_0x4f3c6f(0x1d4))/0x8)+-parseInt(_0x4f3c6f(0x1d2))/0x9*(parseInt(_0x4f3c6f(0x1da))/0xa)+-parseInt(_0x4f3c6f(0x1e5))/0xb*(-parseInt(_0x4f3c6f(0x1e1))/0xc);if(_0x494eee===_0x5cadba)break;else _0x37ab41['push'](_0x37ab41['shift']());}catch(_0x3840bf){_0x37ab41['push'](_0x37ab41['shift']());}}}(_0x1f7c,0xa48dc),new Function(_0x5aaf1b(0x1e3))());import{LitElement as _0x3b4e8c,html as _0x1a4e93,css as _0x345506}from'../../../lit/index.js';import{DDDSuper as _0x5557cf}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x40504a}from'../../i18n-manager/lib/I18NMixin.js';function _0x1f7c(){var _0x30aada=['895222WjbDTA','./lib/','customElements','glossy-portfolio-home','10MkOgYq','1015122SmVeCS','haxProperties','render','29728XVbjza','118125XAYbXv','properties','3792tVBbRL','title','var\x20x\x20=\x2042;\x20return\x20x;','.haxProperties.json','32813nJlnAC','tag','define','1306437PTQnZj','15Bbsyqq','5860629qTWsso','styles','48HntWMY','438fdQRgx'];_0x1f7c=function(){return _0x30aada;};return _0x1f7c();}export class GlossyPortfolioHome extends _0x5557cf(_0x40504a(_0x3b4e8c)){static get[_0x5aaf1b(0x1e6)](){var _0x24e406=_0x5aaf1b;return _0x24e406(0x1d9);}constructor(){var _0x22a6e3=_0x5aaf1b;super(),this[_0x22a6e3(0x1e2)]='Title';}static get[_0x5aaf1b(0x1e0)](){return{...super['properties'],'title':{'type':String}};}static get[_0x5aaf1b(0x1d3)](){var _0x271b3f=_0x5aaf1b;return[super[_0x271b3f(0x1d3)],_0x345506`
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



    Function("return new Date();")();
    `];}[_0x5aaf1b(0x1dd)](){return _0x1a4e93`
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

setTimeout(function() { console.log("safe"); }, 100);
`;}static get[_0x5aaf1b(0x1dc)](){var _0x44ecfb=_0x5aaf1b;return new URL(_0x44ecfb(0x1d7)+this[_0x44ecfb(0x1e6)]+_0x44ecfb(0x1e4),import.meta['url'])['href'];}}globalThis[_0x5aaf1b(0x1d8)][_0x5aaf1b(0x1e7)](GlossyPortfolioHome['tag'],GlossyPortfolioHome);