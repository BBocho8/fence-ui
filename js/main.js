function loadComponent(path, targetId, callback) {
	fetch(path)
		.then((res) => {
			if (!res.ok) throw new Error(`Failed to load ${path}`);
			return res.text();
		})
		.then((html) => {
			const target = document.getElementById(targetId);
			if (!target) {
				console.warn(
					`Target element #${targetId} not found when loading ${path}`,
				);
				return;
			}
			target.innerHTML = html;
			if (callback) callback();
		})
		.catch((err) => {
			console.error(err);
		});
}

// Initial load
window.addEventListener("DOMContentLoaded", () => {
	loadComponent("components/sidebar.html", "sidebar", () => {
		inlineAllSidebarSvgs();

		// Set default tab
		const homeLink = document.querySelector('[data-tab="planungen-content"]');
		if (homeLink) homeLink.classList.add("active");
	});

	loadComponent("components/planungen-content.html", "main-content");
});

// Handle sidebar tab click
document.addEventListener("click", (e) => {
	const tabLink = e.target.closest("[data-sidebar-tab]");
	if (tabLink) {
		const tab = tabLink.getAttribute("data-sidebar-tab");

		// Remove active class from all sidebar links
		for (const el of document.querySelectorAll(".sidebar a")) {
			el.classList.remove("active");
		}
		tabLink.classList.add("active");

		if (tab === "planungen-content") {
			loadComponent("components/planungen-content.html", "main-content", () => {
				// Wait a tiny bit longer to ensure #planungen-tab-content is in the DOM
				setTimeout(() => {
					const tabContainer = document.getElementById("planungen-tab-content");
					if (tabContainer) {
						loadComponent(
							"components/planungen/ubersicht.html",
							"planungen-tab-content",
						);
					} else {
						console.warn(
							"#planungen-tab-content not found after loading main content",
						);
					}
				}, 50); // ~1 frame at 60fps
			});
		} else {
			const isStyleguide = tab === "styleguide";
			loadComponent(
				`components/${tab}.html`,
				"main-content",
				isStyleguide ? loadColors : null,
			);
		}
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

// Handle Öffnen button click
document.addEventListener("click", (e) => {
	const btn = e.target.closest(".planung-open-btn");
	if (btn) {
		const path = btn.getAttribute("data-path");
		if (path) {
			loadComponent(path, "main-content", () => {
				// Wait for the new DOM to be in place before loading tab content
				requestAnimationFrame(() => {
					loadComponent(
						"components/planungen/ubersicht.html",
						"planungen-tab-content",
					);
				});
			});
		}
	}
});

// Handle planungen detailed page tab click
document.addEventListener("click", (e) => {
	const tab = e.target.closest(".planungen-tabs-item");
	if (tab) {
		const selected = tab.getAttribute("data-tab");

		const container = document.getElementById("planungen-tab-content");
		if (!container) {
			console.warn(
				"Cannot load tab content: #planungen-tab-content is missing",
			);
			return;
		}

		// Toggle active
		for (const el of document.querySelectorAll(".planungen-tabs-item")) {
			el.classList.remove("active");
		}
		tab.classList.add("active");

		loadComponent(
			`components/planungen/${selected}.html`,
			"planungen-tab-content",
		);
	}
});
