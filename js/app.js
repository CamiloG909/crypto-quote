const header = document.querySelector(".header");

eventListeners();

function eventListeners() {
	header.addEventListener("click", () => window.location.reload());
}
