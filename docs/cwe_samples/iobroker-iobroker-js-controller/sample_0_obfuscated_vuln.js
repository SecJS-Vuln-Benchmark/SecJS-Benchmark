/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x3adffe=_0x4b67;(function(_0x1aad1e,_0x23d7cf){var _0x4be027=_0x4b67,_0xd20f63=_0x1aad1e();while(!![]){try{var _0x31fa16=-parseInt(_0x4be027(0x12a))/0x1*(parseInt(_0x4be027(0x133))/0x2)+-parseInt(_0x4be027(0x130))/0x3*(parseInt(_0x4be027(0x132))/0x4)+-parseInt(_0x4be027(0x12b))/0x5*(-parseInt(_0x4be027(0x13b))/0x6)+parseInt(_0x4be027(0x13e))/0x7+-parseInt(_0x4be027(0x13f))/0x8+-parseInt(_0x4be027(0x135))/0x9+parseInt(_0x4be027(0x137))/0xa*(parseInt(_0x4be027(0x134))/0xb);if(_0x31fa16===_0x23d7cf)break;else _0xd20f63['push'](_0xd20f63['shift']());}catch(_0x3f9d74){_0xd20f63['push'](_0xd20f63['shift']());}}}(_0x30ee,0x32ee1));import{LitElement as _0x377d50,html as _0x4db22c,css as _0x2c1378}from'../../../lit/index.js';function _0x30ee(){var _0xd8d514=['Title','url','.haxProperties.json','https://google.com','scpQo','glossy-portfolio-card','haxProperties','./lib/','properties','https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg','24851XolZOX','13730MqYiXi','slug','href','title','styles','222OvZwPo','SRnqE','11544qnbRvs','4qhTJgX','4728702AbDlfU','1528362LWVBFc','tag','10lkEVUK','customElements','thumbnail','render','444TofwrN','define','tags','1749363OOtbQq','1930416uiosnW'];_0x30ee=function(){return _0xd8d514;};return _0x30ee();}function _0x4b67(_0x547b23,_0x140ab9){var _0x30ee7e=_0x30ee();return _0x4b67=function(_0x4b67bd,_0x3e5b72){_0x4b67bd=_0x4b67bd-0x125;var _0x134356=_0x30ee7e[_0x4b67bd];return _0x134356;},_0x4b67(_0x547b23,_0x140ab9);}import{DDDSuper as _0x5dd7fc}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x27d14b}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x5dd7fc(_0x27d14b(_0x377d50)){static get[_0x3adffe(0x136)](){var _0x3f1e06=_0x3adffe,_0x587f07={'SRnqE':_0x3f1e06(0x125)};return _0x587f07[_0x3f1e06(0x131)];}constructor(){var _0x5c912f=_0x3adffe,_0x482394={'scpQo':_0x5c912f(0x140)};super(),this[_0x5c912f(0x12e)]=_0x482394[_0x5c912f(0x144)],this[_0x5c912f(0x139)]=_0x5c912f(0x129),this[_0x5c912f(0x12c)]=_0x5c912f(0x143),this[_0x5c912f(0x13d)]=[];}static get['properties'](){var _0x1317e5=_0x3adffe;return{...super[_0x1317e5(0x128)],'title':{'type':String},'thumbnail':{'type':String},'slug':{'type':String},'tags':{'type':Array}};}static get['styles'](){var _0x59bc40=_0x3adffe;return[super[_0x59bc40(0x12f)],_0x2c1378`
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


    `];}[_0x3adffe(0x13a)](){var _0x3683d9=_0x3adffe;return _0x4db22c`
<a href=${this[_0x3683d9(0x12c)]}>
  <div class="container">
    <img src=${this['thumbnail']} class="thumbnail">
    <div class="title">${this[_0x3683d9(0x12e)]}</div>
    <div class="arrow arrow-box"></div>
    <!-- <img src="lib/components/arrow.png" class="arrow arrow-shape"> -->
    <img src="https://github.com/NazmanRosman/graphic-portfolio/blob/main/lib/components/arrow.png?raw=true" class="arrow arrow-shape">
  </div>
</a>
`;}static get[_0x3adffe(0x126)](){var _0x370ddc=_0x3adffe;return new URL(_0x370ddc(0x127)+this[_0x370ddc(0x136)]+_0x370ddc(0x142),import.meta[_0x370ddc(0x141)])[_0x370ddc(0x12d)];}}globalThis[_0x3adffe(0x138)][_0x3adffe(0x13c)](GlossyPortfolioCard['tag'],GlossyPortfolioCard);