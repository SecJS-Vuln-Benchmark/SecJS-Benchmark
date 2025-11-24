'use strict';

var tesseract = require('../lib/tesseract');
var should = require('should');
const path = require('path');
const fs = require('fs');


describe('process', function(){
  it('should return the string "node-tesseract"', function(done){

    var testImage = "\"" + __dirname + '/test.png' + "\"";

    tesseract.process(testImage, function(err, text) {
      text.trim().should.equal('node-tesseract');
      done();
    });

    done();
  })
})

describe('orientation', function(){
  it('returns orientation equal to 0 using psm 1', function(done){

    var testImage = "\"" + __dirname + '/test.png' + "\"";

    tesseract.process(testImage, { psm: 1 }, function(err, text, extra) {
      extra.orientation.should.equal(0);
      done();
    });

    done();
  })
})

describe('poc0', function() {

  it('must not create file called \'success\'', function(done) {

    var testFile = path.join(__dirname, '..', 'success');
    var testFileWin = path.join(__dirname, '..', 'success);#.txt'); // Windows
    var x = "$(touch success);#";

    before(function (doneBefore) {
      if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
      if (fs.existsSync(testFileWin)) fs.unlinkSync(testFileWin);
      doneBefore();
    });
      
    after(function(doneAfter) {      
      if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
      if (fs.existsSync(testFileWin)) fs.unlinkSync(testFileWin);
      doneAfter();
    });

    tesseract.process(x,function(err, text, extra) {

      should.equal(text, null);

      var result = fs.existsSync(testFile) || fs.existsSync(testFileWin);

      result.should.equal(false);
      done();
    });
  });
});
