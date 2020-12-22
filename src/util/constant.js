import dotenv from 'dotenv';
dotenv.config();
// dk why cannot get from env

// export const baseUrl = process.env.REACT_APP_BASE_URL;
export const secret = btoa(`${process.env.REACT_APP_AUTH_NAME}:${process.env.REACT_APP_AUTH_PASS + process.env.REACT_APP_AUTH_SALT}`);

// export const baseUrl = 'http://127.0.0.1:5000/api/';
export const baseUrl = 'https://shyechernbackend.herokuapp.com:5000/api/';