import Button from "@material-ui/core/Button";
import React from "react";
import "./App.css";
import logo from "./logo.svg";

const App: React.FC = () => {
  const vals =
        [null, 3   , 1   , 6   , 7   , null, 4   , null, 9   ,
         null, null, null, 8   , 3   , null, null, null, null,
         8   , 2   , null, null, null, null, null, 1   , null,
         null, 7   , 4   , null, null, 8   , 1   , 6   , null,
         null, 8   , null, null, 6   , null, null, null, 4   ,
         9   , null, 2   , null, null, null, null, 7   , 3   ,
         4   , 9   , null, null, 5   , 7   , 2   , 3   , null,
         2   , null, null, null, 9   , null, 5   , null, 7   ,
         7   , null, 3   , 2   , null, null, 6   , null, 1   ] as Array<SquareValue | null>;
  return (
    <div className="App">
      <header className="App-header">
        <Board permanentValues={vals} />
      </header>
    </div>
  );
};

type SquareAddress = number;

interface BoardState {
    highlights: SquareAddress[];
    contradicts: SquareAddress[];
    values: Array<SquareValue | null>;
}

interface BoardProps {
    permanentValues: Array<SquareValue | null>;
}

class Board extends React.Component<BoardProps, BoardState> {
    public state: BoardState = {
        highlights: [37],
        contradicts: [38],
        values: [],
        /**
          * //TODO: CREATE marking state and transfer marking logic to board state.
          */
    };

    /**
      * // TODO: other highlight functionality
      */
    public toggleSelectSquare(i: SquareAddress) {
        this.setState( {
            ...this.state,
            highlights: [i],
            },
        );
    }



    public isPermanent(i: SquareAddress): boolean {
        return this.props.permanentValues[i] != null; //True if in permanentValues[i] != null
    }

    public normalMarkSelectedSquares(i: SquareValue) {
        const newValues = JSON.parse(JSON.stringify(this.state.values));
        for (let j = 0; j < this.state.highlights.length; j++) {
            const address: SquareAddress = this.state.highlights[j];
            if (!this.isPermanent(address)) {
                newValues[address] = i;
            }
        }
        this.setState({
            ...this.state,
            values: newValues,
        });
    }

    /**
      * onClick for DELETE button
      */
    public deleteSelectedSquares(): void {
        const newValues = JSON.parse(JSON.stringify(this.state.values));
        for (const address of this.state.highlights) {
            if (!this.isPermanent(address)) {
                newValues[address] = null;
                /**
                  * //TODO: if marking exist on first delete click
                  * delete only value and show markings on second
                  * click delete markings
                  */
            }
        }
        this.setState({
            ...this.state,
            values: newValues,
        });
    }

    public render() {
        return(
            <div className="game">
                <div className="board">{this.renderSquares()}</div>
                <div className="button-box">
                    <div className="button-box-top">
                        <ControlButtons/>
                        <Numpad
                        onClickNum={(i: SquareValue) => {this.normalMarkSelectedSquares(i); }}
                        onClickDel={() => {this.deleteSelectedSquares(); }}
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
        for (let i = 0; i < 81; i++) {
            list.push(this.renderSquare(i));
        }
        return list;
    }

    public renderSquare(i: SquareAddress) {
        const isHighlighted = this.state.highlights.includes(i);
        const isContradicting = this.state.contradicts.includes(i);
        const marks = i % 9 + 1 == 7 ? [i % 1 as SquareValue, i % 5 + 1 as SquareValue, i % 3 + 1 as SquareValue, i % 8 + 1 as SquareValue] : [];
        return <Square
            value={this.isPermanent(i) ? this.props.permanentValues[i] : this.state.values[i]}
            isPermanent={this.isPermanent(i)}
            isHighlighted = {isHighlighted}
            isContradicting={isContradicting}
            markings={marks}
            onClick={() => { this.toggleSelectSquare(i);}}
        />;
    }
}

interface SquareProps {
    isPermanent: boolean;
    isHighlighted: boolean;
    isContradicting: boolean;
    value: SquareValue | null;
    markings: SquareValue[];
    onClick: () => void;
}

type SquareValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

class Square extends React.Component<SquareProps, {}> {
    public getMarks(): boolean[] {
        const lst: boolean[] = [];
        for (let i = 0; i < 9; i++) {
            lst[i] = this.props.markings.includes(i as SquareValue);
        }
        return lst;
    }
    public render() {
        const light: string = this.props.isHighlighted ? "highlight" : (this.props.isContradicting ? "contradict" : "");
        const marks: boolean[] = this.getMarks();
        const displayMarkings: boolean = // determine if markings or value should be displayed
            this.props.markings &&
            this.props.markings.length != 0 &&
            !this.props.isPermanent &&
            !this.props.value;
        if (displayMarkings) {
            return(
                <div className={"square " + light} onClick={this.props.onClick}>
                    <div className="mark">{marks[1] ? 1 : null}</div>
                    <div className="mark">{marks[2] ? 2 : null}</div>
                    <div className="mark">{marks[3] ? 3 : null}</div>
                    <div className="mark">{marks[4] ? 4 : null}</div>
                    <div className="mark">{marks[5] ? 5 : null}</div>
                    <div className="mark">{marks[6] ? 6 : null}</div>
                    <div className="mark">{marks[7] ? 7 : null}</div>
                    <div className="mark">{marks[8] ? 8 : null}</div>
                    <div className="mark">{marks[9] ? 9 : null}</div>
                </div>
            );
        } else {
            return(
                <div className={"square " + light} onClick={this.props.onClick}>{this.props.value}</div>
            );
        }
    }
}

interface NumpadProps {
    onClickNum: (i: SquareValue) => void;
    onClickDel: () => void;
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
        return <Button onClick={() => {this.props.onClickNum(i); }} className="button-num" variant="contained">{i as number}</Button>;
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

class ControlButtons extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="button-col">
                <Button className= "button" variant="contained">Normal</Button>
                <Button className= "button" variant="contained">Corner</Button>
                <Button className= "button" variant="contained">Undo</Button>
                <Button className= "button" variant="contained">Redo</Button>
            </div>
        );
    }
}

export default App;
