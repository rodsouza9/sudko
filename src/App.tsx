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

    toggleSelectSquare(i: SquareAddress) {
        this.setState( {
            ...this.state,
            highlights: [i],
            }
        );
    }

    render() {
        return(
            <div className="board">{this.renderSquares()}</div>
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
        return <Square value={i % 9 + 1 as SquareValue}
        isPermanent={false} isHighlighted = {isHighlighted} isContradicting={isContradicting}
        markings={[]} onClick={()=>{ this.toggleSelectSquare(i)}}/>;
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
    render() {
        let light : string = this.props.isHighlighted ? "highlight" : (this.props.isContradicting ? "contradict" : "");
        return(
            <div className={"square "+light} onClick={this.props.onClick}>{this.props.value}</div>
        );
    }
}



export default App;
