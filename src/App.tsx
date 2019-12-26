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
        return(
            <div className="square">{this.props.value}</div>
        );
    }
}

class Board extends React.Component<{}, {}> {
    render() {
        return(
            <div className="board">{this.renderSquares()}</div>
        );
    }
    renderSquares() {
        let list = [];
        for (var i = 0; i < 81; i++) {
            list.push(<Square value={i % 9 + 1 as SquareValue} isPermanent={false} isHighlighted = {false} isContradicting={false} markings={[]} />);
        }
        return list;
    }
}

export default App;
