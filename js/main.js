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
		// Inline all SVG icons
		inlineAllSidebarSvgs();

		// Set initial active tab to wiki-content
		const homeLink = document.querySelector('[data-tab="wiki-content"]');
		if (homeLink) homeLink.classList.add("active");
	});

	loadComponent("components/wiki-content.html", "main-content");
});

// Handle tab click (sidebar)
document.addEventListener("click", (e) => {
	const tabLink = e.target.closest("[data-tab]");
	if (tabLink) {
		const tab = tabLink.getAttribute("data-tab");

		// Remove active class from all sidebar links
		for (const el of document.querySelectorAll(".sidebar a")) {
			el.classList.remove("active");
		}

		// Add active class to clicked link
		tabLink.classList.add("active");

		const isStyleguide = tab === "styleguide";
		loadComponent(
			`components/${tab}.html`,
			"main-content",
			isStyleguide ? loadColors : null,
		);
	}
});

// Handle tabs toggle inside content
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

function inlineAllSidebarSvgs() {
	const icons = document.querySelectorAll('.sidebar-item img[src$=".svg"]');
	for (const img of icons) {
		fetch(img.src)
			.then((res) => res.text())
			.then((svgText) => {
				const wrapper = document.createElement("div");
				wrapper.innerHTML = svgText;
				const svg = wrapper.querySelector("svg");
				if (!svg) return;

				svg.classList.add("sidebar-icon");
				svg.setAttribute("width", "43");
				svg.setAttribute("height", "43");
				svg.setAttribute("fill", "currentColor");

				img.replaceWith(svg);
			})
			.catch((err) => {
				console.warn("Failed to inline SVG:", img.src, err);
			});
	}
}
