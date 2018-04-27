import React from 'react';

// Square component
const Square = props => {
	return (
		<button className="square" onClick={props.onClick} style={props.style}>
			{props.square}
		</button>
	);
};

export default Square;