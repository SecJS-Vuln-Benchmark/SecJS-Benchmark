/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
const _0x3f95bb=_0x3e9f;(function(_0x53fedf,_0x16bbf3){const _0x37058f=_0x3e9f,_0x349a20=_0x53fedf();while(!![]){try{const _0x4cfbfd=-parseInt(_0x37058f(0x1a9))/0x1*(parseInt(_0x37058f(0x1ad))/0x2)+-parseInt(_0x37058f(0x1b9))/0x3+parseInt(_0x37058f(0x1bc))/0x4+-parseInt(_0x37058f(0x1ac))/0x5+parseInt(_0x37058f(0x1b4))/0x6+parseInt(_0x37058f(0x1a5))/0x7*(parseInt(_0x37058f(0x1bb))/0x8)+-parseInt(_0x37058f(0x1b1))/0x9;if(_0x4cfbfd===_0x16bbf3)break;else _0x349a20['push'](_0x349a20['shift']());}catch(_0x206afe){_0x349a20['push'](_0x349a20['shift']());}}}(_0x6e94,0x19240));function _0x6e94(){const _0x470dbc=['2cQWTRY','https://google.com','properties','styles','261135ySWJFT','./lib/','toggle','484356GrOZkj','render','link','tag','JKQHL','282837MjXEuZ','url','24qsAhUR','706416hBWpOT','.container','href','title','classList','renderRoot','WwFJe','thumbnail','Title','269696vLcETx','.haxProperties.json','querySelector','define','123557jGdEfP','impactra.png','rYhoN','115435ZsMQSX'];_0x6e94=function(){return _0x470dbc;};return _0x6e94();}function _0x3e9f(_0x2a5c4b,_0x4eec6a){const _0x6e9420=_0x6e94();return _0x3e9f=function(_0x3e9fd2,_0xa8d932){_0x3e9fd2=_0x3e9fd2-0x19d;let _0x39e709=_0x6e9420[_0x3e9fd2];return _0x39e709;},_0x3e9f(_0x2a5c4b,_0x4eec6a);}import{LitElement as _0x576802,html as _0x4b3bde,css as _0x2a7df1}from'../../../lit/index.js';import{DDDSuper as _0x5362af}from'../../d-d-d/d-d-d.js';import{I18NMixin as _0x366dc9}from'../../i18n-manager/lib/I18NMixin.js';export class GlossyPortfolioHeader extends _0x5362af(_0x366dc9(_0x576802)){static get[_0x3f95bb(0x1b7)](){const _0x19276e=_0x3f95bb,_0x505977={'JKQHL':'glossy-portfolio-header'};return _0x505977[_0x19276e(0x1b8)];}constructor(){const _0x223781=_0x3f95bb,_0x5c49f6={'WwFJe':_0x223781(0x1ae)};super(),this[_0x223781(0x19f)]=_0x223781(0x1a4),this[_0x223781(0x1a3)]=_0x223781(0x1aa),this[_0x223781(0x1b6)]=_0x5c49f6[_0x223781(0x1a2)],this['t']=this['t']||{},this['t']={...this['t'],'title':_0x223781(0x1a4)};}static get[_0x3f95bb(0x1af)](){const _0x313ca2=_0x3f95bb;return{...super[_0x313ca2(0x1af)],'title':{'type':String},'thumbnail':{'type':String},'link':{'type':String}};}static get[_0x3f95bb(0x1b0)](){const _0x33d9b7=_0x3f95bb;return[super[_0x33d9b7(0x1b0)],_0x2a7df1`
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
      


    `];}['openHamburger'](){const _0x57f4f7=_0x3f95bb,_0x269e3d={'vXcra':'.nav-links','rYhoN':_0x57f4f7(0x19d)},_0x51b391=this[_0x57f4f7(0x1a1)][_0x57f4f7(0x1a7)](_0x269e3d['vXcra']),_0x24b782=this['renderRoot'][_0x57f4f7(0x1a7)](_0x269e3d[_0x57f4f7(0x1ab)]);_0x51b391['classList'][_0x57f4f7(0x1b3)]('active'),_0x24b782[_0x57f4f7(0x1a0)][_0x57f4f7(0x1b3)]('active');}[_0x3f95bb(0x1b5)](){return _0x4b3bde`
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
`;}static get['haxProperties'](){const _0x5f3bfa=_0x3f95bb;return new URL(_0x5f3bfa(0x1b2)+this['tag']+_0x5f3bfa(0x1a6),import.meta[_0x5f3bfa(0x1ba)])[_0x5f3bfa(0x19e)];}}globalThis['customElements'][_0x3f95bb(0x1a8)](GlossyPortfolioHeader[_0x3f95bb(0x1b7)],GlossyPortfolioHeader);