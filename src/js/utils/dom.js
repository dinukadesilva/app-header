'use strict';

/**
 * Dispatches a DOM event.
 * @param  {EventTarget} element
 * @param  {String} name Name of the event.
 * @param  {Object} [data] Optional data to include in the event `detail` property.
 */
exports.dispatchEvent = function (element, name, data) {
	if (document.createEvent && element.dispatchEvent) {
		var event = document.createEvent('Event');
		event.initEvent(name, true, true);

		if (data) {
			event.detail = data;
		}

		element.dispatchEvent(event);
	}
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
