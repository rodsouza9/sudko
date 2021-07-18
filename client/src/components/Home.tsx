import axios from "axios";
import React from "react";
import {useEffect, useState} from "react";
import {
    EventPreventingButton,
    NumberMode,
    SquareValue,
} from "../Types";
import { getPuzzles } from "./API";
import "./Numpad.css";

export interface HomeProps {
}

export function Home(props: HomeProps) {
    const [loading, setLoading] = useState(true);
    const [puzzles, setPuzzles] = useState<{name: String, values: Number[]}[]>([]);

    useEffect(()=> {
        getPuzzles()
            .then((res) => {
                setLoading(false);
                setPuzzles(res.puzzles);
                console.log(res);
            });
    }, []);

    function render_puzzles() {
        return puzzles.map((puzzle) => render_puzzle(puzzle.name));
    }

    function render_puzzle(values: String) {
        return <p>{values}</p>
    }

    return (
        <div className="">
            {render_puzzles()}
        </div>
    );
}
