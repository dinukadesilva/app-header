/*global require, module*/
'use strict';

var AppHeader = require('./src/js/AppHeader');

var instance;

var getOrCreateInstance = function (element, options) {
	if (!instance) {
		instance = new AppHeader(element, options);
	}

	return instance;
};

var construct = function () {
	getOrCreateInstance();
	document.removeEventListener('o.DOMContentLoaded', construct);
};

document.addEventListener('o.DOMContentLoaded', construct);

module.exports = function (element, options) {
	return getOrCreateInstance(element, options);
};

module.exports.init = AppHeader.init;
