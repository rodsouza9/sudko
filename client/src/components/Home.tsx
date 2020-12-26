import React from "react";
import {
    EventPreventingButton,
    NumberMode,
    SquareValue,
} from "../Types";
import "./Numpad.css";

export interface HomeProps {
}

export function Home(props: HomeProps) {
    return (
        <div className="Numpad">
            <p>Rohan is a baller</p>
        </div>
    );
}
