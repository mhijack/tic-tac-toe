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

export default {
  calculateWinner,
  formatPosition
}