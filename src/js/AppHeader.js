'use strict';

var Header = require('o-header');
var DropdownMenu = require('o-dropdown-menu');
var assign = require('object-assign/index');
var dispatchEvent = require('./utils').dispatchEvent;
var forEach = require('./utils').forEach;
var get = require('./utils').get;
var I18n = require('./I18n');

var rootElInternal;
var accountMenuElInternal;
var usernameElInternal;

var defaultSettingsInternal = {
	session: 'piSession',
	consoleBaseUrl: 'https://console.pearson.com',
	links: {
		home: '{consoleBaseUrl}/console/home',
		'my-account': '{consoleBaseUrl}/account/manage/account'
	},
	menu: {}
};

var initInternal = function (element, options) {
	if (typeof element === 'object' && !(element instanceof HTMLElement)) {
		options = element;
		element = null;
	}
	if (!element) element = document.body;
	if (!(element instanceof HTMLElement)) element = document.querySelector(element);
	options = options || {};

	var settings = getSettings();

	rootElInternal = constructRootEl();
	accountMenuElInternal = rootElInternal.querySelector('.o-app-header__menu-account');
	usernameElInternal = rootElInternal.querySelector('.o-app-header__username');

	render('initializing');

	var session;

	if (!settings.session) {
		render('signed-out');
	} else {
		session = (typeof settings.session === 'string') ? window[settings.session] : settings.session;
		if (!session) throw new TypeError('Invalid configuration for \'session\': unable to find window[\'' + settings.session + '\']');
		initSession();
	}

	setMenuInternal(settings.menu);

	function getSettings() {
		// Merge links object
		var globalSettings = getGlobalSettings();
		var links = assign({}, defaultSettingsInternal.links, globalSettings.links, options.links);

		return assign({}, defaultSettingsInternal, globalSettings, options, { links: links });
	}

	function getGlobalSettings() {
		var configEl = document.querySelector('[data-o-app-header-config]');
		var config = {};

		if (!configEl) return config;
		try { config = JSON.parse(configEl.textContent); } catch (e) { throw new Error('Unable to parse configuration object: invalid JSON'); }
		return config;
	}

	function resolveLink(key) {
		if (!settings.links[key] || typeof settings.links[key] !== 'string') return;

		return settings.links[key].replace('{consoleBaseUrl}', settings.consoleBaseUrl);
	}

	function constructRootEl() {
		var rootElInternal = document.createElement('header');

		rootElInternal.setAttribute('role', 'banner');
		rootElInternal.classList.add('o-header');
		rootElInternal.classList.add('o-header--fixed');
		if (settings.theme === 'light') rootElInternal.classList.add('o-header--theme-light');
		rootElInternal.classList.add('o-app-header');
		rootElInternal.innerHTML = requireText('../html/header.html');

		if (element === document.body) {
			element.insertBefore(rootElInternal, element.firstChild);
		} else {
			// Replace the passed in element with the header element
			element.parentElement.insertBefore(rootElInternal, element);
			element.parentNode.removeChild(element);
		}

		// Links
		var links = settings.links;

		forEach(rootElInternal.querySelectorAll('[data-link]'), function (idx, item) {
			var link = item.getAttribute('data-link');

			if (links[link] && typeof links[link] === 'function') {
				item.addEventListener('click', links[link]);
			} else {
				item.href = resolveLink(link);
			}
		});

		if (typeof links.help === 'object') {
			// Turn the help nav item into a dropdown menu
			var helpNavItemEl = rootElInternal.querySelector('.o-app-header__nav-item-help');
			var helpMenuEl = document.createElement('div');
			var helpMenuTriggerEl = document.createElement('a');
			var helpMenuItemsEl = document.createElement('ul');

			helpMenuEl.classList.add('o-dropdown-menu');
			helpMenuEl.classList.add('o-dropdown-menu--right');

			helpMenuTriggerEl.href = '#';
			helpMenuTriggerEl.classList.add('o-dropdown-menu__toggle');
			helpMenuTriggerEl.setAttribute('data-toggle', 'dropdown-menu');
			helpMenuTriggerEl.setAttribute('aria-haspopup', 'true');
			helpMenuTriggerEl.setAttribute('aria-expanded', 'false');
			helpMenuTriggerEl.setAttribute('data-i18n', '');
			helpMenuTriggerEl.textContent = 'Help';

			helpMenuItemsEl.classList.add('o-dropdown-menu__menu-items');
			helpMenuItemsEl.setAttribute('role', 'menu');
			// helpMenuItemsEl.setAttribute('aria-labelledby', '?');

			Object.keys(links.help).forEach(function (key) {
				var link = links.help[key];
				var helpMenuItemEl = document.createElement('li');
				var helpMenuItemLinkEl = document.createElement('a');

				helpMenuItemEl.classList.add('o-dropdown-menu__menu-item');
				helpMenuItemEl.setAttribute('role', 'presentation');

				helpMenuItemLinkEl.setAttribute('role', 'menuitem');
				helpMenuItemLinkEl.setAttribute('tabindex', '-1');

				if (typeof link === 'object') {
					Object.keys(link).forEach(function (key) {
						if (key === 'href') {
							helpMenuItemLinkEl.href = link.href;
						} else {
							helpMenuItemLinkEl.setAttribute(key, link[key]);
						}
					});

				} else if (typeof link === 'function') {
					helpMenuItemLinkEl.href = '#';
					helpMenuItemLinkEl.addEventListener('click', link);
				} else {
					helpMenuItemLinkEl.href = links.help[key];
				}

				helpMenuItemLinkEl.textContent = key;

				helpMenuItemEl.appendChild(helpMenuItemLinkEl);
				helpMenuItemsEl.appendChild(helpMenuItemEl);
			});

			helpMenuEl.appendChild(helpMenuTriggerEl);
			helpMenuEl.appendChild(helpMenuItemsEl);

			helpNavItemEl.innerHTML = '';
			helpNavItemEl.appendChild(helpMenuEl);
		} else if (typeof links.help !== 'string') {
			rootElInternal.querySelector('[data-link="help"]').addEventListener('click', handleHelpClick);
		}

		// Actions
		rootElInternal.querySelector('[data-action="sign-in"]').addEventListener('click', handleSignIn);
		rootElInternal.querySelector('[data-action="sign-out"]').addEventListener('click', handleSignOut);

		// i18n
		var i18n = new I18n({ locale: settings.locale });
		forEach(rootElInternal.querySelectorAll('[data-i18n]'), function (idx, item) {
			item.textContent = i18n.translate(item.textContent.trim());
		});

		// Header
		new Header(rootElInternal);

		// Dropdown menus
		DropdownMenu.init(rootElInternal);

		if (!settings.session) {
			forEach(rootElInternal.querySelectorAll('.o-app-header__nav-item-menu'), function (idx, item) {
				item.parentElement.removeChild(item);
			});
		} else {
			var menuEl = rootElInternal.querySelector('.o-app-header__menu-account');

			menuEl.addEventListener('oDropdownMenu.expand', function (e) {
				forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
					item.classList.remove('o-app-header__icon-chevron-down');
					item.classList.add('o-app-header__icon-chevron-up');
				});
			});

			menuEl.addEventListener('oDropdownMenu.collapse', function (e) {
				forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
					item.classList.remove('o-app-header__icon-chevron-up');
					item.classList.add('o-app-header__icon-chevron-down');
				});
			});
		}

		return rootElInternal;
	}

	function getUsername(callback) {
		var user = settings.user;

		if (typeof user === 'function') {
			user(function handleGetUser(error, user) {
				if (error) return callback(error);
				return callback(null, get(user, 'givenName'));
			});
		} else {
			return callback(null, get(user, 'givenName'));
		}
	}

	function render(state) {
		var selector = '[data-show="state:signed-in"],[data-show="state:signed-out"]';
		var elements = rootElInternal.querySelectorAll(selector);

		if (state === 'initializing') {
			forEach(elements, function (idx, el) {
				el.style.display = 'none';
			});
		} else if (state === 'signed-in') {
			forEach(elements, function (idx, el) {
				el.style.display = el.getAttribute('data-show') === 'state:signed-in' ? '' : 'none';
			});
		} else if (state === 'signed-out') {
			forEach(elements, function (idx, el) {
				el.style.display = el.getAttribute('data-show') === 'state:signed-out' ? '' : 'none';
			});
		}
	}

	function renderUsername(username) {
		var iconEl = document.createElement('i');

		iconEl.classList.add('o-app-header__icon');
		iconEl.classList.add('o-app-header__icon-chevron-down');

		usernameElInternal.innerHTML = username + ' ';
		usernameElInternal.appendChild(iconEl);
	}

	function initSession() {
		var sessionState = session.hasValidSession(0);

		if (sessionState === session.Success) {
			render('signed-in');
		} else if (sessionState === session.NoSession || sessionState === session.NoToken) {
			render('signed-out');
		}

		session.on(session.SessionStateKnownEvent, handleSessionStateKnown);
		session.on(session.LoginEvent, handleSessionLogin);
		session.on(session.LogoutEvent, handleSessionLogout);
	}

	function handleSignIn(e) {
		e.preventDefault();
		session.login(window.location.href);
	}

	function handleSignOut(e) {
		e.preventDefault();
		session.logout(window.location.href);
	}

	function handleHelpClick(e) {
		e.preventDefault();
		dispatchEvent(rootElInternal, 'oAppHeader.help.toggle');
	}

	function handleSessionStateKnown(e) {
		if (session.hasValidSession(0) === session.Success) {
			getUsername(handleGetUsername);
		} else {
			render('signed-out');
		}
	}

	function handleGetUsername(error, username) {
		if (error) return;
		renderUsername(username);
		render('signed-in');
	}

	function handleSessionLogin(e) {
		getUsername(handleGetUsername);
	}

	function handleSessionLogout(e) {
		render('signed-out');
	}

};

var setMenuInternal = function (options) {
	if (!rootElInternal || !accountMenuElInternal) return;
	if (!options || typeof options !== 'object') return;

	var menuItemEls = [];
	var appNavItems = (options.appNav || {}).items;

	if (!appNavItems) return;

	Object.keys(appNavItems).forEach(function (key) {
		var menuItemEl = document.createElement('li');
		var menuItemLinkEl = document.createElement('a');

		menuItemEl.classList.add('o-dropdown-menu__menu-item');
		menuItemEl.setAttribute('role', 'presentation');
		menuItemLinkEl.setAttribute('role', 'menuitem');
		menuItemLinkEl.setAttribute('tabindex', '-1');
		menuItemLinkEl.href = typeof appNavItems[key] === 'string' ? appNavItems[key] : '#';
		menuItemLinkEl.textContent = key;

		if (typeof appNavItems[key] === 'function') {
			menuItemLinkEl.addEventListener('click', appNavItems[key]);
		}

		menuItemEl.appendChild(menuItemLinkEl);
		menuItemEls.push(menuItemEl);
	});

	var menuItemsEl = accountMenuElInternal.querySelector('.o-app-header__menu-app-nav > ul');

	// Clear existing menu items
	menuItemsEl.innerHTML = '';

	// Inject the page nav menu items
	var referenceNode = menuItemsEl.firstChild;

	menuItemEls.forEach(function (menuItemEl) {
		menuItemsEl.insertBefore(menuItemEl, referenceNode);
	});
};

// Export the public API
module.exports = {
	defaultSettings: defaultSettingsInternal,
	init: initInternal,
	setMenu: setMenuInternal
};
