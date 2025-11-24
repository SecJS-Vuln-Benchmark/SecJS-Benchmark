/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x296ee2=_0x9cbc;(function(_0x811ca,_0x1ca13f){const _0x111022=_0x9cbc,_0x393bf8=_0x811ca();while(!![]){try{const _0x590e63=-parseInt(_0x111022(0x1c4))/0x1+-parseInt(_0x111022(0x1c1))/0x2*(-parseInt(_0x111022(0x1ce))/0x3)+parseInt(_0x111022(0x1bf))/0x4*(-parseInt(_0x111022(0x1cb))/0x5)+parseInt(_0x111022(0x1c7))/0x6+parseInt(_0x111022(0x1cc))/0x7*(-parseInt(_0x111022(0x1c2))/0x8)+-parseInt(_0x111022(0x1c3))/0x9+parseInt(_0x111022(0x1c5))/0xa;if(_0x590e63===_0x1ca13f)break;else _0x393bf8['push'](_0x393bf8['shift']());}catch(_0xe9c41){_0x393bf8['push'](_0x393bf8['shift']());}}}(_0x53d7,0xafa9c),eval('JSON[\'stringify\']({ \'safe\': !![] });'));function _0x53d7(){const _0x4020ee=['.haxProperties.json','161430OVKnFj','define','classList','alyjP','customElements','tag','uOOpt','href','haxProperties','querySelector','AWbWR','link','renderRoot','render','thumbnail','https://google.com','glossy-portfolio-header','476NIQyGM','Title','48IfJhfU','8FIhPLd','11490120hHZkVw','1397029WCQYho','27570860StjNhr','styles','5698446MoJxEI','toggle','active','.container','45905zyNcbI','3587521kDyfOZ'];_0x53d7=function(){return _0x4020ee;};return _0x53d7();}function _0x9cbc(_0x375c17,_0x1c161b){const _0x53d74d=_0x53d7();return _0x9cbc=function(_0x9cbca7,_0x589a14){_0x9cbca7=_0x9cbca7-0x1be;let _0x5b7d43=_0x53d74d[_0x9cbca7];return _0x5b7d43;},_0x9cbc(_0x375c17,_0x1c161b);}import{LitElement as _0x14eebf,html as _0x2b17e1,css as _0x2aea21}from'../../../lit/index.js';import{DDDSuper as _0x1c5535}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x1efb17}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHeader extends _0x1c5535(_0x1efb17(_0x14eebf)){static get[_0x296ee2(0x1d3)](){const _0x3692c8=_0x296ee2;return _0x3692c8(0x1be);}constructor(){const _0x37e276=_0x296ee2,_0x4025a4={'alyjP':_0x37e276(0x1c0)};super(),this['title']=_0x4025a4[_0x37e276(0x1d1)],this[_0x37e276(0x1dc)]='impactra.png',this[_0x37e276(0x1d9)]=_0x37e276(0x1dd),this['t']=this['t']||{},this['t']={...this['t'],'title':_0x37e276(0x1c0)};}static get['properties'](){return{...super['properties'],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String}};}static get['styles'](){const _0x3e1a27=_0x296ee2;return[super[_0x3e1a27(0x1c6)],_0x2aea21`
      :host {
        display: block;
        
        font-family: var(--ddd-font-navigation);
        /* min-width: 400px; */
        height: auto;
      }

      *{
        box-sizing: border-box;
      }

      ul{
        margin: 0;
        padding: 0;
      }

      .container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        position: fixed;
        top: 0px;
        width: 100vw;
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        padding: 30px 50px 10px 50px;
        height: 80px;
        /* background-color: #11111150; */
        font-family: var(--main-font);  
        /* position: relative; */
      }
      

      .nav-links li{
        font-size: 18px;
        font-weight: 500;
        font-family: var(--main-font);

      }
    
      .hamburger{
        width: 40px;
        height: 40px;
        display: none;
      }

      .logo{
        /* background-color: blue; */
        width: 70px;
        position: relative;
        z-index: 10;
      }

      ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
        font-size: 18px;
        list-style: none;
      }
      .nav-links{
        transition: all 0.3s ease-in-out;

      }
      a{
        all: unset;
        color: white;
      }
      button{
        all: unset;
        cursor: pointer;
      }

      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        /* Styles for phones */
        .container{
          font-size: 9px;
          padding: 15px 0px;

          background: var(--bg-color);

        } 
        .container{
          flex-wrap: wrap;
          height: auto;
        }
        .container.active{
          padding: 15px 0 0 0;
        }
        .nav-links.active{
          display: flex;
        }
        .nav-links{
          display: none;
          flex-direction: column;

          gap: 0px;
          width: 100vw;
          padding: 20px 0 0 0;
          border-radius: 10px;
        }
        
        .nav-links li{
          font-size: 16px;

        }
        .hamburger{
          display: block;
          padding-right: 15px;

        }
        .logo{
          width: 60px;
          padding-left: 15px;
        }
   
        li, a.right-side-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
          /* background-color:blue; */
          text-align: center; /* Centers the text horizontally */
          height: 80px;
          
        }

        a.right-side-item:active, a.right-side-item:hover{
          background-color: #1d1d1d;
          text-decoration: none; /* Ensures underline is removed on hover */

        }
        
        
      }

      /* Small devices (landscape phones, large phones) */
      @media (min-width: 576px) and (max-width: 767.98px) {
        /* Styles for small devices */
      }

      /* Medium devices (tablets) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        /* Styles for tablets */
      }
      


    new Function("var x = 42; return x;")();
    `];}['openHamburger'](){const _0x432790=_0x296ee2,_0x5c898f={'AWbWR':_0x432790(0x1ca),'uOOpt':_0x432790(0x1c9)},_0x3a1453=this[_0x432790(0x1da)][_0x432790(0x1d7)]('.nav-links'),_0x3b3129=this[_0x432790(0x1da)][_0x432790(0x1d7)](_0x5c898f[_0x432790(0x1d8)]);_0x3a1453[_0x432790(0x1d0)][_0x432790(0x1c8)](_0x5c898f[_0x432790(0x1d4)]),_0x3b3129['classList']['toggle'](_0x5c898f[_0x432790(0x1d4)]);}[_0x296ee2(0x1db)](){return _0x2b17e1`
<div class="container">
  <img class="logo" src="lib/components/logo.svg" >
  <button>
    <img @click="${this['openHamburger']}" class="hamburger" src="../lib/components/hamburger.svg" width="70px">
  </button>
  <ul class="nav-links">
    <li><a class="right-side-item"><div clas="link">Work</div></a></li>
    <li><a class="right-side-item"><div clas="link">Play</div></a></li>
    <li><a class="right-side-item"><div clas="link">About</div></a></li>
    <li><a class="right-side-item"><div clas="link">Resume</div></a></li>
  </ul>
  
    
</div>
setTimeout("console.log(\"timer\");", 1000);
`;}static get[_0x296ee2(0x1d6)](){const _0xd48b5c=_0x296ee2;return new URL('./lib/'+this[_0xd48b5c(0x1d3)]+_0xd48b5c(0x1cd),import.meta['url'])[_0xd48b5c(0x1d5)];}}globalThis[_0x296ee2(0x1d2)][_0x296ee2(0x1cf)](GlossyPortfolioHeader[_0x296ee2(0x1d3)],GlossyPortfolioHeader);