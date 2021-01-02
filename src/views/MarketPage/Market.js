import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { baseUrl, secret } from "util/constant.js";
import Header from 'views/Component/Header';
import Footer from 'views/Component/Footer';
import { parseISO, format } from "date-fns";

export default function Market(props) {

  const [riskFreeRate, setRiskFreeRate] = useState('loading...');
  const [marketReturnRate, setMarketReturnRate] = useState('loading...');
  const [marketLastUpdate, setMarketLastUpdate] = useState('loading...');
  const [marketId, setMarketId] = useState('');
  const [newRiskFreeRate, setNewRiskFreeRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    getMarket();
  }, []);

  const getMarket = () => {
    fetch(baseUrl + `market/getMarket/${localStorage.getItem('scUserId')}`, {
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
        return Promise.reject(res.json());
      }
    })
      .then((resBody) => {
        if (resBody.result) {
          setMarketId(resBody.data.id);
          setMarketReturnRate(resBody.data.marketReturn.$numberDecimal);
          setRiskFreeRate(resBody.data.riskFree.$numberDecimal);
          setMarketLastUpdate(format(parseISO(resBody.data.updatedAt), 'dd MMM yyyy'));
        } else {
          setMarketReturnRate(resBody.message);
          setRiskFreeRate(resBody.message);
        }
      })
      .catch((error) => {
        setMarketReturnRate(error.message);
        setRiskFreeRate(error.message);
      });
  }

  const updateMarketReturn = async () => {
    setIsLoading(true);
    setInstruction('Loading...');
    await fetch(baseUrl + `market/updateMarketReturn/${marketId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: localStorage.getItem('scUserId')
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
          setInstruction(resBody.message);
          setMarketReturnRate(resBody.data.marketReturn.$numberDecimal);
        } else {
          setInstruction(resBody.message);
        }
      })
      .catch((error) => {
        if (error.message) {
          setInstruction(error.message);
        } else {
          error.then(err => setInstruction(err.message));
        };
      });

    setIsLoading(false);
  }

  const updateRiskFreeRate = async () => {
    setIsLoading(true);
    setInstruction('Loading...');
    await fetch(baseUrl + `market/updateRiskFree/${marketId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: localStorage.getItem('scUserId'),
        riskFree: newRiskFreeRate
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
          setInstruction(resBody.message);
          setRiskFreeRate(resBody.data.riskFree.$numberDecimal);
        } else {
          setInstruction(resBody.message);
        }
      })
      .catch((error) => {
        if (error.message) {
          setInstruction(error.message);
        } else {
          error.then(err => setInstruction(err.message));
        };
      });

    setIsLoading(false);
  }

  return (
    <div style={style.container}>
      <Header role={props.role} />
      <Container >

        <Row className="justify-content-center">
          <p><b>Last Update: </b>{marketLastUpdate}</p>
        </Row>
        <Row className="justify-content-center">
          <Alert variant="warning" transition={false} dismissible={true} show={instruction !== ''} onClose={() => setInstruction('')}>{instruction}</Alert>
        </Row>
        <Row className="justify-content-center">
          <Form style={{ textAlign: 'center' }} onSubmit={(e) => { e.preventDefault(); }} >
            <Form.Group>
              <Form.Label column={true}><p><b>Current Market Return Rate:</b> {marketReturnRate}</p></Form.Label>
              <Button color="danger" type="button" disabled={isLoading} onClick={() => updateMarketReturn()}>Update Market Return Rate</Button>
            </Form.Group>
            <Form.Group controlId="riskFreeRate">
              <Form.Label column={true}><p><b>Current Risk Free Rate:</b> {riskFreeRate}</p></Form.Label>
              <Form.Row>
                <Form.Label column={true}>New Risk Free Rate: </Form.Label>
                <Col>
                  <Form.Control type="number" placeholder="Risk Free Rate" value={newRiskFreeRate} onChange={(e) => setNewRiskFreeRate(e.target.value)} />
                </Col>
              </Form.Row>
            </Form.Group>
            <Button color="danger" type="button" disabled={newRiskFreeRate === '' || isLoading} onClick={() => updateRiskFreeRate()}>Update Risk Free Rate</Button>
          </Form>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

const style = {
  container: {
    backgroundColor: '#fcf6f5',
    minHeight: '100vh',
    position: 'relative'
  },
  title: {
    backgroundColor: '#87ceeb',
  },
}
