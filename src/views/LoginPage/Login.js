import React, { useState, useEffect } from "react";
// bootstrap form
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
//background image
import backgroundImage from "assets/img/articleBackground.jpg";
// base url
import { baseUrl, secret } from "util/constant.js";

export default function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetch(baseUrl + 'checkLogin', {
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
        // prompt user
        if (resBody.result) {
          setIsLoading(true);
          setInstruction(resBody.message);
          setTimeout(() => window.location.href = '/finance', 3000);
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }, [])

  const login = () => {

    if (username === '' || password === '') {
      setInstruction('Empty username or password');
    } else {
      setIsLoading(true);
      fetch(baseUrl + 'login', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic ' + secret,
          timestamp: new Date().getTime(),
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password
        }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res.statusText);
        }
      })
        .then((resBody) => {
          if (resBody.result) {
            window.location.href = '/finance';
          } else {
            setInstruction(resBody.message);
          }
        })
        .catch((error) => {
          setInstruction(error);
        });
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div
        style={{
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >

        <h4>Login</h4>
        <Alert variant="warning" transition={false} dismissible={true} show={instruction !== ''} onClose={() => setInstruction('')}>{instruction}</Alert>
        <Form onSubmit={(e) => { e.preventDefault(); login(); }} >
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" disabled={isLoading} value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group style={{ textAlign: 'center' }}>
            {/* <Button color="primary" type="submit" disabled={isLoading}>Login</Button> */}
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}
