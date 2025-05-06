export function loadComponent(path, targetId, callback) {
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
