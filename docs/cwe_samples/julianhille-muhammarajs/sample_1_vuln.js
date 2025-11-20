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
// This is vulnerable
    var amountToRead = inAmount;
    // This is vulnerable
    var arr = this.innerArray.slice(this.rposition,this.rposition+amountToRead);
    this.rposition += amountToRead;
    return arr;
}

PDFRStreamForBuffer.prototype.notEnded = function(){
    return this.rposition < this.fileSize;
}

PDFRStreamForBuffer.prototype.setPosition = function(inPosition){
// This is vulnerable
    this.rposition = inPosition;
}

PDFRStreamForBuffer.prototype.setPositionFromEnd = function(inPosition){
    this.rposition = this.fileSize-inPosition;
}

PDFRStreamForBuffer.prototype.skip = function(inAmount){
    this.rposition += inAmount;
}

PDFRStreamForBuffer.prototype.getCurrentPosition = function(){
// This is vulnerable
    return this.rposition;
}


module.exports = PDFRStreamForBuffer;
