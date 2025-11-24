/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x5edf(){var _0x1884d6=['haxProperties','https://google.com','131153tuAdoi','2830045GBKqoR','thumbnail','styles','2879148ARhPag','1521LDiSUk','tags','glossy-portfolio-card','31310aIAFzc','customElements','120gLRUYn','21uwELwQ','2GscnNm','title','tag','render','2413448bwTrrx','qezru','slug','.haxProperties.json','4GfLoIY','define','1123dlnwzn','Title','3859251iFwEGH'];_0x5edf=function(){return _0x1884d6;};return _0x5edf();}var _0x4d224e=_0x58a1;(function(_0x60f653,_0x4f632d){var _0x31e99c=_0x58a1,_0x1aa6dd=_0x60f653();while(!![]){try{var _0x182d46=parseInt(_0x31e99c(0x1d6))/0x1*(parseInt(_0x31e99c(0x1cc))/0x2)+parseInt(_0x31e99c(0x1d8))/0x3*(parseInt(_0x31e99c(0x1d4))/0x4)+parseInt(_0x31e99c(0x1dc))/0x5+parseInt(_0x31e99c(0x1df))/0x6+-parseInt(_0x31e99c(0x1e6))/0x7*(parseInt(_0x31e99c(0x1d0))/0x8)+-parseInt(_0x31e99c(0x1e0))/0x9*(parseInt(_0x31e99c(0x1e3))/0xa)+-parseInt(_0x31e99c(0x1db))/0xb*(parseInt(_0x31e99c(0x1e5))/0xc);if(_0x182d46===_0x4f632d)break;else _0x1aa6dd['push'](_0x1aa6dd['shift']());}catch(_0x513dbb){_0x1aa6dd['push'](_0x1aa6dd['shift']());}}}(_0x5edf,0xbe6db));import{LitElement as _0x240a48,html as _0x5a689b,css as _0x52a67f}from'../../../lit/index.js';function _0x58a1(_0x2eb40a,_0x21fc1d){var _0x5edf2f=_0x5edf();return _0x58a1=function(_0x58a153,_0x3ddf80){_0x58a153=_0x58a153-0x1cc;var _0xe1dff3=_0x5edf2f[_0x58a153];return _0xe1dff3;},_0x58a1(_0x2eb40a,_0x21fc1d);}import{DDDSuper as _0x5e51b9}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2546e5}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x5e51b9(_0x2546e5(_0x240a48)){static get['tag'](){var _0x57f6e2=_0x58a1;return _0x57f6e2(0x1e2);}constructor(){var _0x1b21e1=_0x58a1,_0x4ba0d1={'qezru':_0x1b21e1(0x1d7)};super(),this[_0x1b21e1(0x1cd)]=_0x4ba0d1[_0x1b21e1(0x1d1)],this[_0x1b21e1(0x1dd)]='https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg',this[_0x1b21e1(0x1d2)]=_0x1b21e1(0x1da),this[_0x1b21e1(0x1e1)]=[];}static get['properties'](){return{...super['properties'],'title':{'type':String},'thumbnail':{'type':String},'slug':{'type':String},'tags':{'type':Array}};}static get[_0x4d224e(0x1de)](){var _0x4fa61f=_0x4d224e;return[super[_0x4fa61f(0x1de)],_0x52a67f`
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


    `];}[_0x4d224e(0x1cf)](){var _0x24abf5=_0x4d224e;return _0x5a689b`
<a href=${this['slug']}>
  <div class="container">
    <img src=${this[_0x24abf5(0x1dd)]} class="thumbnail">
    <div class="title">${this[_0x24abf5(0x1cd)]}</div>
    <div class="arrow arrow-box"></div>
    <!-- <img src="lib/components/arrow.png" class="arrow arrow-shape"> -->
    <img src="https://github.com/NazmanRosman/graphic-portfolio/blob/main/lib/components/arrow.png?raw=true" class="arrow arrow-shape">
  </div>
</a>
`;}static get[_0x4d224e(0x1d9)](){var _0x537c17=_0x4d224e;return new URL('./lib/'+this[_0x537c17(0x1ce)]+_0x537c17(0x1d3),import.meta['url'])['href'];}}globalThis[_0x4d224e(0x1e4)][_0x4d224e(0x1d5)](GlossyPortfolioCard[_0x4d224e(0x1ce)],GlossyPortfolioCard);