import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';

import './index.css';

// ================== TODO ==================
// ! click to change square display
// ! alternate X and O
// ! determine winning player
// ! Display the location for each move in the format (col, row) in the move history list.
// ! Bold the currently selected item in the move list.
// ! Rewrite Board to use two loops to make the squares instead of hardcoding them.
// ! Add a toggle button that lets you sort the moves in either ascending or descending order.
// ! When someone wins, highlight the three squares that caused the win.
// ! When no one wins, display a message about the result being a draw.
// allow user to pick to be  X or O
// allow play against computer

// ================== Components ==================
// Game component
class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					// remember which position is placed
					position: null
				}
			],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
			playerPicked: false
		};
	}

	// 1: change square to X; 2: flip player when clicked
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
			history: history.concat([{ squares, position: formatPosition(i) }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			playerPicked: true
		});
	};

	// set state to corresponding step
	jumpTo = step => {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});
	};

	// reverse this.state.history
	handleSort = () => {
		const ascending = this.state.ascending;
		this.setState({ ascending: !ascending });
	};

	// restart game: resets all states to initial state
	handleReset = () => {
		this.setState({
			history: [
				{
					squares: Array(9).fill(null),
					// remember which position is placed
					position: null
				}
			],
			stepNumber: 0,
			xIsNext: true,
      ascending: true,
      playerPicked: false
		});
	};

	// select to be X or O
	handlePlayerSelect = pickedX => {
		this.setState({
			xIsNext: pickedX,
			playerPicked: true
		});
	};

	render() {
		// get all history
		const history = this.state.history;
		// get latest entry
		const current = history[this.state.stepNumber];

		// display history
		const moves = history.map((step, move) => {
			// apply style conditionally to highlight current entry
			let style = {
				color: 'red',
				fontWeight: 'bold'
			};

			// directs to corresponding move
			const desc = move ? 'Move # ' + move : 'Game start';
			return (
				<li key={move}>
					<button
						style={move === this.state.stepNumber ? style : undefined}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
					{step.position}
				</li>
			);
		});

		// check winner
		const winner = calculateWinner(current.squares);
		let status;
		let isDraw = !winner && this.state.stepNumber === 9;
		let showResetBtn = isDraw || winner;
		// if draw
		if (isDraw) {
			// use this.state.stepNumber to check for draw
			status = "It's a tie!";
		} else if (winner) {
			status = 'Winner: ' + winner.winner;
			console.log(winner.winningPos);
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
						winner={winner ? winner : undefined}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button
						style={this.state.playerPicked ? { display: 'none' } : undefined}
						onClick={() => this.handlePlayerSelect(true)}
					>
						Be X
					</button>
					<button
						style={this.state.playerPicked ? { display: 'none' } : undefined}
						onClick={() => this.handlePlayerSelect(false)}
					>
						Be O
					</button>
          <br />
					<button onClick={this.handleSort}>
						{this.state.ascending ? 'Ascending Order' : 'Descending Order'}
					</button>

					{this.state.ascending ? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>}
					{showResetBtn ? <button onClick={this.handleReset}>Restart</button> : undefined}
				</div>
			</div>
		);
	}
}

// ========================================
ReactDOM.render(<Game />, document.getElementById('root'));

// ================== helper functions ==================
// determine winner
function calculateWinner(squares) {
	const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			// returns winner symbol & winning position if winner is decided
			return {
				winner: squares[a],
				winningPos: lines[i]
			};
		}
	}
	// no winner
	return null;
}

// form position string
function formatPosition(index) {
	let x;
	const y = index % 3;
	if (index <= 2 && index >= 0) {
		x = 0;
	} else if (index <= 5 && index >= 3) {
		x = 1;
	} else if (index <= 8 && index >= 6) {
		x = 2;
	}
	return `(${y} : ${x})`;
}
