const Chance = require('chance');
const chance = new Chance();
const rightPad = require('rightpad');

const FRUITS = [
	{name: 'Banana', basePrice: 10},
	{name: 'Orange', basePrice: 12},
	{name: 'Pear', basePrice: 9},
	{name: 'Apple (green)', basePrice: 6},
	{name: 'Apple (red)', basePrice: 4},
	{name: 'Pineapple', basePrice: 29},
	{name: 'Watermelon', basePrice: 15},
];

const HEADER = `
  Product name        Amount         Price (per kg)
========================================================
`;

function generate(count) {
	if (!count) {
		return '';
	}

	const tally = {};
	const ledger = [];
	const lines = [];
	
	for (let i = 0; i < count; i++) {
		const fruit = chance.pick(FRUITS);
		const current = tally[fruit.name];
		let op = 1;
		if (current && chance.d100() > 10) {
			op = -1;
		}
	
		let amount;
		if (op === 1) {
			amount = chance.integer({min: 1000, max: 20000});
		} else {
			amount = chance.integer({min: 100, max: 2000});
		}
	
		if (op === -1 && current && current - amount < 0) {
			op = 1;
		}
	
		tally[fruit.name] = (tally[fruit.name] || 0) + op * amount;
	
		const delta = op === 1
			? chance.floating({min: fruit.basePrice * 0.6, max: fruit.basePrice * 1.1})
			: chance.floating({min: fruit.basePrice * 0.9, max: fruit.basePrice * 1.4});
		
		let price = fruit.basePrice + delta;
		if (chance.d10() > 9) {
			price = Math.floor(price);
		}
		else if (chance.d10() > 7) {
			price = price.toFixed(1);
		}
		else {
			price = price.toFixed(2);
		}
	
		price = ((chance.d10() > 8) ? '$ ' : '$') + price;
	
		if (amount > 500 && chance.d10() > 5) {
			amount = (amount / 1000) + (chance.bool() ? 'kg' : ' kg');
		} else {
			amount = amount + (chance.bool() ? 'g' : ' g');
		}
	
		let name = fruit.name;
		if (chance.d10() > 8) {
			name = name.toLowerCase();
		}
	
		lines.push((op > 0 ? 'P ' : 'S ') + rightPad(name, 20) + rightPad(amount, 15) + rightPad(price));
	}

	return HEADER + lines.join('\n');
}

module.exports = generate;