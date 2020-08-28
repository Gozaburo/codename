const xlsxFile = require('read-excel-file/node');
const {shuffle} = require('underscore');
class Word {
	constructor({word,team,row,col,guessed = false}) {
		this.word = word;
		this.team = team;
		this.row = row;
		this.col = col;
		this.guessed = guessed;
	}
}
module.exports = async function() {
	const arr = [];
	const table1 = await xlsxFile('./words/Wordlist.xlsx', {sheet: 1});
	table1.forEach(row => {
		row.forEach(word => {
			if (word && !word.includes(' ')) arr.push(word.toUpperCase());
		});
	});
	const table2 = await xlsxFile('./words/Wordlist.xlsx', {sheet: 2});
	table2.forEach(row => {
		row.forEach(word => {
			if (word && !word.includes(' ')) arr.push(word.toUpperCase());
		});
	});
	const chosenIndices = new Set();
	while (chosenIndices.size < 25) chosenIndices.add(Math.floor(Math.random()*arr.length));
	const list = shuffle(Array.from(chosenIndices));
	const Board = []
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			const chosenWord = arr[list.pop()];
			const boardWord = new Word({word: chosenWord, row: i, col: j});
			Board.push(boardWord);
		}
	}
	const shuffledBoard = shuffle(Board);
	const numRedWords = 8 + Math.round(Math.random());
	let i = 0;
	for (i; i < numRedWords; i++) {
		shuffledBoard[i].team = 'RED';
	}
	for (i; i < 17; i++) {
		shuffledBoard[i].team = 'BLUE';
	}
	for (i; i < 24; i++) {
		shuffledBoard[i].team = 'CIV';
	}
	shuffledBoard[i].team = 'ASSASSIN';
	return shuffledBoard;
}