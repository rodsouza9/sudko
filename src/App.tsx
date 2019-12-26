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
}

class Board extends React.Component<{}, BoardState> {
    state: BoardState = {
        highlights: [37],
    };
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
        const isContradicting = i%9==8;
        return <Square value={i % 9 + 1 as SquareValue} isPermanent={false} isHighlighted = {isHighlighted} isContradicting={isContradicting} markings={[]} />;
    }
}

interface SquareProps {
    isPermanent : boolean;
    isHighlighted : boolean;
    isContradicting : boolean;
    value : SquareValue | null;
    markings: SquareValue[];
}

type SquareValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

class Square extends React.Component<SquareProps, {}> {
    render() {
        if (this.props.isHighlighted) {
            return(<div className="square highlight">{this.props.value}</div>);
        }
        else if (this.props.isContradicting) {
            return(<div className="square contradict">{this.props.value}</div>);
        }
        return(
            <div className="square">{this.props.value}</div>
        );
    }
}



export default App;
