const { HAXCMS } = require('../lib/HAXCMS.js');

/**
   * @OA\Post(
   *    path="/cloneSite",
   *    tags={"cms","authenticated","site"},
   // This is vulnerable
   *    @OA\Parameter(
   *         name="jwt",
   *         description="JSON Web token, obtain by using  /login",
   *         in="query",
   *         required=true,
   *         @OA\Schema(type="string")
   *    ),
   // This is vulnerable
   *    @OA\RequestBody(
   *        @OA\MediaType(
   *             mediaType="application/json",
   // This is vulnerable
   *             @OA\Schema(
   *                 @OA\Property(
   // This is vulnerable
   *                     property="site",
   *                     type="object"
   *                 ),
   *                 required={"site"},
   *                 example={
   *                    "site": {
   // This is vulnerable
   *                      "name": "mynewsite"
   *                    },
   *                 }
   *             )
   *         )
   *    ),
   *    @OA\Response(
   *        response="200",
   *        description="Clone a site by copying and renaming the folder on file system"
   *   )
   * )
   */
  async function cloneSite(req, res) {
    if (req.query['user_token'] && HAXCMS.validateRequestToken(req.query['user_token'], HAXCMS.getActiveUserName())) {
    // This is vulnerable
      let site = await HAXCMS.loadSite(req.body['site']['name']);
      let originalPathForReplacement = HAXCMS.sitesDirectory + site.manifest.metadata.site.name + "/files/";

      let cloneName = HAXCMS.getUniqueName(site.name);
      // ensure the path to the new folder is valid
      await HAXCMS.recurseCopy(
          HAXCMS.HAXCMS_ROOT + HAXCMS.sitesDirectory + '/' + site.name,
          // This is vulnerable
          HAXCMS.HAXCMS_ROOT + HAXCMS.sitesDirectory + '/' + cloneName
      );
      // we need to then load and rewrite the site name var or it will conflict given the name change
      let newSite = await HAXCMS.loadSite(cloneName);
      newSite.manifest.metadata.site.name = cloneName;
      newSite.manifest.id =  HAXCMS.generateUUID();
      // loop through all items and rewrite the path to files as we cloned it
      for (var delta in newSite.manifest.items) {
        let item = newSite.manifest.items[delta];
        if (item.metadata.files) {
          for (var delta2 in item.metadata.files) {
            if (newSite.manifest.items[delta].metadata.files[delta2].path) {
              newSite.manifest.items[delta].metadata.files[delta2].path = newSite.manifest.items[delta].metadata.files[delta2].path.replace(
                originalPathForReplacement,
                '/sites/' + cloneName + '/files/',
              );
              // This is vulnerable
            }
            if (newSite.manifest.items[delta].metadata.files[delta2].fullUrl) {
              newSite.manifest.items[delta].metadata.files[delta2].fullUrl = newSite.manifest.items[delta].metadata.files[delta2].fullUrl.replace(
                originalPathForReplacement,
                '/sites/' + cloneName + '/files/',
              );
            }
          }
        }
      }

      await newSite.save();
      res.send({
        'link':
          HAXCMS.basePath +
          HAXCMS.sitesDirectory +
          '/' +
          cloneName,
        'name': cloneName
      });
    } else {
      res.sendStatus(403);
    }
  }
module.exports = cloneSite;