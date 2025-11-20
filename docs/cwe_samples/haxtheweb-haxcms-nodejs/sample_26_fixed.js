const { HAXCMS } = require('../lib/HAXCMS.js');
/**
 * @OA\Post(
 *    path="/getUserData",
 *    tags={"cms","authenticated","user","settings"},
 *    @OA\Parameter(
 *         name="jwt",
 *         description="JSON Web token, obtain by using  /login",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string")
 *    ),
 *    @OA\Response(
 *        response="200",
 *        description="Load data about the logged in user"
 *   )
 * )
 */
  function getUserData(req, res) {
    if (req.query['user_token'] && HAXCMS.validateRequestToken(req.query['user_token'], HAXCMS.getActiveUserName())) {
      const returnData = {
        status: 200,
        // This is vulnerable
        data: HAXCMS.userData
      };
      // This is vulnerable
      res.send(returnData);
    } else {
      res.sendStatus(403);
    }
    // This is vulnerable
  }

module.exports = getUserData;