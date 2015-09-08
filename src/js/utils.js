'use strict';

exports.dispatchEvent = function(element, name, data) {
	if (document.createEvent && element.dispatchEvent) {
		var event = document.createEvent('Event');
		event.initEvent(name, true, true);

		if (data) {
			event.detail = data;
		}

		element.dispatchEvent(event);
	}
};

exports.forEach = function (array, callback) {
	for (var i = 0, l = array.length; i < l; i++) {
		callback.call(this, i, array[i]);
	}
};

/**
 * Gets the value at `path` of `object`.
 * @param {[type]} object [description]
 * @param {[type]} path   [description]
 * @return {[type]}        [description]
 */
exports.get = function (object, path) {
	if (typeof object === 'undefined' || object === null) return;

	path = path.split('.');
	var index = 0;
	var length = path.length;

	while (object !== null && index < length) {
		object = object[path[index++]];
	}

	return (index && index === length) ? object : undefined;
};

/**
 * Inserts a new DOM node after the specified node.
 * @param {[type]} newNode The new node.
 * @param {[type]} referenceNode The existing node after which the new node will be inserted.
 * @return {[type]} Returns the inserted node.
 */
exports.insertAfter = function (newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
