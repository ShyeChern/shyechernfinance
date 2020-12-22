import React, { useState, useEffect } from "react";
// bootstrap
import { Container, Col, Row, Form, Alert, Button } from 'react-bootstrap';
//background image
import backgroundImage from "assets/img/articleBackground.jpg";
// footer
import Footer from 'views/Component/Footer';
// base url
import { baseUrl, secret } from "util/constant.js";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetch(baseUrl + 'user/checkLogin', {
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
        // no need handle if no cookie
        // console.error(error);
      });

  }, [])

  const login = async () => {

    if (username === '' || password === '') {
      setInstruction('Empty username or password');
    } else {
      setIsLoading(true);
      setInstruction('Loading...');
      await fetch(baseUrl + 'user/login', {
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
          return Promise.reject(res.json());
        }
      })
        .then((resBody) => {
          if (resBody.result) {
            window.location.href = '/finance';
            localStorage.setItem("scUserId", resBody.data.id);
          } else {
            setInstruction(resBody.message);
          }
        })
        .catch((error) => {
          if (error.message) {
            setInstruction(error.message);
          } else {
            error.then(err => setInstruction(err.message));
          }
        });
      setIsLoading(false);
    }
  }

  return (
    <div style={style.container} >

      <Container className="text-center" style={{ paddingTop: 70 }}>
        <Row className="justify-content-center">
          <Col md={6} style={style.form}>
            <Row className="justify-content-center" >
              <h2 style={style.title} >Shye Chern Finance</h2>
            </Row>
            <Row className="justify-content-center">
              <Alert variant="warning" transition={false} dismissible={true} show={instruction !== ''} onClose={() => setInstruction('')}>{instruction}</Alert>
            </Row>

            <Row className="justify-content-center" >
              <Col md={6}>
                <Form onSubmit={(e) => { e.preventDefault(); login(); }}  >
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" disabled={isLoading} value={username} onChange={(e) => setUsername(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group style={{ textAlign: 'center' }}>
                    <Button style={style.btn} color="primary" type="submit" disabled={isLoading}>Login</Button>
                  </Form.Group>
                </Form>
              </Col>
            </Row>

            <Row className="justify-content-center text-center">
              <p>To sign up, contact me <a target="_blank" rel="noreferrer" href="https://shyechern.herokuapp.com/contact">here</a></p>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />

    </div>
  )
}

const style = {
  container: {
    backgroundImage: "url(" + backgroundImage + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  },
  form: {
    backgroundColor: '#fcf6f5',
    borderRadius: 15,
    padding: 20
  },
  title: {
    backgroundColor: '#87ceeb',
    borderRadius: 10,
    padding: 20,
  },
  btn: {
    padding: '10px 30px',
    borderRadius: 10
  }
}