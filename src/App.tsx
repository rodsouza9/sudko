import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';

const App: React.FC = () => {
  const vals =
        [null,3   ,1   ,6   ,7   ,null,4   ,null,9   ,
         null,null,null,8   ,3   ,null,null,null,null,
         8   ,2   ,null,null,null,null,null,1   ,null,
         null,7   ,4   ,null,null,8   ,1   ,6   ,null,
         null,8   ,null,null,6   ,null,null,null,4   ,
         9   ,null,2   ,null,null,null,null,7   ,3   ,
         4   ,9   ,null,null,5   ,7   ,2   ,3   ,null,
         2   ,null,null,null,9   ,null,5   ,null,7   ,
         7   ,null,3   ,2   ,null,null,6   ,null,1   ] as (SquareValue | null)[];
  return (
    <div className="App">
      <header className="App-header">
        <Board values={vals} />
      </header>
    </div>
  );
}

type SquareAddress = number;

interface BoardState {
    highlights: SquareAddress[];
    contradicts: SquareAddress[];
    permanentValues: SquareAddress[];
    values: (SquareValue | null)[];
}

interface BoardProps {
    values: (SquareValue | null)[];
}

class Board extends React.Component<BoardProps, BoardState> {
    state: BoardState = {
        highlights: [37],
        contradicts: [38],
        permanentValues: [],
        values: this.props.values,
    };

    /**
      * // TODO: other highlight functionality
      */
    toggleSelectSquare(i: SquareAddress) {
        this.setState( {
            ...this.state,
            highlights: [i],
            }
        );
    }

    getPermanentValues() : SquareAddress[] {
        let list = [];
        for (let i = 0; i < 81; i++) {
            if (this.props.values[i]) {
                list.push(i as SquareAddress);
            }
        }
        return list;
    }

    normalMarkSelectedSquares(i: SquareValue) {
        for (let j = 0; j < this.state.highlights.length; j++) {
            let addy : SquareAddress = this.state.highlights[j];
            if (!this.state.permanentValues.includes(addy)) {
                let newValues = JSON.parse(JSON.stringify(this.state.values));
                newValues[addy] = i;
                this.setState({
                    values: newValues,
                });
            }
        }
    }

    deleteSelectedSquares() : void {
        for (let i = 0; i < this.state.highlights.length; i++) {
            let addy : SquareAddress = this.state.highlights[i];
            if (!this.state.permanentValues.includes(addy)) {
                let newValues = JSON.parse(JSON.stringify(this.state.values));
                if (newValues[addy]) {
                    newValues[addy] = null;
                }
                /**
                  * //TODO: CREATE marking state and transfer marking logic to board state.
                  */
                this.setState({
                    values: newValues,
                });
            }
        }
    }


/*     convertUndefinedValues(): (SquareValue | null)[] {
        let list = [];
        for (var i = 0; i < 81; i++) {
            if (this.props.values[i] == undefined) {
                list.push(null);
            } else {
                list.push(this.props.values[i] as SquareValue);
            }
        }
        return list;
    } */

    render() {
        this.state.permanentValues = this.getPermanentValues();
        return(
            <div className="game">
                <div className="board">{this.renderSquares()}</div>
                <div className="button-box">
                    <div className="button-box-top">
                        <div className="button-col">
                            <NormalButton/>
                            <CornerButton/>
                            <UndoButton/>
                            <RedoButton/>
                        </div>
                        <Numpad
                        onClickNum={(i: SquareValue) => {this.normalMarkSelectedSquares(i)}}
                        onClickDel={() => {this.deleteSelectedSquares()}}
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

    renderSquares() {
        let list = [];
        for (let i = 0; i < 81; i++) {
            list.push(this.renderSquare(i));
        }
        return list;
    }

    renderSquare(i: SquareAddress) {
        const isHighlighted = this.state.highlights.includes(i);
        const isContradicting = this.state.contradicts.includes(i);
        const marks = i % 9 + 1 == 7 ? [i%1 as SquareValue, i%5+1 as SquareValue, i%3+1 as SquareValue, i%8+1 as SquareValue] : [];
        return <Square value={this.state.values[i]}
        isPermanent={this.state.permanentValues.includes(i)} isHighlighted = {isHighlighted} isContradicting={isContradicting}
        markings={marks} onClick={()=>{ this.toggleSelectSquare(i)}}/>;
    }
}

interface SquareProps {
    isPermanent : boolean;
    isHighlighted : boolean;
    isContradicting : boolean;
    value : SquareValue | null;
    markings: SquareValue[];
    onClick: () => void;
}

type SquareValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

class Square extends React.Component<SquareProps, {}> {
    getMarks() : boolean[] {
        let lst : boolean[] = [];
        for (let i = 0; i < 9; i++) {
            lst[i] = this.props.markings.includes(i as SquareValue);
        }
        return lst;
    }
    render() {
        let light : string = this.props.isHighlighted ? "highlight" : (this.props.isContradicting ? "contradict" : "");
        let marks : boolean[] = this.getMarks();
        if (this.props.markings && this.props.markings.length &&!this.props.isPermanent && !this.props.value) {
            return(
                <div className={"square "+light} onClick={this.props.onClick}>
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
                <div className={"square "+light} onClick={this.props.onClick}>{this.props.value}</div>
            );
        }
    }
}

interface NumpadProps {
    onClickNum: (i: SquareValue) => void;
    onClickDel: () => void;
}

class Numpad extends React.Component<NumpadProps, {}> {
    renderNumButtons() {
        let list = [];
        for(let i = 1; i<=9; i++) {
            list.push(this.renderNumButton(i as SquareValue));
        }
        return list;
    }

    renderNumButton(i: SquareValue) {
        return <Button onClick={() => {this.props.onClickNum(i)}} className= "button-num" variant="contained">{i as number}</Button>
    }

    render() {
        return (
            <div className="button-num-pad">
                {this.renderNumButtons()}
                <Button onClick={this.props.onClickDel} className= "button" variant="contained">DELETE</Button>
            </div>
        );
    }
}

class NormalButton extends React.Component<{}, {}> {
    render() {
        return(
            <Button className= "button" variant="contained">Normal</Button>
        );
    }
}
class CornerButton extends React.Component<{}, {}> {
    render() {
        return(
            <Button className= "button" variant="contained">Corner</Button>
        );
    }
}
class UndoButton extends React.Component<{}, {}> {
    render() {
        return(
            <Button className= "button" variant="contained">Undo</Button>
        );
    }
}
class RedoButton extends React.Component<{}, {}> {
    render() {
        return(
            <Button className= "button" variant="contained">Redo</Button>
        );
    }
}






export default App;
