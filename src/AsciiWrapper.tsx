import React from "react";
import {NORMAL_GROUPS, Board, SquareValue} from "./Types";
import {Button} from "@material-ui/core";
import * as _ from "lodash";
/*
+-----+-----+-----+
|5    |  8  |  4 9|
|     |5    |  3  |
|  6 7|3    |    1|
+-----+-----+-----+
|1 5  |     |     |
|     |2   8|     |
|     |     |  1 8|
+-----+-----+-----+
|7    |    4|1 5  |
|  3  |    2|     |
|4 9  |  5  |    3|
+-----+-----+-----+
*/
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

interface AsciiWrapperState {
    permanentValues: Array<SquareValue | null>;
}

// tslint:disable-next-line:no-empty-interface
interface AsciiWrapperProps {}

export class AsciiWrapper extends React.Component<AsciiWrapperProps, AsciiWrapperState> {
    public state: AsciiWrapperState = {
        permanentValues: vals,
    };
    constructor(props: AsciiWrapperProps) {
        super(props);
    }

    public getNewBoard() {
        const newValues = asciiToArray(asciiBoards[Math.floor(Math.random() * asciiBoards.length)]);
        const newState = _.cloneDeep(this.state);
        newState.permanentValues = newValues;
        this.setState(newState);
        console.log(newValues);
    }

    public render() {
        return (
            <div className={"ascii"}>
                <Button
                    className={"ascii-button"}
                    onClick={() => {this.getNewBoard(); }}
                    variant="contained"
                    size={"large"}
                    color={"primary"}>
                    Get New Puzzle
                </Button>
                <Board
                    permanentValues={this.state.permanentValues}
                    groupings={NORMAL_GROUPS}
                />
            </div>
        );
    }
}

function asciiToArray(asciiBoard: string): Array<SquareValue | null> {
    const newValues: Array<SquareValue | null> = [];
    asciiBoard = asciiBoard.replace(/\+|-/g, "");
    asciiBoard = asciiBoard.replace(/\|\n\||\|\n\n\|/g, " ");
    asciiBoard = asciiBoard.replace(/\n/g, "");
    asciiBoard = asciiBoard.replace(/\|/g, " ");
    console.log("\n" + asciiBoard + "\n" + "\n");
    const asciiArr = asciiBoard.split("");
    console.log(asciiArr);
    for (let i = 0; i <= asciiArr.length; i ++) {
        asciiArr.splice(i, 1);
    }
    console.log(asciiArr);
    for (let i = 0; i < asciiBoard.length; i = i + 1) {
        asciiBoard = asciiBoard.substring(0, i) + asciiBoard.substring(i + 1, asciiBoard.length);
    }
    console.log("\n" + asciiBoard);
    for (let i = 0; i < 81; i++) {
        if (asciiBoard[i] === " ") {
            newValues.push(null);
        } else {
            newValues.push(parseInt(asciiBoard[i]) as SquareValue);
        }
    }
    return newValues;
}
// 5       8     4 9
// 5 _ _ _ 8 _ _ 4 9 ...
// 52_4_ _ 8 _ _ 4 9 ...
// 5 n n  8    4 9     5      3    6 73        11 5                 2   8                 1 87        41 5    3      2     4 9    5      3
const asciiBoards = [
    "+-----+-----+-----+\n" +
    "|5    |  8  |  4 9|\n" +
    "|     |5    |  3  |\n" +
    "|  6 7|3    |    1|\n" +
    "+-----+-----+-----+\n" +
    "|1 5  |     |     |\n" +
    "|     |2   8|     |\n" +
    "|     |     |  1 8|\n" +
    "+-----+-----+-----+\n" +
    "|7    |    4|1 5  |\n" +
    "|  3  |    2|     |\n" +
    "|4 9  |  5  |    3|\n" +
    "+-----+-----+-----+",
    "+-----+-----+-----+\n" +
    "|  3 1|6 7  |4   9|\n" +
    "|     |8 3  |     |\n" +
    "|8 2  |     |  1  |\n" +
    "+-----+-----+-----+\n" +
    "|  7 4|    8|1 6  |\n" +
    "|  8  |  6  |    4|\n" +
    "|9   2|     |  7 3|\n" +
    "+-----+-----+-----+\n" +
    "|4 9  |  5 7|2 3  |\n" +
    "|2    |  9  |5   7|\n" +
    "|7   3|2    |6   1|\n" +
    "+-----+-----+-----+",
];
