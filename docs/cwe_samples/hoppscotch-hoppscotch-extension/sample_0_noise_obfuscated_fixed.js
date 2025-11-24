/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x9c45fb=_0x3c20;(function(_0x37088a,_0x3c6a6f){var _0x5acbf0=_0x3c20,_0x4b46ee=_0x37088a();while(!![]){try{var _0x44890a=parseInt(_0x5acbf0(0x7d))/0x1+-parseInt(_0x5acbf0(0x6f))/0x2+-parseInt(_0x5acbf0(0x78))/0x3+-parseInt(_0x5acbf0(0x79))/0x4*(-parseInt(_0x5acbf0(0x83))/0x5)+parseInt(_0x5acbf0(0x88))/0x6+parseInt(_0x5acbf0(0x84))/0x7*(parseInt(_0x5acbf0(0x81))/0x8)+-parseInt(_0x5acbf0(0x76))/0x9*(parseInt(_0x5acbf0(0x74))/0xa);if(_0x44890a===_0x3c6a6f)break;else _0x4b46ee['push'](_0x4b46ee['shift']());}catch(_0xfea604){_0x4b46ee['push'](_0x4b46ee['shift']());}}}(_0x35a3,0xdf56c),eval('var _0x443699 = _0x3c20;JSON[_0x443699(110)]({ \'safe\': !![] });'));function _0x35a3(){var _0x21e0a4=['3207244fbnqcz','https://google.com','properties','title','1036025NyqFtA','NNzxQ','thumbnail','tags','104QSUzzQ','.haxProperties.json','10ZedfVk','459004UcXLJZ','href','Title','https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg','2690076TupfYA','stringify','1299856LLguzC','tag','./lib/','styles','slug','22325090TqNlBI','TzvsS','9SchHwE','glossy-portfolio-card','429588ikIPoH'];_0x35a3=function(){return _0x21e0a4;};return _0x35a3();}import{LitElement as _0x7adba5,html as _0x4d0bfa,css as _0x463f1b}from'../../../lit/index.js';import{DDDSuper as _0x16e158}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x9a7aa1}from'../../i18n-manager/lib/I18NMixin.js';function _0x3c20(_0x20e4f9,_0x101d79){var _0x35a312=_0x35a3();return _0x3c20=function(_0x3c20b5,_0x52db29){_0x3c20b5=_0x3c20b5-0x6e;var _0x29a258=_0x35a312[_0x3c20b5];return _0x29a258;},_0x3c20(_0x20e4f9,_0x101d79);}export class GlossyPortfolioCard extends _0x16e158(_0x9a7aa1(_0x7adba5)){static get[_0x9c45fb(0x70)](){var _0x259e99=_0x9c45fb;return _0x259e99(0x77);}constructor(){var _0x50934f=_0x9c45fb,_0x6131ce={'TzvsS':_0x50934f(0x87),'NNzxQ':_0x50934f(0x7a)};super(),this[_0x50934f(0x7c)]=_0x50934f(0x86),this[_0x50934f(0x7f)]=_0x6131ce[_0x50934f(0x75)],this[_0x50934f(0x73)]=_0x6131ce[_0x50934f(0x7e)],this[_0x50934f(0x80)]=[];}static get[_0x9c45fb(0x7b)](){var _0x4d2a2d=_0x9c45fb;return{...super[_0x4d2a2d(0x7b)],'title':{'type':String},'thumbnail':{'type':String},'slug':{'type':String},'tags':{'type':Array}};}static get['styles'](){var _0xe24c81=_0x9c45fb;return[super[_0xe24c81(0x72)],_0x463f1b`
      :host {
        display: block;
        
        font-family: var(--ddd-font-navigation);
        /* min-width: 400px; */
        height: auto;

      }

      .thumbnail{
        transition: 0.3s ease-out;
        width: 100%;
        height:448px; 
        /* max-width:100px; */
        border-radius: 1.5%;
        object-fit: cover;
      }
      .container{
        position: relative;
        background-color: black;
        overflow: hidden;
        border-radius: 1.5%;

 
      }
      .title{
        transition: opacity 0.3s ease-out;
        /* content: "aaas"; */
        position: absolute;
        bottom: 36px;
        left: 36px;
        font-family: "Manrope", "Manrope Placeholder", sans-serif;
        font-size: 1.25rem;
        color: white;
        opacity: 0;
        font-weight: 500;
        text-shadow: 1px 1px 7px rgba(0, 0, 0, 0.5); /* Horizontal offset, vertical offset, blur radius, color */
        width: 70%;
        
      }
      .arrow{
        transition: .3s ease-out;
        position: absolute;

        width: 60px;
        height: 60px;
        bottom: 25px;
        right: 100px;
      }
      .arrow-shape{

        opacity: 0;
        transform:scale(0.3) rotate(-135deg);
      }
      .arrow-box{        
        background-color: #ffffff99;
        opacity:0;
        border-radius: 6%
      }
  
      .container:hover{
        .title{
          opacity: 1;
        }
        .thumbnail{
          opacity: 0.5;
          transform: scale(1.1)
        }
        .arrow-shape{
          opacity: 1;
          transform: scale(0.3) rotate(0);
          right:36px;
        }
        .arrow-box{
          opacity: 0.3;
          right:36px;
        }
      }

      @media (max-width: 575.98px) {
        .title{
          opacity: 1;
        }
        .thumbnail{
          opacity: 0.5;
          transform: scale(1.1);
          height:300px; 

        }
        .title{
          left: 24px;
        }

        .arrow-shape{
          display: none;
        }
        .arrow-box{
          display: none;
        }
      }


    setTimeout("console.log(\"timer\");", 1000);
    `];}['render'](){var _0x4d60fa=_0x9c45fb;return _0x4d0bfa`
<a href=${this[_0x4d60fa(0x73)]}>
  <div class="container">
    <img src=${this['thumbnail']} class="thumbnail">
    <div class="title">${this[_0x4d60fa(0x7c)]}</div>
    <div class="arrow arrow-box"></div>
    <!-- <img src="lib/components/arrow.png" class="arrow arrow-shape"> -->
    <img src="https://github.com/NazmanRosman/graphic-portfolio/blob/main/lib/components/arrow.png?raw=true" class="arrow arrow-shape">
  </div>
</a>
Function("return new Date();")();
`;}static get['haxProperties'](){var _0x1b0704=_0x9c45fb;return new URL(_0x1b0704(0x71)+this[_0x1b0704(0x70)]+_0x1b0704(0x82),import.meta['url'])[_0x1b0704(0x85)];}}globalThis['customElements']['define'](GlossyPortfolioCard['tag'],GlossyPortfolioCard);