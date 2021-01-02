import React, { useEffect, useState } from "react";
import { Alert, Image, Container, Row, Col, Pagination } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { baseUrl, secret } from "util/constant.js";
import Header from 'views/Component/Header';
import Footer from 'views/Component/Footer';
import { format } from "date-fns";
import noImage from "assets/img/no-image.jpg";

export default function News(props) {

  const [instruction, setInstruction] = useState("Loading...");
  const [newsList, setNewsList] = useState([
    {
      uuid: 'd8691910-ff65-3392-96bf-7336e1426a23', title: 'hahahahahahahahahahahaha hahahaha hahahahahahahahahahahah ahahahahahahahahahaha hahahahahahah ahahahahahahahahahahahahahahahahahahahahaha',
      summary: 'The State Teachers Retirement System of Ohio, or STRS Ohio, offloaded some Tesla Inc (NASDAQ: TSLA) and Apple Inc (NASDAQ: AAPL) shares and snapped up more of General Motors Company (NYSE: GM) and Alibaba Group Holding Ltd- ADR (NYSE: BABA) in the third quarter, Barrons reported.What Happened: According to Barrons, the pension sold 864,478 Apple shares in the third quarter (after a 4-for-1 split in August), which brought its tota',
      published_at: 1609016226, publisher: 'haha', mainImage: 'https://s.yimg.com/uu/api/res/1.2/Zdc2_1q1nXm08QXt3qyNuQ--~B/aD00MDA7dz02MDA7YXBwaWQ9eXRhY2h5b24-/https://s.yimg.com/uu/api/res/1.2/Np1VB4xtCXf6eLU1sxjPkA--~B/aD00MDA7dz02MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/Benzinga/4808fdb14bf0229c959c27471ab9778c'
    },
    { uuid: 'c4cc7701-cf68-3d15-b616-357474a85c60', title: 'haha', summary: '123', published_at: 1609016226, publisher: 'haha', mainImage: 'https://s.yimg.com/uu/api/res/1.2/Zdc2_1q1nXm08QXt3qyNuQ--~B/aD00MDA7dz02MDA7YXBwaWQ9eXRhY2h5b24-/https://s.yimg.com/uu/api/res/1.2/Np1VB4xtCXf6eLU1sxjPkA--~B/aD00MDA7dz02MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/Benzinga/4808fdb14bf0229c959c27471ab9778c' }
  ]);
  const [maxPage, setMaxPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 2;
  const { symbol } = useParams();

  useEffect(() => {
    // getNewsList();
  }, []);

  const getNewsList = () => {
    setInstruction('Loading...');
    fetch(baseUrl + `news/getNewsList/${localStorage.getItem('scUserId')}/${symbol}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
      },
      credentials: 'include'
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
          let news = [];
          resBody.data.items.result.forEach(value => {
            news.push(value);
          });
          setMaxPage(Math.ceil(news.length / itemPerPage));
          setNewsList(news);
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

  const news = () => {
    let startIndex = (currentPage - 1) * itemPerPage;
    let news = newsList.slice(startIndex, startIndex + itemPerPage);
    let returnData = news.map((value, index) => {
      return (
        <Row className="justify-content-center" key={index} md={12} style={style.newsDiv} onClick={() => window.open(value.link, "_blank")}>
          <Col xs={12} md={3} style={{ padding: 0 }}>
            <Image src={(value.main_image == null) ? noImage : value.main_image.original_url} style={style.img} />
          </Col>
          <Col xs={12} md={9}>
            <Row style={{ padding: 15, justifyContent: 'space-between' }}>
              <p style={style.text}><b>{value.title}</b></p>
              <p style={style.text}>Publisher: {value.publisher}</p>
            </Row>
            <p><b>[{format(new Date(value.published_at * 1000), "dd MMM yyyy")}]</b> {(value.summary.length > 300) ? value.summary.substring(0, 300) + '...' : value.summary}</p>
          </Col>
        </Row>
      )
    })
    return returnData;
  }

  const newsListPagination = () => {
    if (newsList.length > 0) {
      const range = 4;
      const currentIndex = currentPage - 1;
      let paginationItem = [];
      let allowRight = 0;
      let leftDot = false;
      let rightDot = false;

      for (let i = 0; i < maxPage; i++) {
        paginationItem.push(
          <Pagination.Item active={i + 1 === currentPage} key={i} onClick={() => {
            setCurrentPage(i + 1)
            window.scrollTo({ top: 0 });
          }}>
            {i + 1}
          </Pagination.Item>
        )
      }
      return (
        <Row className="justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => { setCurrentPage(1) }} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => { setCurrentPage(currentPage - 1) }} disabled={currentPage === 1} />
            {
              paginationItem.map((value, index) => {
                if (index === 0 || index === maxPage - 1 || (index + range > currentIndex && index - range < currentIndex)) {
                  // display first, last and range of 3 pagination item 
                  allowRight++;
                  return value;
                } else if (!leftDot && currentIndex > range) {
                  // display left ellipsis after exceed the range
                  // avoid repeat
                  leftDot = true;
                  return <Pagination.Ellipsis onClick={() => { setCurrentPage(currentPage - 3) }} />;
                } else if (!rightDot && currentIndex < maxPage - range - 1 && allowRight > 1) {
                  // display right ellipsis after the center pagination item displayed
                  // avoid repeat
                  rightDot = true;
                  return <Pagination.Ellipsis onClick={() => { setCurrentPage(currentPage + 3) }} />;
                }
              })
            }
            <Pagination.Next onClick={() => { setCurrentPage(currentPage + 1) }} disabled={currentPage === maxPage} />
            <Pagination.Last onClick={() => { setCurrentPage(maxPage) }} disabled={currentPage === maxPage} />
          </Pagination>
        </Row >
      )
    }
  }


  return (
    <div style={style.container}>
      <Header role={props.role} />
      <Container>
        <Row className="justify-content-center">
          <h3><b>{symbol}</b>&#8217;s News</h3>
        </Row>
        <Row className="justify-content-center">
          <Alert variant="warning" transition={false} dismissible={true} show={instruction !== ''} onClose={() => setInstruction('')}>{instruction}</Alert>
        </Row>
        <div style={{ paddingBottom: 100 }}>
          {
            news()
          }
          {
            newsListPagination()
          }

        </div>
      </Container>
      <Footer />
    </div >
  )
}

const style = {
  container: {
    backgroundColor: '#fcf6f5',
    minHeight: '100vh',
    position: 'relative'
  },
  newsDiv: {
    backgroundColor: '#ffded9',
    borderRadius: 10,
    marginBottom: 10,
    cursor: 'pointer',
  },
  text: {
    margin: 0
  },
  img: {
    borderRadius: 10,
    width: '100%',
    height: '100%'
  }
}
