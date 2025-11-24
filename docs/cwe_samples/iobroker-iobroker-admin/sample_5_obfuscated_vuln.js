/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
var _0x5ba0a8=_0x56c6;(function(_0x141bab,_0x853f46){var _0x3d48a6=_0x56c6,_0x5bd7e0=_0x141bab();while(!![]){try{var _0x37c643=-parseInt(_0x3d48a6(0xec))/0x1+-parseInt(_0x3d48a6(0xfc))/0x2*(parseInt(_0x3d48a6(0xf7))/0x3)+-parseInt(_0x3d48a6(0xf1))/0x4+-parseInt(_0x3d48a6(0xfa))/0x5*(-parseInt(_0x3d48a6(0xf6))/0x6)+-parseInt(_0x3d48a6(0xef))/0x7+-parseInt(_0x3d48a6(0x102))/0x8+parseInt(_0x3d48a6(0xed))/0x9;if(_0x37c643===_0x853f46)break;else _0x5bd7e0['push'](_0x5bd7e0['shift']());}catch(_0x186058){_0x5bd7e0['push'](_0x5bd7e0['shift']());}}}(_0x43b7,0xb5a27));import{html as _0x37cf68,css as _0x22be4a}from'../../lit/index.js';function _0x43b7(){var _0x42dbe0=['4600552kgnCHr','./lib/','properties','__disposer','DxfXI','24ZhIoon','3bfgEaU','tag','render','252115DissvX','.haxProperties.json','1257760QzEQDG','vSxiP','disconnectedCallback','dispose','szLrI','currentView','7824576JjhFPD','href','styles','home','title','296864qdwjpD','44122491DaxPfu','haxProperties','9143834NeMzSs','define'];_0x43b7=function(){return _0x42dbe0;};return _0x43b7();}import{HAXCMSLitElementTheme as _0x526998}from'../haxcms-elements/lib/core/HAXCMSLitElementTheme.js';function _0x56c6(_0x36a5b1,_0xc907e3){var _0x43b75d=_0x43b7();return _0x56c6=function(_0x56c62a,_0x132717){_0x56c62a=_0x56c62a-0xec;var _0x3884e2=_0x43b75d[_0x56c62a];return _0x3884e2;},_0x56c6(_0x36a5b1,_0xc907e3);}import{store as _0x5ed49d}from'../haxcms-elements/lib/core/haxcms-site-store.js';import{autorun as _0x46c8f8,toJS as _0x7a1599}from'../../mobx/dist/mobx.esm.js';import{DDDSuper as _0xf42b4b}from'../d-d-d/d-d-d.js';import{I18NMixin as _0x75b974}from'../i18n-manager/lib/I18NMixin.js';import'./lib/glossy-portfolio-card.js';import'./lib/glossy-portfolio-header.js';import'./lib/glossy-portfolio-page.js';import'./lib/glossy-portfolio-home.js';import'./lib/glossy-portfolio-grid.js';import'./lib/glossy-portfolio-about.js';export class GlossyPortfolioTheme extends _0xf42b4b(_0x75b974(_0x526998)){static get[_0x5ba0a8(0xf8)](){return'glossy-portfolio-theme';}constructor(){var _0x25b456=_0x5ba0a8,_0x65704c={'vSxiP':'home','DxfXI':'Title'};super(),this[_0x25b456(0x106)]='',this[_0x25b456(0x101)]=_0x65704c[_0x25b456(0xfd)],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x65704c[_0x25b456(0xf5)]};}static get[_0x5ba0a8(0xf3)](){var _0x1eafa5=_0x5ba0a8;return{...super[_0x1eafa5(0xf3)],'title':{'type':String},'currentView':{'type':String}};}['disconnectedCallback'](){var _0x46141a=_0x5ba0a8;if(this[_0x46141a(0xf4)]){for(var _0x424ea2 in this[_0x46141a(0xf4)])this[_0x46141a(0xf4)][_0x424ea2][_0x46141a(0xff)]();}super[_0x46141a(0xfe)]();}static get[_0x5ba0a8(0x104)](){var _0x49a262=_0x5ba0a8;return[super[_0x49a262(0x104)],_0x22be4a`
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
    `];}[_0x5ba0a8(0xf9)](){var _0x2864b6=_0x5ba0a8,_0x3f9ba5={'zcQxF':function(_0x405a9e,_0x5bb8bf){return _0x405a9e===_0x5bb8bf;},'szLrI':_0x2864b6(0x105)};if(_0x3f9ba5['zcQxF'](_0x3f9ba5[_0x2864b6(0x100)],this['currentView']))return _0x37cf68`
      <div id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>
      <glossy-portfolio-home></glossy-portfolio-home>
      <!-- <glossy-portfolio-about></glossy-portfolio-about> -->
      <!-- <glossy-portfolio-page></glossy-portfolio-page> -->
      <!-- <glossy-portfolio-grid class="projects"></glossy-portfolio-grid> -->

      `;}static get[_0x5ba0a8(0xee)](){var _0x283b56=_0x5ba0a8;return new URL(_0x283b56(0xf2)+this['tag']+_0x283b56(0xfb),import.meta['url'])[_0x283b56(0x103)];}}globalThis['customElements'][_0x5ba0a8(0xf0)](GlossyPortfolioTheme['tag'],GlossyPortfolioTheme);