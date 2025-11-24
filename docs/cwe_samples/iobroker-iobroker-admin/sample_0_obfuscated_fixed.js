/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x290b7b=_0x123f;(function(_0x53831a,_0x3f9a02){var _0x14650f=_0x123f,_0x3ffeff=_0x53831a();while(!![]){try{var _0x58f928=-parseInt(_0x14650f(0x1f6))/0x1+parseInt(_0x14650f(0x1ec))/0x2*(parseInt(_0x14650f(0x1ea))/0x3)+parseInt(_0x14650f(0x1ef))/0x4*(-parseInt(_0x14650f(0x1f9))/0x5)+-parseInt(_0x14650f(0x1f4))/0x6*(-parseInt(_0x14650f(0x1f0))/0x7)+parseInt(_0x14650f(0x1ed))/0x8+-parseInt(_0x14650f(0x1ee))/0x9+parseInt(_0x14650f(0x1e7))/0xa;if(_0x58f928===_0x3f9a02)break;else _0x3ffeff['push'](_0x3ffeff['shift']());}catch(_0x3d3a15){_0x3ffeff['push'](_0x3ffeff['shift']());}}}(_0x3c4b,0x4195b));import{LitElement as _0xa714e8,html as _0x116f0b,css as _0x5870ce}from'../../../lit/index.js';import{DDDSuper as _0x29a276}from'../../d-d-d/d-d-d.js';function _0x3c4b(){var _0x288e9d=['title','485lwqjUR','Title','properties','5935150SlCltp','styles','haxProperties','533607Iwqaxg','./lib/','4fpPpEW','2065496RitJoS','4356513usEbQH','16756WpMDHO','1863827qHyTkf','glossy-portfolio-home','.haxProperties.json','render','6RFCWLC','tag','314676lrJyLl','href'];_0x3c4b=function(){return _0x288e9d;};return _0x3c4b();}function _0x123f(_0x49735e,_0x9bca17){var _0x3c4b23=_0x3c4b();return _0x123f=function(_0x123f45,_0x3e2358){_0x123f45=_0x123f45-0x1e7;var _0x14a92f=_0x3c4b23[_0x123f45];return _0x14a92f;},_0x123f(_0x49735e,_0x9bca17);}import{I18NMixin as _0x1449cf}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHome extends _0x29a276(_0x1449cf(_0xa714e8)){static get[_0x290b7b(0x1f5)](){var _0x11041d=_0x290b7b;return _0x11041d(0x1f1);}constructor(){var _0x3fd4cb=_0x290b7b;super(),this[_0x3fd4cb(0x1f8)]=_0x3fd4cb(0x1fa),this['t']=this['t']||{},this['t']={...this['t'],'title':'Title'};}static get['properties'](){var _0x4ae5d3=_0x290b7b;return{...super[_0x4ae5d3(0x1fb)],'title':{'type':String}};}static get['styles'](){var _0xe364c1=_0x290b7b;return[super[_0xe364c1(0x1e8)],_0x5870ce`
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



    `];}[_0x290b7b(0x1f3)](){return _0x116f0b`
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

`;}static get[_0x290b7b(0x1e9)](){var _0x1a4f25=_0x290b7b;return new URL(_0x1a4f25(0x1eb)+this[_0x1a4f25(0x1f5)]+_0x1a4f25(0x1f2),import.meta['url'])[_0x1a4f25(0x1f7)];}}globalThis['customElements']['define'](GlossyPortfolioHome[_0x290b7b(0x1f5)],GlossyPortfolioHome);