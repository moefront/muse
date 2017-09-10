const adjustPlayerSize = (instance) => {
	const dom = instance.ref;

	if (!dom.classList.contains('muse-layout-landscape')) {
		return;
	}

	if (dom.offsetWidth <= 650) {
		dom.setAttribute('responsive', '650px');
		return;
	}
	dom.removeAttribute('responsive');
};

export const construct = () => {
	window.MUSE.registerMiddleware('onPlayerResize', adjustPlayerSize);
};
