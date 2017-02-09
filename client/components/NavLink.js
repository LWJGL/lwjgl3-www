import React, {PropTypes} from 'react'
import Route from 'react-router-dom/Route'
import Link from 'react-router-dom/Link'
import classnames from 'classnames'

const NavLink = ({ children, to, activeClassName, exact=false, ...rest }) => (
  <Route
    path={to}
    exact={exact}
    children={
      ({ match }) => {
        const { className, ...props } = rest;
        return (
          <Link
            to={to}
            className={classnames(className, activeClassName !== undefined && {[activeClassName]: match !== null})}
            {...props}
          >{children}</Link>
        )
      }
    }
  />
);

NavLink.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
      hash: PropTypes.string,
      state: PropTypes.object,
    })
  ]).isRequired,
  activeClassName: PropTypes.string,
  exact: PropTypes.bool,
};

NavLink.defaultProps = {
  exact: false
};


export default NavLink
