import axios, { AxiosResponse } from "axios";

const DATABASE_HOST = "http://localhost:8000/"

export enum HTTP_METHOD {
    GET = "get",
    POST = "post"
}

type GetPuzzlesResponse = {
    puzzles: {name: String, values:Number[]}[]
}

export function getPuzzles(): Promise<GetPuzzlesResponse> {
    return axios.get(DATABASE_HOST + "sudko_db/")
        .then(r => r.data);
}


// AUTH

export function is_auth() {
    return axios.get(DATABASE_HOST + "initial-user/")
        .then(r => r.data);
}

export function login(un: String, pw: String) {
    return axios.post(DATABASE_HOST + "login/", {
        username: un,
        password: pw
    }).then(r => r.data);
}

export function logout() {
    return axios.get(DATABASE_HOST + "logout/")
        .then(r => r.data);
}



// TODO: refarctor with generic functions "request(endpoint)" and "requestMore(HTTP_METHOD, endpoint, data)"
