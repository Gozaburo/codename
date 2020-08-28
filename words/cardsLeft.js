const {Board} = require('../commands/codenames');
module.exports = {
	red() {
		let redCards = 0;
		Board.forEach(word => {
			if (word.team === 'RED') {
				redCards += 1;
			}
		});
		return redCards;
	},
	blue() {
		let blueCards = 0;
		Board.forEach(word => {
			if (word.team === 'BLUE') {
				blueCards += 1;
			}
		});
		return blueCards;
	},
	redLeft() {
		let redCards = 0;
		Board.forEach(word => {
			if (word.team === 'RED' && !word.guessed) {
				redCards += 1;
			}
		});
		return redCards;
	},
	blueLeft() {
		let blueCards = 0;
		Board.forEach(word => {
			if (word.team === 'BLUE' && !word.guessed) {
				blueCards += 1;
			}
		});
		return blueCards;
	},
}