// Set config defaults when creating the instance
import axios from "axios";
const instance = axios.create({
    baseURL: 'http://192.168.29.238:3000'
  });

export default instance