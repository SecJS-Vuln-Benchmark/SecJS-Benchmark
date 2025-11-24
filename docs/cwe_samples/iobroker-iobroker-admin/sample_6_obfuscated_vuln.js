/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x354227=_0x2606;(function(_0x4f8f90,_0x716252){var _0x2fe0fd=_0x2606,_0x2be65c=_0x4f8f90();while(!![]){try{var _0x2f9ab4=-parseInt(_0x2fe0fd(0x154))/0x1+-parseInt(_0x2fe0fd(0x15d))/0x2+parseInt(_0x2fe0fd(0x159))/0x3*(parseInt(_0x2fe0fd(0x149))/0x4)+-parseInt(_0x2fe0fd(0x14f))/0x5*(parseInt(_0x2fe0fd(0x163))/0x6)+parseInt(_0x2fe0fd(0x15f))/0x7*(parseInt(_0x2fe0fd(0x157))/0x8)+parseInt(_0x2fe0fd(0x162))/0x9*(parseInt(_0x2fe0fd(0x14b))/0xa)+parseInt(_0x2fe0fd(0x15c))/0xb;if(_0x2f9ab4===_0x716252)break;else _0x2be65c['push'](_0x2be65c['shift']());}catch(_0x467c51){_0x2be65c['push'](_0x2be65c['shift']());}}}(_0x77be,0x4a2ed));function _0x2606(_0x5e5861,_0x39c2f3){var _0x77be5a=_0x77be();return _0x2606=function(_0x26062e,_0x302ace){_0x26062e=_0x26062e-0x148;var _0x426ef0=_0x77be5a[_0x26062e];return _0x426ef0;},_0x2606(_0x5e5861,_0x39c2f3);}import{LitElement as _0x16457e,html as _0x1bea3a,css as _0x58b768}from'../../../lit/index.js';function _0x77be(){var _0x23d8cd=['Title','.haxProperties.json','50097fbnPEw','styles','thumbnail','94400TbiDTf','glossy-portfolio-card','12uXtuuj','url','properties','3907992fdOOqP','653576mqRXYp','wOTyp','161kHvmuD','./lib/','https://google.com','1118943UPVygW','6GmsNJz','/lib/thumbnails/','233272HUyNul','tags','30cWbSnz','haxProperties','tag','link','2760935PNrUWw','href','impactra.png'];_0x77be=function(){return _0x23d8cd;};return _0x77be();}import{DDDSuper as _0x2ae3d2}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x4b21a6}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioCard extends _0x2ae3d2(_0x4b21a6(_0x16457e)){static get[_0x354227(0x14d)](){var _0x3d87b9=_0x354227,_0x303518={'sClJq':_0x3d87b9(0x158)};return _0x303518['sClJq'];}constructor(){var _0x2144b0=_0x354227,_0x3701a3={'wOTyp':_0x2144b0(0x152)};super(),this['title']=_0x2144b0(0x152),this[_0x2144b0(0x156)]=_0x2144b0(0x151),this[_0x2144b0(0x14e)]=_0x2144b0(0x161),this[_0x2144b0(0x14a)]=[],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x3701a3[_0x2144b0(0x15e)]};}static get[_0x354227(0x15b)](){var _0x3d1a42=_0x354227;return{...super[_0x3d1a42(0x15b)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String},'tags':{'type':Array}};}static get[_0x354227(0x155)](){var _0x23ff83=_0x354227;return[super[_0x23ff83(0x155)],_0x58b768`
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


    `];}['render'](){var _0x5631e5=_0x354227;return _0x1bea3a`
<a href="https://google.com"  target="_blank" rel="noopener">
  <div class="container">
    <img src=${_0x5631e5(0x148)+this[_0x5631e5(0x156)]} class="thumbnail">
    <div class="title">${this['title']}</div>
    <div class="arrow arrow-box"></div>
    <img src="lib/components/arrow.png" class="arrow arrow-shape">
  </div>
</a>
`;}static get[_0x354227(0x14c)](){var _0x1e492a=_0x354227;return new URL(_0x1e492a(0x160)+this[_0x1e492a(0x14d)]+_0x1e492a(0x153),import.meta[_0x1e492a(0x15a)])[_0x1e492a(0x150)];}}globalThis['customElements']['define'](GlossyPortfolioCard[_0x354227(0x14d)],GlossyPortfolioCard);