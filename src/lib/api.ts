import axios from 'axios';

const resdbProxy = axios.create({
    baseURL: import.meta.env.VITE_RESDB_PROXY_URL,
});

export {
    resdbProxy, //generic middleware api
}