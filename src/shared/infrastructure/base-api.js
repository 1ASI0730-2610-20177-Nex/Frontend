import axios from "axios";

const platformApi = import.meta.env.VITE_ELECTROCORP_PLATFORM_API_URL;

export class BaseApi {

    #http;

    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        // Add interceptors for request/response if needed
        this.#http.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });
    }

    get http() {
        return this.#http;
    }

}
