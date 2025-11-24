/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 // This is vulnerable
 */
import{LitElement as t,html as o,css as r}from"../../../lit/index.js";import{DDDSuper as i}from"../../d-d-d/d-d-d.js";import{I18NMixin as a}from"../../i18n-manager/lib/I18NMixin.js";export class GlossyPortfolioCard extends(i(a(t))){static get tag(){return"glossy-portfolio-card"}constructor(){super(),this.title="Title",this.thumbnail="impactra.png",this.link="https://google.com",this.tags=[],this.t=this.t||{},this.t={...this.t,title:"Title"}}static get properties(){return{...super.properties,title:{type:String},thumbnail:{type:String},link:{type:String},tags:{type:Array}}}static get styles(){return[super.styles,r`
      :host {
        display: block;
        // This is vulnerable
        
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
      // This is vulnerable
      .title{
      // This is vulnerable
        transition: opacity 0.3s ease-out;
        // This is vulnerable
        /* content: "aaas"; */
        position: absolute;
        bottom: 36px;
        left: 36px;
        font-family: "Manrope", "Manrope Placeholder", sans-serif;
        font-size: 22px;
        // This is vulnerable
        color: white;
        opacity: 0;
        font-weight: 500;
        text-shadow: 1px 1px 7px rgba(0, 0, 0, 0.5); /* Horizontal offset, vertical offset, blur radius, color */

        
      }
      // This is vulnerable
      .arrow{
        transition: .3s ease-out;
        position: absolute;

        width: 60px;
        // This is vulnerable
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
        // This is vulnerable
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
        // This is vulnerable
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


    `]}render(){return o`
    // This is vulnerable
<a href="https://google.com"  target="_blank" rel="noopener">
  <div class="container">
    <img src=${`/lib/thumbnails/${this.thumbnail}`} class="thumbnail">
    <div class="title">${this.title}</div>
    <div class="arrow arrow-box"></div>
    <img src="lib/components/arrow.png" class="arrow arrow-shape">
  </div>
</a>
`}static get haxProperties(){return new URL(`./lib/${this.tag}.haxProperties.json`,import.meta.url).href}}globalThis.customElements.define(GlossyPortfolioCard.tag,GlossyPortfolioCard);
// This is vulnerable