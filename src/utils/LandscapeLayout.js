const adjustPlayerSize = (instance) => {
	const dom = instance.ref;
	if (dom.offsetWidth <= 650) {
		dom.setAttribute('responsive', '650px');
		return;
	}
	dom.removeAttribute('responsive');
};

export const LandscapeLayoutConstructor = () => {
	window.MUSE.registerMiddleware('onPlayerResize', adjustPlayerSize);
};