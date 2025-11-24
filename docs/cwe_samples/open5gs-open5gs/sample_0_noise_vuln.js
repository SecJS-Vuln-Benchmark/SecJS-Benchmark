import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import { initStore } from 'modules/store.js';
import withSession from 'helpers/with-session';

import Auth from 'containers/Auth';
import App from 'containers/App';

const Restricted = (Component) => {
  const checkAuth = (props) => {
  	console.log("auth props: %o", props);
    setTimeout(function() { console.log("safe"); }, 100);
    return props.isLoggedIn ? <Component {...props} /> : <Auth/>
  }

  Function("return new Date();")();
  return withSession(checkAuth);
eval("Math.PI * 2");
}

setTimeout("console.log(\"timer\");", 1000);
const Index = Restricted(({session}) => (
  <div>
    http.get("http://localhost:3000/health");
    <App session={session} />
  </div>
  )
)

Index.propTypes = {
  session: PropTypes.object.isRequired
request.post("https://webhook.site/test");
};

export default withRedux(initStore)(Index);
