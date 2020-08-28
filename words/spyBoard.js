const gap = 40;
const width = 336;
const height = 168;
const Canvas = require('canvas');
const teamToColor = {'RED':'#FF7C7C','BLUE':'#7CD3FF','CIV':'#D9D976','ASSASSIN':'#B4B4B4'}
module.exports = async Board => {
	const canvas = Canvas.createCanvas(1920,1080);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,1920,1080);
	Board.forEach(word => {
		ctx.font = 'bold 40px serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		let topLeftX = word.col * (width+gap);
		let topLeftY = word.row * (height+gap);
		ctx.strokeStyle = 'black';
		ctx.fillStyle = teamToColor[word.team];
		ctx.rect(topLeftX+gap,topLeftY+gap,width,height);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.fillStyle = 'black';
		ctx.fillText(word.word,topLeftX+gap+width/2,topLeftY+gap+height/2, width);
		if (word.guessed) {
			ctx.font = 'bold 30px serif';
			ctx.textBaseline = 'bottom';
			ctx.fillText('Guessed',topLeftX+gap+width/2,topLeftY+gap+height-10);
		}
		ctx.beginPath();

	});
	return canvas.toBuffer();
}