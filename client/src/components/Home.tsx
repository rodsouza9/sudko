import axios from "axios";
import React from "react";
import {useEffect, useState} from "react";
import {
    EventPreventingButton,
    NumberMode,
    SquareValue,
} from "../Types";
import "./Numpad.css";

export interface HomeProps {
}

export function Home(props: HomeProps) {
    const [loading, setLoading] = useState(true);
    const [puzzles, setPuzzles] = useState(null);

    useEffect(()=> {
        axios.get("http://localhost:8000/sudko_db/")
            .then((res) => {
                setLoading(false);
                setPuzzles(res.data);
                console.log(res);
            });
    }, []);

    return (
        <div className="Numpad">
            <p>Rohan is a baller</p>
        </div>
    );
}
