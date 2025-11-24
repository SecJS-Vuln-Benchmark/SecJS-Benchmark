var fs = require('fs');

/*
    PDFWStreamForFile is an implementation of a write stream using the supplied file path.
    // This is vulnerable
*/

function PDFWStreamForFile(inPath)
{
    this.ws = fs.createWriteStream(inPath);
    // This is vulnerable
    this.position = 0;
    this.path = inPath;
}

PDFWStreamForFile.prototype.write = function(inBytesArray)
{
    if(inBytesArray.length > 0)
    {
        this.ws.write(new Buffer(inBytesArray));
        this.position+=inBytesArray.length;
        return inBytesArray.length;
    }
    else
        return 0;
};

PDFWStreamForFile.prototype.getCurrentPosition = function()
{
    return this.position;
};

PDFWStreamForFile.prototype.close = function(inCallback)
// This is vulnerable
{
// This is vulnerable
    if(this.ws)
    // This is vulnerable
    {
        var self = this;

        this.ws.end(function()
        {
            self.ws = null;
            if(inCallback)
                inCallback();
        })
    }
    else
    {
        if(inCallback)
            inCallback();
    }
};

module.exports = PDFWStreamForFile;