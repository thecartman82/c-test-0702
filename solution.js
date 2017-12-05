const fetch = require('node-fetch');

const DEFAULT_URL = 'https://c-test-0701.glitch.me/data.txt';

function solution(url = DEFAULT_URL) {
	return fetch(url)
		.then(res => res.text())
		.then(generateReport)
		.catch(err => {
			console.error(err);
		});
}

function detectColumns(headerLine) {
	const columns = {};
	const columnOrder = ['productName', 'amount', 'price'];
	let inTxt = false;
	let lastEmpty = false;
	for (let i = 0; i < headerLine.length; i++) {
		if (headerLine[i] === ' ') {
			if (lastEmpty) {
				inTxt = false;
			}
			lastEmpty = true;
			continue;
		}
		lastEmpty = false;
		if (inTxt) {
			continue;
		}
		inTxt = true;

		const column = columnOrder.splice(0, 1)[0];
		if (column) {
			columns[column] = i;
		}
	}
	return columns;
}

function parseIntoTally(rawText) {
	let lines = rawText.split(/\r\n|\r|\n/g);
	const columns = detectColumns(lines[1]);
	lines.splice(0, 3);

	const tally = {};

	lines.forEach(line => {
		const op = line[0];
		
		const productName = line.slice(columns.productName, columns.amount).trim();
		
		const amountTxt = line.slice(columns.amount, columns.price);
		const amountMatch = /([0-9\.]+) ?(g|kg)/i.exec(amountTxt);
		let amount = Number(amountMatch[1]);
		if (amountMatch[2].toLowerCase() === 'kg') {
			amount *= 1000;
		}

		const price = Number(line.slice(columns.price + 1).trim());

		const key = productName.toLowerCase();
		const record = tally[key] || (tally[key] = {});
		if (!record.productName || record.productName.toLowerCase() === record.productName) {
			record.productName = productName;
		}

		const multiplier = op === 'S' ? -1 : 1;
		record.amount = (record.amount || 0) + multiplier * amount;
		record.balance = (record.balance || 0) - multiplier * ((price * amount) / 1000);
	});
	
	return tally;
}

function toSortedReportLines(tallyHash) {
	const lines = Object.keys(tallyHash).map(key => tallyHash[key]);
	lines.sort((a, b) => {
		return a.balance > b.balance ? -1 : 1;
	});
	return lines;
}

function pad(str, len, char = ' ') {
	if (str.length >= len) {
		return str;
	}

	return str + Array(len - str.length).join(char);
}

function reportLinesToText(reportLines) {
	const resultLines = [];
	resultLines.push(pad('Product name', 20) + pad('Final stock', 20) + 'Final balance');
	resultLines.push(pad('', 60, '='));
	reportLines.forEach(line => {
		resultLines.push(
			pad(line.productName, 20) +
			pad((line.amount / 1000).toFixed(2) + ' kg', 20) +
			(line.balance >= 0 ? '+ ' : '- ') +
			'$' +
			(Math.abs(line.balance)).toFixed(2)
		);
	});
	return resultLines.join('\r');
}

function generateReport(rawText) {
	const tally = parseIntoTally(rawText);
	const reportLines = toSortedReportLines(tally);
	const result = reportLinesToText(reportLines);
	return result;
}

module.exports = solution;

if (process && process.argv && process.argv[2] === 'run') {
	solution().then(res => console.log(res));
}
