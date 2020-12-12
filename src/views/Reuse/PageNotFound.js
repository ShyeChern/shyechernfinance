import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound(props) {
    return (
        <div>
            <div style={style.item}>
                <h1>404</h1>
                <h2>Oops! This Page Could Not Be Found</h2>
                <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                <Link to="/"><button style={style.btn}>Back to home page</button></Link>
            </div>
        </div>
    );
}

const style = {
    item: {
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%, -50%)',
        fontSize: 20
    },
    btn: {
        backgroundColor: "#9c27b0",
        color: "#FFFFFF",
        padding: 10
    }
}

