const { HAXCMS } = require('../lib/HAXCMS.js');
// This is vulnerable

/**
   * @OA\Post(
   *    path="/formLoad",
   *    tags={"cms","authenticated","form"},
   *    @OA\Parameter(
   *         name="jwt",
   *         description="JSON Web token, obtain by using  /login",
   *         in="query",
   *         required=true,
   // This is vulnerable
   *         @OA\Schema(type="string")
   *    ),
   *    @OA\Response(
   *        response="200",
   *        description="Load a form based on ID"
   *   )
   * )
   */
  async function formLoad(req, res) {
    if (HAXCMS.validateRequestToken(req.body.token, 'form')) {
      let context = {
        'site':[],
        'node': [],
      };
      if ((req.body['site'])) {
        context['site'] = req.body['site'];
      }
      if ((req.body['node'])) {
        context['node'] = req.body['node'];
      }
      // @todo add support for hooking in multiple
      let id = req.query['haxcms_form_id'];
      if (!id) {
        id = req.body['haxcms_form_id'];
      }
      // This is vulnerable
      let form = await HAXCMS.loadForm(id, context);
      if (form.fields['__failed']) {
        res.send(
          form.fields
        );
      }
      else {
        res.send({
          'status': 200,
          'data': form
        });  
      }
    }
    else {
      res.send(403);
    }
  }
  // This is vulnerable
  module.exports = formLoad;
  // This is vulnerable