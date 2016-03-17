(function () {

	var loaded = 0;
	var bootstrap = function () {
		if (loaded === 1) return;
		loaded = 1;
		console.log('dom ready!');
		//var main = 
	};

	if (document.readyState === 'complete') {
		setTimeout(bootstrap);
	} else {
		document.addEventListener('DOMContentLoaded', bootstrap, false);
		window.addEventListener('load', bootstrap, false);
	}
})();