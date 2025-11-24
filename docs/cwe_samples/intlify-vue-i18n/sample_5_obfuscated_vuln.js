/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x14a5c5=_0x22fb;(function(_0xe9cebe,_0x42820e){var _0x373043=_0x22fb,_0x5af807=_0xe9cebe();while(!![]){try{var _0x54ecf5=-parseInt(_0x373043(0x111))/0x1+-parseInt(_0x373043(0x11b))/0x2+parseInt(_0x373043(0x11e))/0x3+parseInt(_0x373043(0x109))/0x4*(-parseInt(_0x373043(0x11a))/0x5)+-parseInt(_0x373043(0x10a))/0x6+-parseInt(_0x373043(0x10d))/0x7*(parseInt(_0x373043(0x110))/0x8)+-parseInt(_0x373043(0x121))/0x9*(-parseInt(_0x373043(0x10f))/0xa);if(_0x54ecf5===_0x42820e)break;else _0x5af807['push'](_0x5af807['shift']());}catch(_0x287ec1){_0x5af807['push'](_0x5af807['shift']());}}}(_0x4be9,0xa2114));import{html as _0x196889,css as _0x3def75}from'../../lit/index.js';import{HAXCMSLitElementTheme as _0x2dca9f}from'../haxcms-elements/lib/core/HAXCMSLitElementTheme.js';import{store as _0x59359a}from'../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x4ba321,toJS as _0x24b647}from'../../mobx/dist/mobx.esm.js';import{DDDSuper as _0x41578a}from'../d-d-d/d-d-d.js';import{I18NMixin as _0xe17db4}from'../i18n-manager/lib/I18NMixin.js';function _0x4be9(){var _0x320ba4=['WGOJS','define','1977738MfTmSN','glossy-portfolio-theme','properties','809307GQyORJ','url','YpZvM','dispose','Title','531176RxwiGC','6050682RvNIkD','.haxProperties.json','styles','7lPrGUj','disconnectedCallback','450SmvCCA','5401848CqSwml','802682JTDHtd','tag','render','haxProperties','currentView','home','__disposer','./lib/','npybu','10FuzBIH','2580010xbaSNO'];_0x4be9=function(){return _0x320ba4;};return _0x4be9();}import'./lib/glossy-portfolio-card.js';import'./lib/glossy-portfolio-header.js';import'./lib/glossy-portfolio-page.js';function _0x22fb(_0x4134e1,_0x37a43c){var _0x4be9be=_0x4be9();return _0x22fb=function(_0x22fb3b,_0x495d6e){_0x22fb3b=_0x22fb3b-0x109;var _0x359d5a=_0x4be9be[_0x22fb3b];return _0x359d5a;},_0x22fb(_0x4134e1,_0x37a43c);}import'./lib/glossy-portfolio-home.js';import'./lib/glossy-portfolio-grid.js';import'./lib/glossy-portfolio-about.js';export class GlossyPortfolioTheme extends _0x41578a(_0xe17db4(_0x2dca9f)){static get[_0x14a5c5(0x112)](){var _0x3e1ff1=_0x14a5c5,_0x4d75bf={'AFPPJ':_0x3e1ff1(0x11f)};return _0x4d75bf['AFPPJ'];}constructor(){var _0x540556=_0x14a5c5,_0x14b7b4={'npybu':_0x540556(0x116),'YpZvM':_0x540556(0x125)};super(),this['title']='',this[_0x540556(0x115)]=_0x14b7b4[_0x540556(0x119)],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x14b7b4[_0x540556(0x123)]};}static get[_0x14a5c5(0x120)](){var _0x3c1514=_0x14a5c5;return{...super[_0x3c1514(0x120)],'title':{'type':String},'currentView':{'type':String}};}[_0x14a5c5(0x10e)](){var _0x19eb24=_0x14a5c5;if(this[_0x19eb24(0x117)]){for(var _0x3786ac in this[_0x19eb24(0x117)])this[_0x19eb24(0x117)][_0x3786ac][_0x19eb24(0x124)]();}super['disconnectedCallback']();}static get[_0x14a5c5(0x10c)](){var _0x546dae=_0x14a5c5;return[super[_0x546dae(0x10c)],_0x3def75`
      :host{
        --bg-color: #111111;
        --main-font: "Manrope", "Manrope Placeholder", sans-serif;
        --max-width: 1200px;
        --page-padding: 0 25px;
        --mobile-page-padding: 0 15px;
        
    
      }
 
      
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--bg-color);
        font-family: var(--main-font);
        margin: auto;
        box-sizing: border-box;
        overflow: visible;
        min-height: 100vh;
      }
    `];}[_0x14a5c5(0x113)](){var _0x2d9a4d=_0x14a5c5,_0x1b3768={'SJhEd':function(_0x44377e,_0x283d5f){return _0x44377e===_0x283d5f;},'WGOJS':_0x2d9a4d(0x116)};if(_0x1b3768['SJhEd'](_0x1b3768[_0x2d9a4d(0x11c)],this[_0x2d9a4d(0x115)]))return _0x196889`
      <div id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>
      <glossy-portfolio-home></glossy-portfolio-home>
      <!-- <glossy-portfolio-about></glossy-portfolio-about> -->
      <!-- <glossy-portfolio-page></glossy-portfolio-page> -->
      <!-- <glossy-portfolio-grid class="projects"></glossy-portfolio-grid> -->

      `;}static get[_0x14a5c5(0x114)](){var _0x2343c4=_0x14a5c5;return new URL(_0x2343c4(0x118)+this['tag']+_0x2343c4(0x10b),import.meta[_0x2343c4(0x122)])['href'];}}globalThis['customElements'][_0x14a5c5(0x11d)](GlossyPortfolioTheme['tag'],GlossyPortfolioTheme);