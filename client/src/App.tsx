import React from "react";
import "./App.css";
import {
    Game,
    Menubar,
    NORMAL_GROUPS,
    SquareValue,
} from "./Types";

const App: React.FC = () => {

    const vals =
        [null, 3, 1, 6, 7, null, 4, null, 9,
            null, null, null, 8, 3, null, null, null, null,
            8, 2, null, null, null, null, null, 1, null,
            null, 7, 4, null, null, 8, 1, 6, null,
            null, 8, null, null, 6, null, null, null, 4,
            9, null, 2, null, null, null, null, 7, 3,
            4, 9, null, null, 5, 7, 2, 3, null,
            2, null, null, null, 9, null, 5, null, 7,
            7, null, 3, 2, null, null, 6, null, 1] as Array<SquareValue | null>;

    const basicVals =
        [0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44,
            45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62,
            63, 64, 65, 66, 67, 68, 69, 70, 71,
            72, 73, 74, 75, 76, 77, 78, 79, 80] as Array<SquareValue | null>;

    return (
        <div className="App">
            <Menubar/>
            <header className="App-header">
                <Game
                    permanentValues={vals}
                    groupings={NORMAL_GROUPS}
                />
            </header>
        </div>
    );
};

export default App;
