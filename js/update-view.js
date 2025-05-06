export function initKarteViewSwitcher() {
	const bgViews = [
		{ label: "Taktische Karte", bg: "url('/assets/karte.png')" },
		{ label: "Sperrvorschlag", bg: "url('/assets/karte2.png')" },
	];

	let currentBgIndex = 0;

	const layout = document.querySelector(".layout");
	const label = document.getElementById("karte-label");
	const leftBtn = document.getElementById("karte-left");
	const rightBtn = document.getElementById("karte-right");

	if (!layout || !label || !leftBtn || !rightBtn) {
		console.warn("Karte DOM elements not found");
		return;
	}

	function updateBackgroundView() {
		const view = bgViews[currentBgIndex];
		layout.style.backgroundImage = view.bg;
		label.textContent = view.label;

		leftBtn.style.opacity = currentBgIndex === 0 ? "0.3" : "1";
		leftBtn.style.pointerEvents = currentBgIndex === 0 ? "none" : "auto";

		rightBtn.style.opacity =
			currentBgIndex === bgViews.length - 1 ? "0.3" : "1";
		rightBtn.style.pointerEvents =
			currentBgIndex === bgViews.length - 1 ? "none" : "auto";
	}

	leftBtn.addEventListener("click", () => {
		if (currentBgIndex > 0) {
			currentBgIndex--;
			updateBackgroundView();
		}
	});

	rightBtn.addEventListener("click", () => {
		if (currentBgIndex < bgViews.length - 1) {
			currentBgIndex++;
			updateBackgroundView();
		}
	});

	updateBackgroundView();
}
