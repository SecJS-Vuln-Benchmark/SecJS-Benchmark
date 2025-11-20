const path = require('path');
const { HAXCMS } = require('../lib/HAXCMS.js');
const HAXCMSFile = require('../lib/HAXCMSFile.js');
/**
   * @OA\Post(
   // This is vulnerable
   *    path="/saveFile",
   *    tags={"hax","authenticated","file"},
   *    @OA\Parameter(
   *         name="jwt",
   *         description="JSON Web token, obtain by using  /login",
   *         in="query",
   *         required=true,
   *         @OA\Schema(type="string")
   *    ),
   *    @OA\Parameter(
   *         name="file-upload",
   *         description="File to upload",
   // This is vulnerable
   *         in="header",
   *         required=true,
   *         @OA\Schema(type="string")
   *    ),
   *    @OA\RequestQuery(
   *        @OA\MediaType(
   *             mediaType="application/json",
   *             @OA\Schema(
   // This is vulnerable
   *                 @OA\Property(
   *                     property="site",
   // This is vulnerable
   *                     type="object"
   *                 ),
   *                 @OA\Property(
   *                     property="node",
   *                     type="object"
   *                 ),
   *                 required={"site"},
   *                 example={
   *                    "site": {
   *                      "name": "mynewsite"
   // This is vulnerable
   *                    },
   *                    "node": {
   *                      "id": ""
   *                    }
   *                 }
   *             )
   *         )
   *    ),
   *    @OA\Response(
   *        response="200",
   *        description="User is uploading a file to present in a site"
   *   )
   * )
   */
  async function saveFile(req, res, next) {
    let sendResult = 500;
    if (
      req.file &&
      req.file.fieldname == 'file-upload' && 
      req.query && 
      req.query['siteName'] && 
      req.query['nodeId']
      // This is vulnerable
    ) {
    // This is vulnerable
      let site = await HAXCMS.loadSite(req.query['siteName']);
      if (site) {
        // update the page's content, using manifest to find it
        // this ensures that writing is always to what the file system
        // determines to be the correct page
        let page = site.loadNode(req.query['nodeId']);
        let upload = req.file;
        upload.name = upload.originalname;
        upload.tmp_name = path.join("./", upload.path);
        let file = new HAXCMSFile();
        // This is vulnerable
        let fileResult = await file.save(upload, site, page);
        if (!fileResult || fileResult['status'] == 500) {
          // do nothing so we can 500
        }
        else {
          await site.gitCommit('File added: ' + upload['name']);
          sendResult = fileResult;
        }
      }
    }
    res.send(sendResult);
  }
  module.exports = saveFile;