import React from 'react';
import ReactDOM from 'react-dom';
import helpers from '../helpers/helpers';
import Board from './Board';

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
// ! allow user to pick to be  X or O
// allow play against computer

// ================== React.React.Components ==================
// Game Component
class Game extends React.Component {
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
		if (helpers.calculateWinner(squares) || squares[i]) {
			return;
		}

		// sets display of corresponding square
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{ squares, position: helpers.formatPosition(i) }]),
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
		const winner = helpers.calculateWinner(current.squares);
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
export default Game;

