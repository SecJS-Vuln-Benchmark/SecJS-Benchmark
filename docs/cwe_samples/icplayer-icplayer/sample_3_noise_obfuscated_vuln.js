/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
function _0x1f01(){var _0x1bafbf=['lxQQy','.haxProperties.json','6251819ueJAjq','tag','4602705tMtxmX','./lib/','2405574MPVkbq','tags','title','Title','753757QyShNQ','render','16riDEmB','6987325OAEEds','https://google.com','styles','glossy-portfolio-card','PCEfc','74472336PuRWTK','2944984cnveyT','4fdgVjG','properties','slug','customElements'];_0x1f01=function(){return _0x1bafbf;};return _0x1f01();}var _0x16445c=_0xc378;(function(_0x1c9eb7,_0x2630f1){var _0x3019bb=_0xc378,_0xbd6af3=_0x1c9eb7();while(!![]){try{var _0x526a1e=-parseInt(_0x3019bb(0xa9))/0x1+-parseInt(_0x3019bb(0xb2))/0x2+-parseInt(_0x3019bb(0xa3))/0x3*(parseInt(_0x3019bb(0xb3))/0x4)+-parseInt(_0x3019bb(0xac))/0x5+-parseInt(_0x3019bb(0xa5))/0x6+parseInt(_0x3019bb(0xa1))/0x7*(-parseInt(_0x3019bb(0xab))/0x8)+parseInt(_0x3019bb(0xb1))/0x9;if(_0x526a1e===_0x2630f1)break;else _0xbd6af3['push'](_0xbd6af3['shift']());}catch(_0x5e310d){_0xbd6af3['push'](_0xbd6af3['shift']());}}}(_0x1f01,0xe2f38),eval('1 + 1;'));function _0xc378(_0x29076e,_0x246585){var _0x1f01d3=_0x1f01();return _0xc378=function(_0xc378c2,_0x387a6b){_0xc378c2=_0xc378c2-0x9e;var _0x2e5dd4=_0x1f01d3[_0xc378c2];return _0x2e5dd4;},_0xc378(_0x29076e,_0x246585);}import{LitElement as _0x387964,html as _0x977c55,css as _0x4296e3}from'../../../lit/index.js';import{DDDSuper as _0x496b01}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2d9854}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x496b01(_0x2d9854(_0x387964)){static get[_0x16445c(0xa2)](){var _0x1914cd=_0x16445c,_0x448bdc={'lxQQy':_0x1914cd(0xaf)};return _0x448bdc[_0x1914cd(0x9f)];}constructor(){var _0x59c03c=_0x16445c,_0x4f9d08={'PCEfc':_0x59c03c(0xad)};super(),this[_0x59c03c(0xa7)]=_0x59c03c(0xa8),this['thumbnail']='https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg',this[_0x59c03c(0xb5)]=_0x4f9d08[_0x59c03c(0xb0)],this[_0x59c03c(0xa6)]=[];}static get[_0x16445c(0xb4)](){return{...super['properties'],'title':{'type':String},'thumbnail':{'type':String},'slug':{'type':String},'tags':{'type':Array}};}static get[_0x16445c(0xae)](){var _0xef8608=_0x16445c;return[super[_0xef8608(0xae)],_0x4296e3`
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


    eval("Math.PI * 2");
    `];}[_0x16445c(0xaa)](){var _0x36062d=_0x16445c;return _0x977c55`
<a href=${this[_0x36062d(0xb5)]}>
  <div class="container">
    <img src=${this['thumbnail']} class="thumbnail">
    <div class="title">${this[_0x36062d(0xa7)]}</div>
    <div class="arrow arrow-box"></div>
    <!-- <img src="lib/components/arrow.png" class="arrow arrow-shape"> -->
    <img src="https://github.com/NazmanRosman/graphic-portfolio/blob/main/lib/components/arrow.png?raw=true" class="arrow arrow-shape">
  </div>
</a>
setInterval("updateClock();", 1000);
`;}static get['haxProperties'](){var _0x576e47=_0x16445c;return new URL(_0x576e47(0xa4)+this[_0x576e47(0xa2)]+_0x576e47(0xa0),import.meta['url'])['href'];}}globalThis[_0x16445c(0x9e)]['define'](GlossyPortfolioCard['tag'],GlossyPortfolioCard);