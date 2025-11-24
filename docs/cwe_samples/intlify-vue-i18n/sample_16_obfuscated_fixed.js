/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x28709c=_0x40d9;(function(_0x3be8f1,_0x511888){var _0x2454c6=_0x40d9,_0x32a069=_0x3be8f1();while(!![]){try{var _0xd7d66=parseInt(_0x2454c6(0x1a3))/0x1*(-parseInt(_0x2454c6(0x1ae))/0x2)+parseInt(_0x2454c6(0x1a1))/0x3*(-parseInt(_0x2454c6(0x19f))/0x4)+-parseInt(_0x2454c6(0x1ac))/0x5+-parseInt(_0x2454c6(0x1af))/0x6+parseInt(_0x2454c6(0x1a2))/0x7*(parseInt(_0x2454c6(0x1b1))/0x8)+-parseInt(_0x2454c6(0x1a5))/0x9+parseInt(_0x2454c6(0x1a4))/0xa;if(_0xd7d66===_0x511888)break;else _0x32a069['push'](_0x32a069['shift']());}catch(_0x3015f4){_0x32a069['push'](_0x32a069['shift']());}}}(_0x3d7b,0x2b00b));import{LitElement as _0x3de88f,html as _0x279ac6,css as _0x41ce8d}from'../../../lit/index.js';import{DDDSuper as _0x313e54}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x184340}from'../../i18n-manager/lib/I18NMixin.js';function _0x3d7b(){var _0x25cc5d=['glossy-portfolio-home','48pVZacR','define','title','56948dBjHWo','tag','15hHqByX','168035DhaKVE','67rpgbqq','8791980GYqPGl','2309076BCKXgt','styles','ohKrd','./lib/','properties','href','render','1080280HuzyiY','haxProperties','3394CZgWnm','1137510hxXWjz'];_0x3d7b=function(){return _0x25cc5d;};return _0x3d7b();}export class GlossyPortfolioHome extends _0x313e54(_0x184340(_0x3de88f)){static get[_0x28709c(0x1a0)](){var _0x1a431f=_0x28709c;return _0x1a431f(0x1b0);}constructor(){var _0x1601aa=_0x28709c,_0x576ff7={'ohKrd':'Title'};super(),this[_0x1601aa(0x1b3)]=_0x576ff7[_0x1601aa(0x1a7)];}static get[_0x28709c(0x1a9)](){var _0x28b907=_0x28709c;return{...super[_0x28b907(0x1a9)],'title':{'type':String}};}static get[_0x28709c(0x1a6)](){var _0x79fecd=_0x28709c;return[super[_0x79fecd(0x1a6)],_0x41ce8d`
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



    `];}[_0x28709c(0x1ab)](){return _0x279ac6`
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

`;}static get[_0x28709c(0x1ad)](){var _0x3314c1=_0x28709c;return new URL(_0x3314c1(0x1a8)+this[_0x3314c1(0x1a0)]+'.haxProperties.json',import.meta['url'])[_0x3314c1(0x1aa)];}}function _0x40d9(_0x487e4a,_0x559590){var _0x3d7bec=_0x3d7b();return _0x40d9=function(_0x40d907,_0x25f878){_0x40d907=_0x40d907-0x19f;var _0x1227fb=_0x3d7bec[_0x40d907];return _0x1227fb;},_0x40d9(_0x487e4a,_0x559590);}globalThis['customElements'][_0x28709c(0x1b2)](GlossyPortfolioHome[_0x28709c(0x1a0)],GlossyPortfolioHome);