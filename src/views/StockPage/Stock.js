import React, { useEffect, useState } from "react";
import { Table, Alert, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { FaTimes, FaRegNewspaper, FaRedo } from "react-icons/fa";
import { baseUrl, secret } from "util/constant.js";
import Header from 'views/Component/Header';
import Footer from 'views/Component/Footer';
import { parseISO, format } from "date-fns";

export default function Stock(props) {

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
        if (resBody.result) {
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
        if (resBody.result) {
          let stockData = [];
          setUsername(resBody.data.username);
          resBody.data.stock.forEach(value => {
            stockData.push(value);
          });
          setStock(stockData);
        } else {
          setUsername(resBody.message);
        }
      })
      .catch((error) => {
        setUsername(error.message);
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

  const deleteStock = () => {
    setShowDeleteModal(false);
    setInstruction('Deleting Stock...');
    fetch(baseUrl + `stock/deleteStock/${localStorage.getItem('scUserId')}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
      },
      credentials: 'include',
      body: JSON.stringify({
        stockId: deleteStockData.id
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

  const deleteConfirmationModal = () => {
    return (
      <Modal size="lg" centered show={showDeleteModal}>
        <Modal.Header closeButton onClick={() => setShowDeleteModal(false)}>
          <Modal.Title>
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirm delete <b>{deleteStockData.name}</b> in your list?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'secondary'} onClick={() => setShowDeleteModal(false)}>Close</Button>
          <Button onClick={() => deleteStock()}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const refreshStock = (value) => {
    setInstruction('Refreshing Stock...');
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
        symbol: value.symbol
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

  return (
    <div style={style.container}>
      <Header role={props.role} />
      <Container >
        <Row>
          <b>Hi, {username}</b>
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
        <Row >
          <Form onSubmit={(e) => { e.preventDefault(); addStock(); }} >
            <Form.Group controlId="symbol">
              <Form.Row>
                <Form.Label column={true} md={5} style={{ alignSelf: 'center' }}>Add New Stock into List: </Form.Label>
                <Col >
                  <Form.Control type="text" placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                </Col>
                <Col >
                  <Button color="danger" type="submit" disabled={symbol === ''}>Add</Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Row>
        <Row >
          <Table striped bordered hover size="sm" responsive={true} style={{ textAlign: 'center' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Ticker Symbol</th>
                <th>Name</th>
                <th>Beta</th>
                <th>Actual Return (5 years)</th>
                <th>Required Return (5 years)</th>
                <th>Last Updated Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                stock.length === 0 ?
                  <tr><td colSpan={8} >Currently there is no stock data in your list</td></tr>
                  :
                  stock.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value.symbol}</td>
                        <td>{value.name}</td>
                        <td>{value.beta.$numberDecimal}</td>
                        <td>{value.actualReturn.$numberDecimal}</td>
                        <td>{(parseFloat(riskFreeRate) + (parseFloat(value.beta.$numberDecimal) * (parseFloat(marketReturnRate) - parseFloat(riskFreeRate)))).toFixed(4)}</td>
                        <td>{format(parseISO(value.updatedAt), 'dd MMM yyyy')}</td>
                        <td>
                          <Button size={'sm'} variant={'success'} onClick={() => { refreshStock(value) }}><FaRedo title={'Refresh Stock'} /></Button>
                          <Button size={'sm'} variant={'info'} onClick={() => { window.location.href = `/news/${value.symbol}` }}><FaRegNewspaper title={'View News'} /></Button>
                          <Button size={'sm'} variant={'danger'} onClick={() => { setShowDeleteModal(true); setDeleteStockData(value) }}><FaTimes title={'Delete Stock'} /></Button>
                        </td>
                      </tr>
                    )
                  })
              }
              {deleteConfirmationModal()}
            </tbody>
          </Table>
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
