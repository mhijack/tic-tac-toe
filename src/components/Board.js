import React from 'react';
import Square from './Square';
// Board Component holding 9 squares
class Board extends React.Component {
	renderSquare = i => {
		// determine winner or not: if so, pass in style object
		const winner = this.props.winner;
		let winningPos = winner ? winner.winningPos : [];

		return (
			<Square
				key={i}
				square={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				style={winningPos.indexOf(i) !== -1 ? { color: 'red' } : undefined}
			/>
		);
	};

	render() {
		let rows = [];
		let cells = [];
		let cellNum = 0;

		for (let row = 0; row < 3; row += 1) {
			for (let cell = 0; cell < 3; cell += 1) {
				cells.push(this.renderSquare(cellNum));
				cellNum += 1;
			}
			rows.push(
				<div className="board-row" key={row}>
					{cells}
				</div>
			);
			cells = [];
		}

		return <div>{rows}</div>;
	}
}

export default Board;
