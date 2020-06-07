import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://programming-quotes-api.herokuapp.com/'
});

export default instance;
