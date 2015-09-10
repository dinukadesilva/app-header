'use strict';

var assign = require('object-assign/index');

var MENU_DEFAULTS = { toggle: {}, items: [], attributes: {} };

exports.createMenuEl = function (options) {
	options = assign({}, MENU_DEFAULTS, options);

	var menuEl = document.createElement('div');

	menuEl.classList.add('o-dropdown-menu');
	if (options.alignRight) menuEl.classList.add('o-dropdown-menu--right');

	var menuToggleEl = document.createElement('a');

	menuToggleEl.href = '#';
	menuToggleEl.classList.add('o-dropdown-menu__toggle');
	menuToggleEl.setAttribute('data-toggle', 'dropdown-menu');
	menuToggleEl.setAttribute('aria-haspopup', 'true');
	menuToggleEl.setAttribute('aria-expanded', 'false');
	menuToggleEl.textContent = options.toggle.textContent;

	var menuItemsEl = document.createElement('ul');

	menuItemsEl.classList.add('o-dropdown-menu__menu-items');
	menuItemsEl.setAttribute('role', 'menu');
	// TODO:
	// menuItemsEl.setAttribute('aria-labelledby', '');

	Object.keys(options.attributes).forEach(function (key) {
		menuEl.setAttribute(key, options.attributes[key]);
	});

	options.items.forEach(function (menuItemOptions) {
		menuItemsEl.appendChild(exports.createMenuItemEl(menuItemOptions));
	});

	menuEl.appendChild(menuToggleEl);
	menuEl.appendChild(menuItemsEl);

	return menuEl;
};

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

		if (options.link.attributes) {
			Object.keys(options.link.attributes).forEach(function (key) {
				menuItemLinkEl.setAttribute(key, options.link.attributes[key]);
			});
		}

		menuItemEl.appendChild(menuItemLinkEl);
	}

	return menuItemEl;
};
