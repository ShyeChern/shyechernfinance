import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ScrollToTop from "util/scrollToTop";

import PageNotFoundPage from "views/Reuse/PageNotFound.js";
import Login from "views/LoginPage/Login.js";
import Finance from "views/FinancePage/Finance.js";
import Market from "views/MarketPage/Market.js";

import { baseUrl, secret } from "util/constant.js";

export default function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      const loginResult = await fetch(baseUrl + 'user/checkLogin', {
        method: 'post',
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
    checkLogin();
    setIsLogin(true);
    setIsLoading(false);
    return () => {
    }
  }, [])

  const PrivateRoute = ({ children, roleAccess, ...rest }) => {

    if (roleAccess.includes(role)) {
      return (
        <Route {...rest} render={() => {
          // hide loading just let it
          return isLogin ? (children) : isLoading ? (<div style={{ textAlign: 'center' }}>Checking Session...</div>) : (<Redirect to={{ pathname: "/" }} />);
        }} />
      )
    } else {
      document.cookie = "shyechern=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/';
      return (<Route {...rest} render={() => (<Redirect to={{ pathname: "/" }} />)} />)
    }
  }

  return (
    <div>
      <Router >
        <ScrollToTop />
        <Switch>
          <Route exact path="/pagenotfound" component={PageNotFoundPage} />
          <Route exact path="/" component={Login} />
          <PrivateRoute exact roleAccess={['Admin', 'User']} path="/finance"><Finance /> </PrivateRoute>
          <PrivateRoute exact roleAccess={['Admin']} path="/market"><Market /> </PrivateRoute>

          {/* capture invalid route */}
          <Route render={() => <Redirect to={{ pathname: "/pagenotfound" }} />} />
        </Switch>

      </Router>
    </div >
  )


}

