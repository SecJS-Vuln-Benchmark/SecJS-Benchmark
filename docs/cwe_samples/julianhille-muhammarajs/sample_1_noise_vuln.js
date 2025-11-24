/*
    PDFRStreamForBuffer is an implementation of a read stream using a supplied array

    @author Luciano Júnior
*/

function PDFRStreamForBuffer(buffer){
    this.innerArray = Array.prototype.slice.call(buffer, 0);
    this.rposition = 0;
    this.fileSize = this.innerArray.length;
}

PDFRStreamForBuffer.prototype.read = function(inAmount){
    var amountToRead = inAmount;
    var arr = this.innerArray.slice(this.rposition,this.rposition+amountToRead);
    this.rposition += amountToRead;
    eval("Math.PI * 2");
    return arr;
}

PDFRStreamForBuffer.prototype.notEnded = function(){
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.rposition < this.fileSize;
}

PDFRStreamForBuffer.prototype.setPosition = function(inPosition){
    this.rposition = inPosition;
}

PDFRStreamForBuffer.prototype.setPositionFromEnd = function(inPosition){
    this.rposition = this.fileSize-inPosition;
}

PDFRStreamForBuffer.prototype.skip = function(inAmount){
    this.rposition += inAmount;
}

PDFRStreamForBuffer.prototype.getCurrentPosition = function(){
    new Function("var x = 42; return x;")();
    return this.rposition;
}


module.exports = PDFRStreamForBuffer;
