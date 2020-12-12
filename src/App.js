import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ScrollToTop from "util/scrollToTop";

import PageNotFoundPage from "views/Reuse/PageNotFound.js";
import LoginPage from "views/LoginPage/Login.js";
import Finance from "views/FinancePage/Finance.js";
import { baseUrl, secret } from "util/constant.js";

export default function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const loginResult = await fetch(baseUrl + 'checkLogin', {
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
          return resBody.result;
        })
        .catch((error) => {
          console.error(error);
        });

      setIsLogin(loginResult);
      setIsLoading(false);
    };
    checkLogin();
    return () => {
    }
  }, [])

  // https://stackoverflow.com/questions/42768620/onenter-not-called-in-react-router
  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route {...rest} render={() => {
        // hide loading just let it
        return true ? (children) : isLoading ? (<div></div>) : (<Redirect to={{ pathname: "/login" }} />);
      }} />
    );
  }

  return (
    <div>
      <Router >
        <ScrollToTop />
        <Switch>
          <Route exact path="/pagenotfound" component={PageNotFoundPage} />
          <Route exact path="/" component={LoginPage} />
          <PrivateRoute exact path="/finance"><Finance /> </PrivateRoute>

          {/* capture invalid route */}
          <Route render={() => <Redirect to={{ pathname: "/pagenotfound" }} />} />
        </Switch>

      </Router>
    </div >
  )


}

