'use strict';

exports.createMenuItemEl = function (options) {
	options = options || {};

	var menuItemEl = document.createElement('li');

	menuItemEl.setAttribute('role', 'presentation');
	if (!options.isDivider) menuItemEl.classList.add('o-dropdown-menu__menu-item');
	if (options.isDivider) menuItemEl.classList.add('o-dropdown-menu__divider');
	if (options.isHeading) menuItemEl.classList.add('o-dropdown-menu__heading');

	if (options.cssClasses) {
		options.cssClasses.forEach(function (cssClass) {
			menuItemEl.classList.add(cssClass);
		});
	}

	if (options.attributes) {
		Object.keys(options.attributes).forEach(function (key) {
			menuItemEl.setAttribute(key, options.attributes[key]);
		});
	}

	if (options.link) {
		var menuItemLinkEl = document.createElement('a');

		menuItemLinkEl.setAttribute('role', 'menuitem');
		menuItemLinkEl.setAttribute('tabindex', '-1');

		if (options.link.onClick) {
			if (typeof options.link.onClick !== 'function') throw new TypeError('Click handler must be a function');
			menuItemLinkEl.href = '#';
			menuItemLinkEl.addEventListener('click', options.link.onClick);
		} else {
			menuItemLinkEl.textContent = options.link.textContent;
			menuItemLinkEl.href = options.link.href;
		}

		menuItemEl.appendChild(menuItemLinkEl);
	}

	return menuItemEl;
};
