/*global require, module*/
'use strict';

var AppHeader = require('./src/js/AppHeader');

var instance;

var getOrCreateInstance = function () {
	if (!instance) {
		instance = new AppHeader(arguments);
	}

	return instance;
};

var construct = function () {
	getOrCreateInstance();
	document.removeEventListener('o.DOMContentLoaded', construct);
};

document.addEventListener('o.DOMContentLoaded', construct);

module.exports = function () {
	return getOrCreateInstance.apply(null, arguments);
};

module.exports.init = AppHeader.init;
