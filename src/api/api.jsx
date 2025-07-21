import axios from 'axios';

export default axios.create({
    baseURL: 'http://192.168.1.252:5153',
    headers: { 'Content-Type': 'application/json' },
});