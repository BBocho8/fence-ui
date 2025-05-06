export function inlineAllSidebarSvgs() {
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
