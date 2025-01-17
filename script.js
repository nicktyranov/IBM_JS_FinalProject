let database = [];
function updateCurrentTime() {
	const currentTimeElement = document.getElementById('currentTime');
	if (currentTimeElement) {
		const now = new Date();
		currentTimeElement.textContent = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		}).format(now);
	}
}

updateCurrentTime();

setInterval(updateCurrentTime, 1000);

const dataRequest = fetch('./data.json')
	.then((res) => res.json())
	.then((data) => {
		database = data;
		console.log('Data loaded:', database);
	})
	.catch((e) => console.log(`error: ${e.message}`));

let input = document.getElementById('input').addEventListener('input', (e) =>
	setTimeout(() => {
		search(e.target.value);
	}, 1000),
);

function search(string) {
	if (string !== 'beach' && string !== 'temple') {
		getGEO(string);
		console.log(`got string: ${string}`);
		if (database.length > 0) {
			const results = database.filter((item) =>
				item.name.toLowerCase().includes(string.toLowerCase()),
			);
			console.log('Search results:', results);
			if (results.length > 0) {
				const cardsContainer = document.querySelector('.cards');
				cardsContainer.innerHTML = '';

				results.forEach((card) => {
					const cardElement = createCard(card);
					cardsContainer.appendChild(cardElement);
				});
			}
		} else {
			console.log('Database is not loaded yet.');
		}
	} else {
		console.log(`got string: ${string}`);
		if (database.length > 0) {
			const results = database.filter((item) =>
				item.qwerySearch.toLowerCase().includes(string.toLowerCase()),
			);
			console.log('Search results:', results);
			if (results) {
				const cardsContainer = document.querySelector('.cards');
				cardsContainer.innerHTML = '';

				results.forEach((card) => {
					const cardElement = createCard(card);
					cardsContainer.appendChild(cardElement);
				});
			}
		} else {
			console.log('Database is not loaded yet.');
		}
	}
}

async function getGEO(string) {
	if (!string) {
		return;
	}

	if (string.length <= 1) {
		return;
	}
	let rez;
	setTimeout(async () => {
		try {
			rez = await fetch(
				`https://geocode.maps.co/search?q=${string}&api_key=678a9a042ff61086762475yobd39ee2`,
			);
			rez = await rez.json();
			console.log(rez);

			if ('lat' in rez[0] && 'lon' in rez[0]) {
				let time = await getTime(rez[0].lat, rez[0].lon);
			}
		} catch (e) {
			console.log('Error:' + e.message);
		}
	}, 1500);
}

async function getTime(lat, lon) {
	console.log('getTime started');
	let rez;

	try {
		rez = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`);
		console.log('getTime fetch');
		rez = await rez.json();
		console.log('getTime json');
		console.log(rez);
		if (rez && 'currentLocalTime' in rez) {
			console.log(rez);
			const time = document.getElementById('time');
			let text = `Current Local Time (${rez.timeZone}): ${new Intl.DateTimeFormat('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
			}).format(new Date(rez.currentLocalTime))}`;
			time.textContent = text;
		}
	} catch (e) {
		console.log('Error:' + e.message);
	}
}

function createCard(card) {
	const mainDiv = document.createElement('div');
	mainDiv.className = 'card';

	const imgDiv = document.createElement('div');
	const img = document.createElement('img');
	img.setAttribute('src', card.img);
	img.setAttribute('alt', card.name);

	const cardTextDiv = document.createElement('div');
	cardTextDiv.className = 'card-text';
	const h2 = document.createElement('h2');
	h2.textContent = card.name;
	const p = document.createElement('p');
	p.classList.add('text-justify');
	p.textContent = card.description;

	const btn = document.createElement('button');
	btn.textContent = 'visit';

	mainDiv.appendChild(imgDiv);
	imgDiv.appendChild(img);

	mainDiv.appendChild(cardTextDiv);
	cardTextDiv.appendChild(h2);
	cardTextDiv.appendChild(p);
	cardTextDiv.appendChild(btn);

	return mainDiv;
}

const searchButton = document.getElementById('search').addEventListener('click', search(input));

const clearButton = document.getElementById('clear').addEventListener('click', () => {
	const input = (document.getElementById('input').value = '');
});
