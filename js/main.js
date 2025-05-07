import { initKarteViewSwitcher } from "./update-view.js";
import { loadComponent } from "./load-component.js";
import { loadColors } from "./load-colors.js";
import { inlineAllSidebarSvgs } from "./inline-svgs.js";

// Initial load
window.addEventListener("DOMContentLoaded", () => {
	loadComponent("components/sidebar.html", "sidebar", () => {
		inlineAllSidebarSvgs();

		const homeLink = document.querySelector(
			'[data-sidebar-tab="sperrobjekte-content"]',
		);
		if (homeLink) homeLink.classList.add("active");
	});

	loadComponent("components/sperrobjekte-content.html", "main-content", () => {
		handleSperrobjekteTabClick("geplant");
	});
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

		if (tab === "karte-content") {
			document.body.classList.add("karte-active");

			loadComponent("components/karte-content.html", "main-content", () => {
				initKarteViewSwitcher(); // ✅ re-initialize logic after every load
			});
		} else if (tab === "planungen-content") {
			document.body.classList.remove("karte-active");

			loadComponent("components/planungen-content.html", "main-content", () => {
				const observer = new MutationObserver((mutations, obs) => {
					const tabContainer = document.getElementById("planungen-tab-content");
					if (tabContainer) {
						loadComponent(
							"components/planungen/ubersicht.html",
							"planungen-tab-content",
						);
						obs.disconnect();
					}
				});
				observer.observe(document.getElementById("main-content"), {
					childList: true,
					subtree: true,
				});
			});
		} else if (tab === "sperrobjekte-content") {
			document.body.classList.remove("karte-active");

			loadComponent(
				"components/sperrobjekte-content.html",
				"main-content",
				() => {
					// ✅ Auto-load the default table again
					handleSperrobjekteTabClick("geplant");
				},
			);
		} else {
			document.body.classList.remove("karte-active");

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

const sperrTabMap = {
	geplant: "components/sperrobjekte/tables/geplant.html",
	erkBeauftragt: "components/sperrobjekte/tables/erk-beauftragt.html",
	erkAbgeschlossen: "components/sperrobjekte/tables/erk-abgeschlossen.html",
	freigegeben: "components/sperrobjekte/tables/freigegeben.html",
	sperrenlegungen: "components/sperrobjekte/tables/sperrenlegungen.html",
};

function handleSperrobjekteTabClick(tabKey) {
	const container = document.getElementById("sperrobjekte-table-container");
	if (!container) {
		console.warn("Missing container #sperrobjekte-table-container");
		return;
	}
	const path = sperrTabMap[tabKey];
	if (!path) return;
	loadComponent(path, "sperrobjekte-table-container");
}

document.addEventListener("click", (e) => {
	const tab = e.target.closest("[data-sperr-tab]");
	if (tab) {
		// Toggle active
		for (const el of document.querySelectorAll("[data-sperr-tab]")) {
			el.classList.remove("active");
		}
		tab.classList.add("active");

		handleSperrobjekteTabClick(tab.getAttribute("data-sperr-tab"));
	}
});

// Optional: auto-load default tab on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
	if (document.querySelector(`[data-sperr-tab="geplant"]`)) {
		handleSperrobjekteTabClick("geplant");
	}
});
