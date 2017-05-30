/**
 * Apply player middleware via different hooks
 * @param  {String} hook
 * @return {Mixed}
 */
export const applyMiddleware = (hook, instance, props = {}) => {
	if (window.MUSE == undefined) {
		return;
	}

	if (window.MUSE._middlewares[hook] == []) {
		return;
	}

	window.MUSE._middlewares[hook].forEach(middleware => {
		(middleware)(instance, props);
	});
};

export default applyMiddleware;
