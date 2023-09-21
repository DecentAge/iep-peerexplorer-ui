window.envConfig = {
    RELEASE_VERSION: '',
    
    NETWORK_ENVIRONMENT: 'devnet',

	AUTO_PAGE_REFRESH_INTERVAL: 30000,
	CONSTANTS_REFRESH_INTERVAL: 60000,
	PEER_EXPLORER_API_URL: 'http://node-1/peerexplorer-backend/'
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
