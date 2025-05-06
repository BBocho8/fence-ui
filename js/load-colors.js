// Color block generator (called after styleguide is loaded)
export function loadColors() {
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
