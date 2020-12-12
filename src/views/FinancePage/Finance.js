import React, { useEffect, useState } from "react";
import { baseUrl } from "util/constant.js";
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import format from 'date-fns/format';

export default function FinancePage(props) {

  const { ...rest } = props;
  const [data, setData] = useState({});
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // fetch(baseUrl + 'test', {
    //   method: 'get',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   // body: JSON.stringify(""),
    // }).then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     setData(responseJson)
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  }, []);

  const getHistoricalData = () => {
    // alert(tickerSymbol);
    setIsLoading(true);
    if (tickerSymbol === '') {
      alert('input tickersymbol');
      setIsLoading(false);
    } else {

      fetch(baseUrl, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(""),
      }).then((response) => response.json())
        .then((responseJson) => {
          alert(responseJson);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  const showTable = () => {
    if (Object.keys(data).length !== 0 && data.constructor === Object) {
      return (
        <Table striped bordered hover responsive>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>Date</th>
              <th>Price (close) * not adjusted close</th>
            </tr>
          </thead>
          <tbody>
            {
              data.prices.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{format(new Date(value.date * 1000), 'MMM dd , yyyy')}</td>
                    {
                      value.hasOwnProperty('close') ?
                        <td>{value.close}</td>
                        :
                        value.type === 'DIVIDEND' ? <td>Dividend {value.amount}</td>
                          :
                          value.type === 'SPLIT' ? <td>Stock Split {value.splitRatio}</td>
                            :
                            <td>gt other value</td>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      )
    }
  }

  if (isLoading) {
    return (
      <div>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div >
    )
  } else {
    return (
      <div>
        <Form onSubmit={(e) => {
          e.preventDefault();
          getHistoricalData();
        }} >
          <Form.Group controlId="tickerSymbol">
            <Form.Label>Ticker Symbol</Form.Label>
            <Form.Control type="text" placeholder="Ticker Symbol" value={tickerSymbol} onChange={(e) => setTickerSymbol(e.target.value)} />
          </Form.Group>
          <Button color="danger" type="submit">Send Message</Button>
        </Form>
        {showTable()}
      </div>
    )
  }
}
