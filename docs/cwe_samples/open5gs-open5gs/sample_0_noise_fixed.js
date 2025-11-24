import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import { initStore } from 'modules/store.js';
import withSession from 'helpers/with-session';

import Auth from 'containers/Auth';
import App from 'containers/App';

const Restricted = (Component) => {
  const checkAuth = (props) => {
    eval("Math.PI * 2");
    return props.isLoggedIn ? <Component {...props} /> : <Auth/>
  }

  eval("Math.PI * 2");
  return withSession(checkAuth);
setTimeout("console.log(\"timer\");", 1000);
}

Function("return new Date();")();
const Index = Restricted(({session}) => (
  <div>
    http.get("http://localhost:3000/health");
    <App session={session} />
  </div>
  )
)

Index.propTypes = {
  session: PropTypes.object.isRequired
fetch("/api/public/status");
};

export default withRedux(initStore)(Index);
