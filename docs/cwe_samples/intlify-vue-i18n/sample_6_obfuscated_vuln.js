/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x520ea3=_0x538a;function _0x538a(_0x5850e8,_0x2e3da1){var _0x305473=_0x3054();return _0x538a=function(_0x538ad8,_0x5e4fb7){_0x538ad8=_0x538ad8-0x127;var _0x495bcc=_0x305473[_0x538ad8];return _0x495bcc;},_0x538a(_0x5850e8,_0x2e3da1);}(function(_0x5a3478,_0x2e5fdb){var _0x5c6f0e=_0x538a,_0x30d8a4=_0x5a3478();while(!![]){try{var _0x2ded51=parseInt(_0x5c6f0e(0x127))/0x1+-parseInt(_0x5c6f0e(0x12e))/0x2*(parseInt(_0x5c6f0e(0x13a))/0x3)+-parseInt(_0x5c6f0e(0x13f))/0x4+parseInt(_0x5c6f0e(0x13d))/0x5*(-parseInt(_0x5c6f0e(0x128))/0x6)+-parseInt(_0x5c6f0e(0x140))/0x7+parseInt(_0x5c6f0e(0x13c))/0x8+parseInt(_0x5c6f0e(0x12a))/0x9*(parseInt(_0x5c6f0e(0x142))/0xa);if(_0x2ded51===_0x2e5fdb)break;else _0x30d8a4['push'](_0x30d8a4['shift']());}catch(_0x409786){_0x30d8a4['push'](_0x30d8a4['shift']());}}}(_0x3054,0x6f19b));import{LitElement as _0x2f8824,html as _0x368b8b,css as _0x207664}from'../../../lit/index.js';function _0x3054(){var _0x4facb9=['5109104xxaOnY','glossy-portfolio-card','6730JGhkfd','define','thumbnail','831925fFBXZD','6IhVATw','render','27405vvIFOF','./lib/','tag','customElements','562cOqGmb','link','impactra.png','title','styles','haxProperties','CpweL','/lib/thumbnails/','Title','href','url','.haxProperties.json','8136caJmEB','tags','6346648ABurCz','4416045RMaAAs','properties','3377284UbtPlG'];_0x3054=function(){return _0x4facb9;};return _0x3054();}import{DDDSuper as _0x4fc07c}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x2c3309}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x4fc07c(_0x2c3309(_0x2f8824)){static get[_0x520ea3(0x12c)](){var _0x969663=_0x520ea3;return _0x969663(0x141);}constructor(){var _0x5f5247=_0x520ea3,_0x5031d0={'CpweL':_0x5f5247(0x136),'roTom':'https://google.com'};super(),this[_0x5f5247(0x131)]=_0x5031d0[_0x5f5247(0x134)],this[_0x5f5247(0x144)]=_0x5f5247(0x130),this[_0x5f5247(0x12f)]=_0x5031d0['roTom'],this[_0x5f5247(0x13b)]=[],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x5031d0['CpweL']};}static get[_0x520ea3(0x13e)](){var _0x11e018=_0x520ea3;return{...super[_0x11e018(0x13e)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'tags':{'type':Array}};}static get[_0x520ea3(0x132)](){var _0x10c9a9=_0x520ea3;return[super[_0x10c9a9(0x132)],_0x207664`
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


    `];}[_0x520ea3(0x129)](){var _0x5ebee2=_0x520ea3;return _0x368b8b`
<a href="https://google.com"  target="_blank" rel="noopener">
  <div class="container">
    <img src=${_0x5ebee2(0x135)+this[_0x5ebee2(0x144)]} class="thumbnail">
    <div class="title">${this[_0x5ebee2(0x131)]}</div>
    <div class="arrow arrow-box"></div>
    <img src="lib/components/arrow.png" class="arrow arrow-shape">
  </div>
</a>
`;}static get[_0x520ea3(0x133)](){var _0x2bf111=_0x520ea3;return new URL(_0x2bf111(0x12b)+this[_0x2bf111(0x12c)]+_0x2bf111(0x139),import.meta[_0x2bf111(0x138)])[_0x2bf111(0x137)];}}globalThis[_0x520ea3(0x12d)][_0x520ea3(0x143)](GlossyPortfolioCard['tag'],GlossyPortfolioCard);