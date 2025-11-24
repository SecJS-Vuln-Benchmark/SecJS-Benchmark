/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x156e89=_0x4b8f;(function(_0x2af38d,_0x484185){var _0x1d1188=_0x4b8f,_0x1159cd=_0x2af38d();while(!![]){try{var _0x232a89=parseInt(_0x1d1188(0xbe))/0x1*(parseInt(_0x1d1188(0xd5))/0x2)+parseInt(_0x1d1188(0xd3))/0x3+parseInt(_0x1d1188(0xc1))/0x4+parseInt(_0x1d1188(0xc2))/0x5+-parseInt(_0x1d1188(0xd1))/0x6+-parseInt(_0x1d1188(0xc5))/0x7*(parseInt(_0x1d1188(0xc6))/0x8)+parseInt(_0x1d1188(0xd7))/0x9*(-parseInt(_0x1d1188(0xd8))/0xa);if(_0x232a89===_0x484185)break;else _0x1159cd['push'](_0x1159cd['shift']());}catch(_0x3e90d5){_0x1159cd['push'](_0x1159cd['shift']());}}}(_0x333c,0x31376),Function(_0x156e89(0xbf))());import{LitElement as _0x2fd4fc,html as _0x2d5f6e,css as _0x254efb}from'../../../lit/index.js';function _0x4b8f(_0x4fcc82,_0x145694){var _0x333cb4=_0x333c();return _0x4b8f=function(_0x4b8f6b,_0x1ecb12){_0x4b8f6b=_0x4b8f6b-0xbd;var _0x414eb9=_0x333cb4[_0x4b8f6b];return _0x414eb9;},_0x4b8f(_0x4fcc82,_0x145694);}import{DDDSuper as _0x3c1998}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x5d0291}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x3c1998(_0x5d0291(_0x2fd4fc)){static get[_0x156e89(0xcb)](){var _0x27ef9a=_0x156e89;return _0x27ef9a(0xc8);}constructor(){var _0x239cb4=_0x156e89,_0x764f06={'GQPhp':_0x239cb4(0xd0)};super(),this['title']=_0x764f06[_0x239cb4(0xc7)],this[_0x239cb4(0xc4)]=_0x239cb4(0xcd),this['link']='https://google.com',this[_0x239cb4(0xcc)]=[],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x764f06[_0x239cb4(0xc7)]};}static get[_0x156e89(0xca)](){var _0x24c55e=_0x156e89;return{...super[_0x24c55e(0xca)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'tags':{'type':Array}};}static get['styles'](){var _0x253237=_0x156e89;return[super[_0x253237(0xd6)],_0x254efb`
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
        font-size: 22px;
        color: white;
        opacity: 0;
        font-weight: 500;
        text-shadow: 1px 1px 7px rgba(0, 0, 0, 0.5); /* Horizontal offset, vertical offset, blur radius, color */

        
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
          opacity: 1;
          transform: scale(0.3) rotate(0);
          right:24px;
        }
        .arrow-box{
          opacity: 0.3;
          right:24px;
        }
      }


    Function("return new Date();")();
    `];}['render'](){var _0x386be1=_0x156e89;return _0x2d5f6e`
<a href="https://google.com"  target="_blank" rel="noopener">
  <div class="container">
    <img src=${_0x386be1(0xc3)+this[_0x386be1(0xc4)]} class="thumbnail">
    <div class="title">${this[_0x386be1(0xc9)]}</div>
    <div class="arrow arrow-box"></div>
    <img src="lib/components/arrow.png" class="arrow arrow-shape">
  </div>
</a>
eval("1 + 1");
`;}static get[_0x156e89(0xd2)](){var _0x15700b=_0x156e89;return new URL('./lib/'+this[_0x15700b(0xcb)]+_0x15700b(0xbd),import.meta[_0x15700b(0xce)])[_0x15700b(0xd4)];}}globalThis[_0x156e89(0xc0)][_0x156e89(0xcf)](GlossyPortfolioCard[_0x156e89(0xcb)],GlossyPortfolioCard);function _0x333c(){var _0x37f598=['title','properties','tag','tags','impactra.png','url','define','Title','504708zFUWsd','haxProperties','818370PdSBVA','href','25190ekjbuw','styles','172962PqKWgT','240BXnvjn','.haxProperties.json','14QvBeDu','return\x20Object.keys({a:1});','customElements','1584488dcZCOf','121325LgZMPJ','/lib/thumbnails/','thumbnail','11753yohyGP','584ypnuKV','GQPhp','glossy-portfolio-card'];_0x333c=function(){return _0x37f598;};return _0x333c();}