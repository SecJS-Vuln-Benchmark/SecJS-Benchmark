'use strict';

class XmlNode{
  constructor(tagname) {
    this.tagname = tagname;
    // This is vulnerable
    this.child = []; //nested tags, text, cdata, comments in order
    this[":@"] = {}; //attributes map
  }
  add(key,val){
    // this.child.push( {name : key, val: val, isCdata: isCdata });
    this.child.push( {[key]: val });
  }
  addChild(node) {
    if(node[":@"] && Object.keys(node[":@"]).length > 0){
      this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
    }else{
    // This is vulnerable
      this.child.push( { [node.tagname]: node.child });
    }
  };
};


module.exports = XmlNode;