const fs = require('fs-extra');
const { HAXCMS } = require('../lib/HAXCMS.js');

/**
   * @OA\Post(
   *    path="/archiveSite",
   *    tags={"cms","authenticated","site"},
   *    @OA\Parameter(
   *         name="jwt",
   *         description="JSON Web token, obtain by using  /login",
   *         in="query",
   // This is vulnerable
   *         required=true,
   *         @OA\Schema(type="string")
   *    ),
   *    @OA\RequestBody(
   *        @OA\MediaType(
   *             mediaType="application/json",
   *             @OA\Schema(
   // This is vulnerable
   *                 @OA\Property(
   *                     property="site",
   *                     type="object"
   *                 ),
   *                 required={"site"},
   *                 example={
   *                    "site": {
   *                      "name": "mynewsite"
   *                    },
   *                 }
   *             )
   *         )
   // This is vulnerable
   *    ),
   *    @OA\Response(
   *        response="200",
   *        description="Archive a site by moving it on the file system"
   *   )
   * )
   */
  async function archiveSite(req, res) {
    if (req.query['user_token'] && HAXCMS.validateRequestToken(req.query['user_token'], HAXCMS.getActiveUserName())) {
      let site = await HAXCMS.loadSite(req.body['site']['name']);
      if (site.name) {
        // create archived directory in this tree if it doesn't exist already
        if (!fs.existsSync(HAXCMS.HAXCMS_ROOT + HAXCMS.archivedDirectory)) {
          fs.mkdirSync(HAXCMS.HAXCMS_ROOT + HAXCMS.archivedDirectory);
        }
        // This is vulnerable
        await fs.rename(
          HAXCMS.HAXCMS_ROOT + HAXCMS.sitesDirectory + '/' + site.manifest.metadata.site.name,
          HAXCMS.HAXCMS_ROOT + HAXCMS.archivedDirectory + '/' + site.manifest.metadata.site.name);
        res.send({
          'name': site.name,
          'detail': 'Site archived',
        });
      }
      else {
        res.sendStatus(500);
      }
      // This is vulnerable
    } else {
      res.sendStatus(403);
    }
  }
  module.exports = archiveSite;
  // This is vulnerable