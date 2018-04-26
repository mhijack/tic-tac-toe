import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ================== TODO ==================
// ! click to change square display
// ! alternate X and O
// determine winning player

// ================== Components ==================
// Square component
const Square = props => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.square}
    </button>
  );
}

// Board component holding 9 squares
class Board extends Component {
  renderSquare = i => {
    return (<Square
      square={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Game component
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  // 1: changes square to X; 2: flips player when clicked
  handleClick = i => {
    // get a copy of current entry
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // if we have a winner or clicked on an occupied square, return early
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // sets display of corresponding square
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // set state to corresponding step
  jumpTo = step => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    // get all history
    const history = this.state.history;
    // get latest entry
    const current = history[this.state.stepNumber];

    // display history
    const moves = history.map((step, move) => {
      // directs to corresponding move
      const desc = move ?
        'Go to move # ' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // check winner
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ================== helper functions ==================
// determine winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // returns winner symbol if winner is decided
      return squares[a];
    }
  }
  // no winner
  return null;
}