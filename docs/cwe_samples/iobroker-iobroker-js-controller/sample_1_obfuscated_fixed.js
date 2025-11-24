/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x35d949=_0x13b4;function _0x13b4(_0x5d2649,_0x2e27e6){var _0x2deea0=_0x2dee();return _0x13b4=function(_0x13b4c4,_0x558a35){_0x13b4c4=_0x13b4c4-0x89;var _0x4fe35f=_0x2deea0[_0x13b4c4];return _0x4fe35f;},_0x13b4(_0x5d2649,_0x2e27e6);}(function(_0x226a92,_0x455028){var _0x4c65b4=_0x13b4,_0x2874b6=_0x226a92();while(!![]){try{var _0x2867cf=parseInt(_0x4c65b4(0x95))/0x1+-parseInt(_0x4c65b4(0x90))/0x2+-parseInt(_0x4c65b4(0x91))/0x3+-parseInt(_0x4c65b4(0x8e))/0x4*(-parseInt(_0x4c65b4(0x94))/0x5)+-parseInt(_0x4c65b4(0x9a))/0x6*(-parseInt(_0x4c65b4(0x89))/0x7)+-parseInt(_0x4c65b4(0x9b))/0x8*(parseInt(_0x4c65b4(0x8b))/0x9)+parseInt(_0x4c65b4(0x8d))/0xa;if(_0x2867cf===_0x455028)break;else _0x2874b6['push'](_0x2874b6['shift']());}catch(_0x38ad6e){_0x2874b6['push'](_0x2874b6['shift']());}}}(_0x2dee,0x44e58));import{LitElement as _0x40f563,html as _0x4f7040,css as _0x1871b2}from'../../../lit/index.js';import{DDDSuper as _0x457f76}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x4ef26d}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHome extends _0x457f76(_0x4ef26d(_0x40f563)){static get[_0x35d949(0x99)](){var _0x8e2f14=_0x35d949;return _0x8e2f14(0x8f);}constructor(){super(),this['title']='Title';}static get['properties'](){var _0x13caac=_0x35d949;return{...super[_0x13caac(0x92)],'title':{'type':String}};}static get[_0x35d949(0x93)](){return[super['styles'],_0x1871b2`
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



    `];}[_0x35d949(0x96)](){return _0x4f7040`
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

`;}static get[_0x35d949(0x98)](){var _0x4bed74=_0x35d949;return new URL(_0x4bed74(0x8c)+this[_0x4bed74(0x99)]+_0x4bed74(0x97),import.meta['url'])['href'];}}globalThis[_0x35d949(0x8a)]['define'](GlossyPortfolioHome[_0x35d949(0x99)],GlossyPortfolioHome);function _0x2dee(){var _0x4c579f=['20XCcxur','184776hHrSzY','render','.haxProperties.json','haxProperties','tag','24tQbXLp','2488nVdKpu','276836TClANe','customElements','4707jkjWzh','./lib/','7200220kkyuiN','494124YyTXNy','glossy-portfolio-home','1111728ShApMY','1669191BKHFBe','properties','styles'];_0x2dee=function(){return _0x4c579f;};return _0x2dee();}