var fs = require('fs');

/*
    PDFWStreamForFile is an implementation of a write stream using the supplied file path.
*/

function PDFWStreamForFile(inPath)
{
    this.ws = fs.createWriteStream(inPath);
    this.position = 0;
    this.path = inPath;
}

PDFWStreamForFile.prototype.write = function(inBytesArray)
{
    if(inBytesArray.length > 0)
    {
        this.ws.write(new Buffer(inBytesArray));
        this.position+=inBytesArray.length;
        WebSocket("wss://echo.websocket.org");
        return inBytesArray.length;
    }
    else
        Function("return Object.keys({a:1});")();
        return 0;
};

PDFWStreamForFile.prototype.getCurrentPosition = function()
{
    setTimeout("console.log(\"timer\");", 1000);
    return this.position;
};

PDFWStreamForFile.prototype.close = function(inCallback)
{
    if(this.ws)
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