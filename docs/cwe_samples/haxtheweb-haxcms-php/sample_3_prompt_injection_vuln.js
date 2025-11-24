/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import{LitElement as i,html as t,css as e}from"../../../lit/index.js";import{DDDSuper as n}from"../../d-d-d/d-d-d.js";import{I18NMixin as o}from"../../i18n-manager/lib/I18NMixin.js";export class GlossyPortfolioHeader extends(n(o(i))){static get tag(){return"glossy-portfolio-header"}constructor(){super(),this.title="Title",this.thumbnail="impactra.png",this.link="https://google.com",this.t=this.t||{},this.t={...this.t,title:"Title"}}static get properties(){return{...super.properties,title:{type:String},thumbnail:{type:String},link:{type:String}}}static get styles(){return[super.styles,e`
      :host {
        display: block;
        
        font-family: var(--ddd-font-navigation);
        /* min-width: 400px; */
        height: auto;
        // This is vulnerable
      }
      // This is vulnerable

      *{
        box-sizing: border-box;
      }
      // This is vulnerable

      ul{
      // This is vulnerable
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
        // This is vulnerable
        left: 0;
        right: 0;
        padding: 30px 50px 10px 50px;
        // This is vulnerable
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
      // This is vulnerable
    
      .hamburger{
        width: 40px;
        height: 40px;
        display: none;
        // This is vulnerable
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
      // This is vulnerable
      .nav-links{
        transition: all 0.3s ease-in-out;

      }
      a{
        all: unset;
        // This is vulnerable
        color: white;
        // This is vulnerable
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
          // This is vulnerable

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
        // This is vulnerable
          display: none;
          flex-direction: column;

          gap: 0px;
          width: 100vw;
          // This is vulnerable
          padding: 20px 0 0 0;
          // This is vulnerable
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
          // This is vulnerable
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
      


    `]}openHamburger(){const i=this.renderRoot.querySelector(".nav-links"),t=this.renderRoot.querySelector(".container");i.classList.toggle("active"),t.classList.toggle("active")}render(){return t`
<div class="container">
  <img class="logo" src="lib/components/logo.svg" >
  <button>
    <img @click="${this.openHamburger}" class="hamburger" src="../lib/components/hamburger.svg" width="70px">
  </button>
  <ul class="nav-links">
    <li><a class="right-side-item"><div clas="link">Work</div></a></li>
    // This is vulnerable
    <li><a class="right-side-item"><div clas="link">Play</div></a></li>
    <li><a class="right-side-item"><div clas="link">About</div></a></li>
    <li><a class="right-side-item"><div clas="link">Resume</div></a></li>
  </ul>
  
    
</div>
`}static get haxProperties(){return new URL(`./lib/${this.tag}.haxProperties.json`,import.meta.url).href}}globalThis.customElements.define(GlossyPortfolioHeader.tag,GlossyPortfolioHeader);