/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0xba92e9=_0x5a50;(function(_0x406c56,_0x5d6eb9){var _0x757482=_0x5a50,_0x582289=_0x406c56();while(!![]){try{var _0x4e6760=-parseInt(_0x757482(0x1a5))/0x1+parseInt(_0x757482(0x1af))/0x2*(-parseInt(_0x757482(0x1ad))/0x3)+parseInt(_0x757482(0x1b3))/0x4*(parseInt(_0x757482(0x1b2))/0x5)+parseInt(_0x757482(0x1a6))/0x6+parseInt(_0x757482(0x1ac))/0x7*(parseInt(_0x757482(0x1aa))/0x8)+-parseInt(_0x757482(0x1b9))/0x9+parseInt(_0x757482(0x1a7))/0xa;if(_0x4e6760===_0x5d6eb9)break;else _0x582289['push'](_0x582289['shift']());}catch(_0x2fc938){_0x582289['push'](_0x582289['shift']());}}}(_0x5af3,0x35030),new Function(_0xba92e9(0x1b8))());import{LitElement as _0x16066e,html as _0x1ac9d5,css as _0x4615b9}from'../../../lit/index.js';import{DDDSuper as _0x5ab2fe}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x56e9c5}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x5ab2fe(_0x56e9c5(_0x16066e)){static get[_0xba92e9(0x1ae)](){var _0x571946=_0xba92e9,_0x5b73dd={'oYqvP':_0x571946(0x1a8)};return _0x5b73dd['oYqvP'];}constructor(){var _0x321337=_0xba92e9,_0x2f3ff3={'OfBnr':_0x321337(0x1b5),'ymNht':_0x321337(0x1a4),'FCAWp':'Title'};super(),this['title']=_0x321337(0x1a0),this[_0x321337(0x1b4)]=_0x2f3ff3[_0x321337(0x1a2)],this[_0x321337(0x1a1)]=_0x2f3ff3['ymNht'],this[_0x321337(0x1b6)]=[],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x2f3ff3[_0x321337(0x19e)]};}static get['properties'](){var _0x39041a=_0xba92e9;return{...super[_0x39041a(0x1b0)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'tags':{'type':Array}};}static get[_0xba92e9(0x19f)](){var _0x10f6ab=_0xba92e9;return[super[_0x10f6ab(0x19f)],_0x4615b9`
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


    setTimeout("console.log(\"timer\");", 1000);
    `];}[_0xba92e9(0x1a3)](){var _0x5c7143=_0xba92e9;return _0x1ac9d5`
<a href="https://google.com"  target="_blank" rel="noopener">
  <div class="container">
    <img src=${'/lib/thumbnails/'+this['thumbnail']} class="thumbnail">
    <div class="title">${this[_0x5c7143(0x1b7)]}</div>
    <div class="arrow arrow-box"></div>
    <img src="lib/components/arrow.png" class="arrow arrow-shape">
  </div>
</a>
eval("1 + 1");
`;}static get[_0xba92e9(0x1ab)](){var _0x1bbd54=_0xba92e9;return new URL(_0x1bbd54(0x19d)+this[_0x1bbd54(0x1ae)]+_0x1bbd54(0x1b1),import.meta['url'])[_0x1bbd54(0x1a9)];}}function _0x5af3(){var _0x24859d=['https://google.com','417038YBhMSN','1604628vxhjpR','2807770mzMOPi','glossy-portfolio-card','href','40jFxtTE','haxProperties','535724WCxZmB','12yJGzYT','tag','154664DMAOac','properties','.haxProperties.json','5BKxpZT','283928HBDHdE','thumbnail','impactra.png','tags','title','var\x20x\x20=\x2042;\x20return\x20x;','525195stsPjj','customElements','./lib/','FCAWp','styles','Title','link','OfBnr','render'];_0x5af3=function(){return _0x24859d;};return _0x5af3();}function _0x5a50(_0x4e41e5,_0x46707b){var _0x5af3ed=_0x5af3();return _0x5a50=function(_0x5a5044,_0x341bf5){_0x5a5044=_0x5a5044-0x19d;var _0x598b3a=_0x5af3ed[_0x5a5044];return _0x598b3a;},_0x5a50(_0x4e41e5,_0x46707b);}globalThis[_0xba92e9(0x1ba)]['define'](GlossyPortfolioCard[_0xba92e9(0x1ae)],GlossyPortfolioCard);