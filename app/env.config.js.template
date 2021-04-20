window.envConfig = {
	AUTO_PAGE_REFRESH_INTERVAL: 30000
}

window.getEnvConfig = function(key) {
	var envConfig = window['envConfig'];
	if (envConfig[key]) {
		if (typeof envConfig[key] !== 'string' && envConfig[key].length === 0) {
			return null;
		} else if (typeof envConfig[key] === 'string' && envConfig[key] === '') {
			return null;
		} else {
			return envConfig[key];
		}
	}
	return null;
}
