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
					position: null,
					historyStepNumber: 0
				}
			],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
			playerPicked: false,
			xFirst: true
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
			history: history.concat([
				{ squares, position: helpers.formatPosition(i), historyStepNumber: history.length }
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			playerPicked: true
		});
	};

	// set state to corresponding step
	jumpTo = step => {
		this.setState({
			stepNumber: step,
			xIsNext: this.state.xFirst
				? this.state.history[step].historyStepNumber % 2 === 0 ? true : false
				: this.state.history[step].historyStepNumber % 2 === 0 ? false : true
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
					position: null,
					historyStepNumber: 0
				}
			],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
			playerPicked: false,
			xFirst: true
		});
	};

	// select to be X or O
	handlePlayerSelect = pickedX => {
		this.setState({
			xIsNext: pickedX,
			playerPicked: true,
			xFirst: pickedX
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
				borderBottom: '2px #e36209 solid'
			};

			// directs to corresponding move
			const desc = move ? 'Move ' + move : 'Game start';
			return (
				<li key={move}>
					<button
						className={move === 0 ? 'move start' : 'move'}
						style={move === this.state.stepNumber ? style : undefined}
						onClick={() => this.jumpTo(move)}
					>
						<span>{desc}</span>
					</button>
					<span style={{ paddingLeft: '10px' }}>{step.position}</span>
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
					<Board squares={current.squares} onClick={this.handleClick} winner={winner ? winner : undefined} />
				</div>
				<div className="game-info">
					<div>{status}</div>

					<div>
						<button
							className="player"
							style={this.state.playerPicked ? { display: 'none' } : undefined}
							onClick={() => this.handlePlayerSelect(true)}
						>
							Be X
						</button>

						<button
							className="player"
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
						{showResetBtn ? (
							<button className="restartBtn" onClick={this.handleReset}>
								Restart
							</button>
						) : (
							undefined
						)}
					</div>
				</div>
			</div>
		);
	}
}

// ========================================
export default Game;
