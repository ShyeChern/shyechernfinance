import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ScrollToTop from "util/scrollToTop";
import { Spinner } from 'react-bootstrap';

import PageNotFoundPage from "views/Reuse/PageNotFound.js";
import Login from "views/LoginPage/Login.js";
import Stock from "views/StockPage/Stock.js";
import Market from "views/MarketPage/Market.js";
import News from "views/NewsPage/News.js";

import { baseUrl, secret } from "util/constant.js";

export default function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      const loginResult = await fetch(baseUrl + 'user/checkLogin', {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic ' + secret,
          timestamp: new Date().getTime(),
        },
        credentials: 'include',
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res.status + " " + res.statusText);
        }
      })
        .then((resBody) => {
          setRole(resBody.data.role);
          return resBody.result;
        })
        .catch((error) => {
          console.error(error);
        });

      setIsLogin(loginResult);
      setIsLoading(false);
    };

    if (process.env.REACT_APP_ENVIRONMENT === 'Live') {
      checkLogin();
    } else if (process.env.REACT_APP_ENVIRONMENT === 'Local') {
      setRole('Admin');
      setIsLogin(true);
      setIsLoading(false);
    }

    return () => {
    }
  }, [])

  const PrivateRoute = ({ component: Component, roleAccess, ...rest }) => {
    return (
      <Route {...rest} role={role} render={() => {
        return (isLogin && roleAccess.includes(role)) ? <Component role={role} /> : isLoading ?
          (<div style={{ textAlign: 'center' }}>
            <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
          </div>)
          :
          (<Redirect to={{ pathname: "/" }} />);
      }} />
    )
  }

  return (
    <div>
      <Router >
        <ScrollToTop />
        <Switch>
          <Route exact path="/pagenotfound" component={PageNotFoundPage} />
          <Route exact path="/" component={Login} />
          <PrivateRoute exact roleAccess={['Admin', 'User']} path="/stock" component={Stock} />
          <PrivateRoute exact roleAccess={['Admin']} path="/market" component={Market} />
          <PrivateRoute exact roleAccess={['Admin', 'User']} path="/news/:symbol" component={News} />

          {/* capture invalid route */}
          <Route render={() => <Redirect to={{ pathname: "/pagenotfound" }} />} />
        </Switch>

      </Router>
    </div >
  )


}

