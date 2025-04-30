function loadComponent(path, targetId) {
	fetch(path)
		.then((res) => res.text())
		.then((html) => {
			document.getElementById(targetId).innerHTML = html;
		});
}

// Initial load
window.addEventListener("DOMContentLoaded", () => {
	loadComponent("components/sidebar.html", "sidebar");
	loadComponent("components/content1.html", "main-content");
});

// Handle tab click
document.addEventListener("click", (e) => {
	if (e.target.matches("[data-tab]")) {
		const tab = e.target.getAttribute("data-tab");
		loadComponent(`components/${tab}.html`, "main-content");
	}
});
