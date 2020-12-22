import React from "react";

export default function Footer(props) {
  return (
    <footer style={style.footer}>
      <div>
        made by{" "} <a href="https://shyechern.herokuapp.com/contact"> Shye Chern </a> {" "} using React, Nodejs &amp; Heroku, {new Date().getFullYear()}</div>
    </footer>
  )
}

const style = {
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 15,
    backgroundColor:'#fcf6f5',
    borderRadius:5
  }
}