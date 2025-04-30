function loadComponent(path, targetId, callback) {
	fetch(path)
		.then((res) => res.text())
		.then((html) => {
			document.getElementById(targetId).innerHTML = html;
			if (callback) callback();
		});
}

// Initial load
window.addEventListener("DOMContentLoaded", () => {
	loadComponent("components/sidebar.html", "sidebar", () => {
		// Wait for sidebar to be loaded, then set Home as active
		const homeLink = document.querySelector('[data-tab="content1"]');
		if (homeLink) homeLink.classList.add("active");
	});

	loadComponent("components/content1.html", "main-content");
});

// Handle tab click (sidebar)
document.addEventListener("click", (e) => {
	if (e.target.matches("[data-tab]")) {
		const tab = e.target.getAttribute("data-tab");

		// Remove active class from all sidebar links
		for (const el of document.querySelectorAll(".sidebar a")) {
			el.classList.remove("active");
		}

		// Add active class to clicked link
		e.target.classList.add("active");

		const isStyleguide = tab === "styleguide";
		loadComponent(
			`components/${tab}.html`,
			"main-content",
			isStyleguide ? loadColors : null,
		);
	}
});

// Handle tabs toggle
document.addEventListener("click", (e) => {
	if (e.target.closest(".tab-item")) {
		for (const tab of document.querySelectorAll(".tab-item")) {
			tab.classList.remove("active");
		}
		e.target.closest(".tab-item").classList.add("active");
	}
});

// Color block generator (called after styleguide is loaded)
function loadColors() {
	const colors = [
		{ name: "Primary", var: "--color-primary", hex: "#042130" },
		{ name: "Secondary", var: "--color-secondary", hex: "#38F09A" },
		{ name: "White", var: "--color-white", hex: "#FFFFFF" },
		{ name: "Warning", var: "--color-warning", hex: "#F0ED38" },
		{ name: "Error", var: "--color-error", hex: "#FD0000" },
	];

	const container = document.getElementById("color-palette");
	if (!container) return;

	container.innerHTML = "";
	for (const color of colors) {
		const div = document.createElement("div");
		div.className = "color-sample";
		div.innerHTML = `
      <div class="color-box" style="background-color: var(${color.var}); "></div>
      <h6>${color.name}</h6>
      <h6>${color.hex}</h6>
    `;
		container.appendChild(div);
	}
}
