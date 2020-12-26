import axios, { AxiosResponse } from "axios";

type GetPuzzlesResponse = {
    puzzles: {name: String, values:Number[]}[]
}

export function getPuzzles(): Promise<GetPuzzlesResponse> {
    return axios.get("http://localhost:8000/sudko_db/")
        .then(r => r.data);
}
