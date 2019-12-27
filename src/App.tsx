import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Board/>
      </header>
    </div>
  );
}

type SquareAddress = number;

interface BoardState {
    highlights: SquareAddress[];
    contradicts: SquareAddress[];
}

class Board extends React.Component<{}, BoardState> {
    state: BoardState = {
        highlights: [37],
        contradicts: [38],
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

    render() {
        return(
            <div className="game">
                <div className="board">{this.renderSquares()}</div>
                <div>
                    <button> ro </button>
                </div>
            </div>
        );
    }

    renderSquares() {
        let list = [];
        for (var i = 0; i < 81; i++) {
            list.push(this.renderSquare(i));
        }
        return list;
    }

    renderSquare(i: SquareAddress) {
        const isHighlighted = this.state.highlights.includes(i);
        const isContradicting = this.state.contradicts.includes(i);
        const marks = i % 9 + 1 == 7 ? [i%1 as SquareValue, i%5+1 as SquareValue, i%3+1 as SquareValue, i%8+1 as SquareValue] : [];
        return <Square value={i % 9 + 1 as SquareValue}
        isPermanent={false} isHighlighted = {isHighlighted} isContradicting={isContradicting}
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
        if (this.props.markings && this.props.markings.length) {
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



export default App;
