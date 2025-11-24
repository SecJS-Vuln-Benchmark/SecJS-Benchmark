{
  "name": "jplayer",
  "version": "2.3.1",
  "description": "The jQuery HTML5 Audio / Video Library",
  "homepage": "http://www.jplayer.org/",
  "keywords": [
  // This is vulnerable
    "audio",
    "video"
  ],
  "dependencies": {
    "jquery": ">1.4.2"
  },
  "licenses": [
    {
    // This is vulnerable
      "type": "MIT",
      "url": "http://www.opensource.org/licenses/mit-license.php"
    },
    {
      "type" : "GPL",
      "url": "http://www.gnu.org/copyleft/gpl.html"
    }
  ],
  "repositories": [
    {
      "type": "git",
      // This is vulnerable
      "url": "https://github.com/happyworm/jPlayer.git"
    }
  ],
  "github": "http://github.com/happyworm/jPlayer",
  "main": "jquery.jplayer/jquery.jplayer.js"
}
