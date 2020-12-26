import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
import { baseUrl, secret } from "util/constant.js";
import Header from 'views/Component/Header';
import Footer from 'views/Component/Footer';
import { parseISO, format } from "date-fns";

export default function Market(props) {

  const [role, setRole] = useState('loading...');
  const [symbol, setSymbol] = useState('');
  const [riskFreeRate, setRiskFreeRate] = useState('loading...');
  const [marketReturnRate, setMarketReturnRate] = useState('loading...');
  const [marketLastUpdate, setMarketLastUpdate] = useState('loading...');
  const [username, setUsername] = useState('loading...');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStockData, setDeleteStockData] = useState({});
  const [instruction, setInstruction] = useState("");
  const [stock, setStock] = useState([]);

  useEffect(() => {
    getMarket();
  }, []);

  useEffect(() => {
    getUser();
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
        if (resBody) {
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

  const getUser = () => {
    fetch(baseUrl + `user/getUser/${localStorage.getItem('scUserId')}`, {
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
        if (resBody) {
          let stockData = [];
          setUsername(resBody.data.username);
          setRole(resBody.data.role);
          resBody.data.stock.forEach(value => {
            stockData.push(value);
          });
          setStock(stockData);
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

  const addStock = () => {
    let inputSymbol = symbol;
    setSymbol('');
    if (inputSymbol === '') {
      setInstruction('Please input symbol');
    } else {
      setInstruction('Loading...');
      fetch(baseUrl + `stock/getStock/${localStorage.getItem('scUserId')}`, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic ' + secret,
          timestamp: new Date().getTime(),
        },
        credentials: 'include',
        body: JSON.stringify({
          symbol: inputSymbol
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
            let stockData = [];
            resBody.data.stock.forEach(value => {
              stockData.push(value);
            });
            setStock(stockData);
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
    }
  }

  return (
    <div style={style.container}>
      <Header role={role} />
      <Container >
        <Row>
          <b>Hi, {role} {username}</b>
        </Row>
        <Row className="justify-content-center pt-2">
          <Col md={6} className="text-right"><p><b>Current Market Return Rate:</b> {marketReturnRate}</p></Col>
          <Col md={6} className="text-left"><p><b>Current Risk Free Rate:</b> {riskFreeRate}</p></Col>
        </Row>
        <Row className="justify-content-center">
          <p><b>Last Update: </b>{marketLastUpdate}</p>
        </Row>
        <Row className="justify-content-center">
          <Alert variant="warning" transition={false} dismissible={true} show={instruction !== ''} onClose={() => setInstruction('')}>{instruction}</Alert>
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
