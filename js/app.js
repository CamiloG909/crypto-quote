const header = document.querySelector(".header");
const form = document.querySelector("#search-crypto");

class SearchCryptocurrency {
	constructor(currency, cryptocurrency) {
		this.currency = currency;
		this.cryptocurrency = cryptocurrency;
	}
}

eventListeners();

function eventListeners() {
	header.addEventListener("click", () => window.location.reload());
	getCryptocurrencies();
	form.addEventListener("submit", validateForm);
}

function getCryptocurrencies() {
	const cryptocurrencysSelect = document.querySelector("#cryptocurrencys");
	const URL =
		"https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			data.Data.forEach((currency) => {
				// Create options in select
				const option = document.createElement("option");
				option.value = currency.CoinInfo.Name;
				option.textContent = currency.CoinInfo.FullName;
				cryptocurrencysSelect.appendChild(option);
			});
		})
		.catch((err) => console.log(err));
}

function validateForm(e) {
	e.preventDefault();

	const data = new FormData(form);

	const cryptoSearch = new SearchCryptocurrency(
		data.get("currency"),
		data.get("cryptocurrency")
	);

	// Validate form
	if (
		cryptoSearch.cryptocurrency === null ||
		cryptoSearch.currency === null ||
		cryptoSearch.cryptocurrency === "" ||
		cryptoSearch.currency === ""
	)
		return showMessage("Please fill all the fields");

	searchCryptocurrency(cryptoSearch);
}

function showMessage(message, type = "error") {
	const div = document.createElement("div");
	div.className = "message";
	if (type === "success") {
		div.innerHTML = `
	<i class="bi bi-check-circle-fill --success"></i>
	${message}`;
	} else {
		div.innerHTML = `
	<i class="bi bi-x-circle-fill"></i>
	${message}`;
	}

	document.body.appendChild(div);
	setTimeout(() => {
		div.style.transform = "translateY(0)";
	}, 100);

	// Hidden message
	setTimeout(() => {
		div.style.transform = "translateY(-55px)";
		setTimeout(() => {
			div.remove();
		}, 100);
	}, 1500);
}

function searchCryptocurrency({ currency, cryptocurrency }) {
	const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

	showLoader();

	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			showData(data.DISPLAY[cryptocurrency][currency]);
			showMessage("Data loaded successfully", "success");
		})
		.catch((err) => console.log(err));
}

function showData({ PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE }) {
	const container = document.querySelector("#quote-crypt__data");
	container.innerHTML = "";

	const textPrice = document.createElement("p");
	textPrice.className = "quote-crypt__text --title";
	textPrice.innerHTML = `The price is: <span class="quote-crypt__text-bold">${PRICE}</span>`;
	container.appendChild(textPrice);

	const textHighest = document.createElement("p");
	textHighest.className = "quote-crypt__text";
	textHighest.innerHTML = `Highest price of the day: <span class="quote-crypt__text-bold">${HIGHDAY}</span>`;
	container.appendChild(textHighest);

	const textLowest = document.createElement("p");
	textLowest.className = "quote-crypt__text";
	textLowest.innerHTML = `Lowest price of the day: <span class="quote-crypt__text-bold">${LOWDAY}</span>`;
	container.appendChild(textLowest);

	const textVariation = document.createElement("p");
	textVariation.className = "quote-crypt__text";
	textVariation.innerHTML = `Variation last 24 hours: <span class="quote-crypt__text-bold">${CHANGEPCT24HOUR}</span>`;
	container.appendChild(textVariation);

	const textUpdate = document.createElement("p");
	textUpdate.className = "quote-crypt__text";
	textUpdate.innerHTML = `Last update: <span class="quote-crypt__text-bold">${LASTUPDATE}</span>`;
	container.appendChild(textUpdate);
}

function showLoader() {
	const container = document.querySelector("#quote-crypt__data");
	container.innerHTML = "";

	const spinner = document.createElement("div");
	spinner.className = "sk-chase-center";
	spinner.innerHTML = `
	<div class="sk-chase">
	<div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div></div>`;

	container.appendChild(spinner);
}
