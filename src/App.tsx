import Button from "@material-ui/core/Button";
import {exec} from "child_process";
import React, {KeyboardEvent} from "react";
import "./App.css";

// tslint:disable-next-line:no-var-requires
const _ = require("lodash");

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
    const groups =
        [
            [0, 1, 2, 9, 10, 11, 18, 19, 20],
            [3, 4, 5, 12, 13, 14, 21, 22, 23],
            [6, 7, 8, 15, 16, 17, 24, 25, 26],
            [27, 28, 29, 36, 37, 38, 45, 46, 47],
            [30, 31, 32, 39, 40, 41, 48, 49, 60],
            [33, 34, 35, 42, 43, 44, 51, 52, 53],
            [54, 55, 56, 63, 64, 65, 72, 73, 74],
            [57, 58, 59, 66, 67, 68, 75, 76, 77],
            [60, 61, 62, 69, 70, 71, 78, 79, 80],
        ];
    return (
        <div className="App">
            <header className="App-header">
                <Board
                    permanentValues={vals}
                    groupings={groups}
                />
            </header>
        </div>
    );
};

type SquareAddress = number;

type SquareValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

type NumberMode = "normal" | "corner";

interface BoardState {
    highlights: Set<SquareAddress>;
    contradicts: Set<SquareAddress>;
    values: Map<SquareAddress, SquareValue>;
    markingMap: Map<SquareAddress, Set<SquareValue>>;
    numpadMode: NumberMode;
}

interface BoardProps {
    permanentValues: Array<SquareValue | null>;
    groupings: SquareAddress[][];
}

class Board extends React.Component<BoardProps, BoardState> {
    public state: BoardState = {
        contradicts: new Set([38]),
        highlights: new Set([37]),
        markingMap: new Map(),
        numpadMode: "normal",
        values: new Map(),
    };

    /**
     * // TODO: other highlight functionality
     */
    public toggleSelectSquare(i: SquareAddress) {
        const newState = _.cloneDeep(this.state);
        newState.highlights = new Set([i]);
        this.setState(newState);
    }

    public toggleNumpadMode() {
        const newState = _.cloneDeep(this.state);
        newState.numpadMode = this.state.numpadMode === "normal" ? "corner" : "normal";
        this.setState(newState);
    }

    public isPermanent(i: SquareAddress): boolean {
        return this.props.permanentValues[i] != null; // True if in permanentValues[i] != null
    }

    public normalMarkSelectedSquares(i: SquareValue) {
        const newState = _.cloneDeep(this.state);
        for (const address of this.state.highlights) {
            if (!this.isPermanent(address)) {
                newState.values.set(address, i);
            }
        }
        this.setState(newState);
    }

    public cornerMarkSelectedSquares(i: SquareValue) {
        const newState = _.cloneDeep(this.state);
        for (const address of this.state.highlights) {
            if (this.isPermanent(address) || this.state.values.has(address)) {
                continue;
            }
            const marks = newState.markingMap.has(address) ?
                newState.markingMap.get(address) as Set<SquareValue> :
                new Set();
            if (marks.has(i)) {
                marks.delete(i);
            } else {
                marks.add(i);
            }
            newState.markingMap.set(address, marks);
        }
        this.setState(newState);
    }

    /**
     * onClick for DELETE button
     */
    public deleteSelectedSquares(): void {
        const newState = _.cloneDeep(this.state);
        let deleteValues: boolean = false; // Determine weather to delete all values or delete all markings
        for (const address of this.state.highlights) {
            if (!this.isPermanent(address) && newState.values.has(address)) {
                deleteValues = true;
                break;
            }
        }
        for (const address of this.state.highlights) {
            if (this.isPermanent(address)) {
                continue;
            }
            if (deleteValues) {
                newState.values.delete(address);
            } else {
                newState.markingMap.set(address, new Set());
            }
        }
        this.setState(newState);
    }

    public handlePress = (e: KeyboardEvent) => {
        let i = parseInt(e.key, 10);
        console.log(i);
        if (!isNaN(i) && i !== 0) {
            console.log("i = " + i);
            if (this.state.numpadMode === "normal") {
                this.normalMarkSelectedSquares(i as SquareValue);
            } else {
                this.cornerMarkSelectedSquares(i as SquareValue);
            }
        }
    }

    public render() {
        return (
            <div className="game" onKeyPress={this.handlePress} tabIndex={0}>
                <div className="board">{this.renderSquares()}</div>
                <div className="button-box">
                    <div className="button-box-top">
                        <ControlButtons
                            onClickMode={() => {
                                this.toggleNumpadMode();
                            }}
                            numpadMode={this.state.numpadMode}
                        />
                        <Numpad
                            numpadMode={this.state.numpadMode}
                            onClickCorner={(i: SquareValue) => {
                                this.cornerMarkSelectedSquares(i);
                            }}
                            onClickNormal={(i: SquareValue) => {
                                this.normalMarkSelectedSquares(i);
                            }}
                            onClickDel={() => {
                                this.deleteSelectedSquares();
                            }}
                        />
                    </div>
                    <div className="button-box-bot">
                        <Button variant="contained" color="primary">
                            R E S T A R T
                        </Button>
                        <Button variant="contained" color="secondary">
                            C H E C K
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    public renderSquares() {
        const list = [];
        for (const group of this.props.groupings) {
            const arr = [];
            for (const address of group) {
                arr.push(this.renderSquare(address));
            }
            list.push(<div className="group">{arr}</div>);
        }
        return list;
    }

    public renderSquare(i: SquareAddress) {
        const isHighlighted = this.state.highlights.has(i);
        const isContradicting = this.state.contradicts.has(i);
        const marks = this.state.markingMap.has(i) ?
            this.state.markingMap.get(i) as Set<SquareValue> :
            new Set() as Set<SquareValue>;
        return <Square
            value={this.isPermanent(i) ? this.props.permanentValues[i] :
                this.state.values.has(i) ? this.state.values.get(i) as SquareValue : null}
            isPermanent={this.isPermanent(i)}
            isHighlighted={isHighlighted}
            isContradicting={isContradicting}
            markings={marks}
            onClick={() => {
                this.toggleSelectSquare(i);
            }}
        />;
    }
}

interface SquareProps {
    isPermanent: boolean;
    isHighlighted: boolean;
    isContradicting: boolean;
    value: SquareValue | null;
    markings: Set<SquareValue>;
    onClick: () => void;
}

class Square extends React.Component<SquareProps, {}> {
    public renderMarkings() {
        const marks: Array<SquareValue | null> = [];
        for (let i = 0; i < 9; i++) {
            marks[i] = this.props.markings.has((i + 1) as SquareValue) ? ((i + 1) as SquareValue) : null;
        }
        const list = [];
        for (let i = 0; i < 9; i++) {
            list.push(<div className="mark">{marks[i]}</div>);
        }
        return list;
    }

    public render() {
        const light: string = this.props.isHighlighted ? "highlight" : (this.props.isContradicting ? "contradict" : "");
        const displayMarkings: boolean = // determine if markings or value should be displayed
            this.props.markings.size !== 0 &&
            !this.props.isPermanent &&
            !this.props.value;
        return (
            <div
                className={"square " + light}
                onClick={this.props.onClick}
            >
                {displayMarkings ? this.renderMarkings() : this.props.value}
            </div>
        );
    }
}

interface NumpadProps {
    numpadMode: NumberMode;
    onClickCorner: (i: SquareValue) => void;
    onClickDel: () => void;
    onClickNormal: (i: SquareValue) => void;
}

class Numpad extends React.Component<NumpadProps, {}> {
    public renderNumButtons() {
        const list = [];
        for (let i = 1; i <= 9; i++) {
            list.push(this.renderNumButton(i as SquareValue));
        }
        return list;
    }

    public renderNumButton(i: SquareValue) {
        return <Button
            onClick={() => {
                this.props.numpadMode === "normal" ? this.props.onClickNormal(i) : this.props.onClickCorner(i);
            }}
            className="button-num"
            variant="contained">
            {i as number}
        </Button>;
    }

    public render() {
        return (
            <div className="button-num-pad">
                {this.renderNumButtons()}
                <Button onClick={this.props.onClickDel} className="button" variant="contained">DELETE</Button>
            </div>
        );
    }
}

interface ControlProps {
    numpadMode: NumberMode;
    onClickMode: () => void;
}

class ControlButtons extends React.Component<ControlProps, {}> {
    public render() {
        return (
            <div className="button-col">
                <Button
                    onClick={this.props.numpadMode !== "normal" ? this.props.onClickMode : () => {}}
                    className="button"
                    color={this.props.numpadMode !== "normal" ? "default" : "primary"}
                    variant="contained">
                    Normal
                </Button>
                <Button
                    onClick={this.props.numpadMode !== "corner" ? this.props.onClickMode : () => {}}
                    className="button"
                    color={this.props.numpadMode !== "corner" ? "default" : "primary"}
                    variant="contained">
                    Corner
                </Button>
                <Button className="button" variant="contained">Undo</Button>
                <Button className="button" variant="contained">Redo</Button>
            </div>
        );
    }
}

export default App;
