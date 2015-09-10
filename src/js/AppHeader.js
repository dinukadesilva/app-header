'use strict';

var Header = require('o-header');
var DropdownMenu = require('o-dropdown-menu');
var assign = require('object-assign/index');
var dom = require('./utils/dom');
var forEach = require('./utils/forEach');
var get = require('./utils/get');
var I18n = require('./utils/I18n');
var menu = require('./utils/dropdown-menu');

var rootElInternal;
var accountMenuElInternal;
var usernameElInternal;
var settingsInternal;

var defaultSettingsInternal = {
	session: 'piSession',
	consoleBaseUrl: 'https://console.pearson.com',
	links: {
		home: '{consoleBaseUrl}/console/home',
		'my-account': '{consoleBaseUrl}/account/manage/account'
	},
	menu: {
		showAllCoursesMenuItem: false
	}
};

var resolveLinkInternal = function (key) {
	if (!settingsInternal.links[key] || typeof settingsInternal.links[key] !== 'string') return;

	return settingsInternal.links[key].replace('{consoleBaseUrl}', settingsInternal.consoleBaseUrl);
};

var initInternal = function (element, options) {
	if (typeof element === 'object' && !(element instanceof HTMLElement)) {
		options = element;
		element = null;
	}
	if (!element) element = document.body;
	if (!(element instanceof HTMLElement)) element = document.querySelector(element);
	options = options || {};

	settingsInternal = getSettings();

	rootElInternal = constructRootEl();
	accountMenuElInternal = rootElInternal.querySelector('.o-app-header__menu-account');
	usernameElInternal = rootElInternal.querySelector('.o-app-header__username');

	render('initializing');

	var session;

	if (!settingsInternal.session) {
		render('signed-out');
	} else {
		session = (typeof settingsInternal.session === 'string') ? window[settingsInternal.session] : settingsInternal.session;
		if (!session) throw new TypeError('Invalid configuration for \'session\': unable to find window[\'' + settingsInternal.session + '\']');
		initSession();
	}

	setMenuInternal(settingsInternal.menu);

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

	function constructRootEl() {
		var rootElInternal = document.createElement('header');

		rootElInternal.setAttribute('role', 'banner');
		rootElInternal.classList.add('o-header');
		rootElInternal.classList.add('o-header--fixed');
		if (settingsInternal.theme === 'light') rootElInternal.classList.add('o-header--theme-light');
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
		var links = settingsInternal.links;

		forEach(rootElInternal.querySelectorAll('[data-link]'), function (idx, item) {
			var link = item.getAttribute('data-link');

			if (links[link] && typeof links[link] === 'function') {
				item.addEventListener('click', links[link]);
			} else {
				item.href = resolveLinkInternal(link);
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
		var i18n = new I18n({ locale: settingsInternal.locale });
		forEach(rootElInternal.querySelectorAll('[data-i18n]'), function (idx, item) {
			item.textContent = i18n.translate(item.textContent.trim());
		});

		// Header
		new Header(rootElInternal);

		// Dropdown menus
		DropdownMenu.init(rootElInternal);

		if (!settingsInternal.session) {
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
		var user = settingsInternal.user;

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
		dom.dispatchEvent(rootElInternal, 'oAppHeader.help.toggle');
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

	options.appNav = options.appNav || {};

	function getMenuItemElOptionsFromItemOptions(key, item) {
		var menuItemElOptions = { link: { textContent: key } };

		if (typeof item === 'string') {
			menuItemElOptions.link.href = item;
		} else if (typeof item === 'object') {
			var itemOptions = item;

			menuItemElOptions.link.href = itemOptions.href;
			menuItemElOptions.link.onClick = itemOptions.onClick;

			if (itemOptions.active) {
				menuItemElOptions.cssClasses = ['o-dropdown-menu__menu-item--disabled'];
			}
		}

		return menuItemElOptions;
	}

	var accountMenuItemsEl = accountMenuElInternal.querySelector('.o-dropdown-menu__menu-items');

	// All courses menu item
	if (options.showAllCoursesMenuItem) {
		var allCoursesMenuItemEl = menu.createMenuItemEl({
			cssClasses: ['o-header__viewport-tablet--hidden', 'o-header__viewport-desktop--hidden'],
			attributes: { 'data-nav-item-type': 'all-courses'},
			link: { textContent: 'All courses', href: resolveLinkInternal('home') }
		});

		// Prepend the left arrow icon
		var allCoursesMenuItemLinkEl = allCoursesMenuItemEl.querySelector('a');

		allCoursesMenuItemLinkEl.innerHTML = '<span class="o-app-header__icon-left-arrow"></span> ' + allCoursesMenuItemLinkEl.innerHTML;

		// Insert the menu item
		accountMenuItemsEl.insertBefore(allCoursesMenuItemEl, accountMenuItemsEl.firstChild);
	}

	// Site nav menu items
	var siteNavMenuItemEls = [];

	if (options.siteNav && typeof options.siteNav.items === 'object') {
		var siteNavItems = options.siteNav.items;

		Object.keys(options.siteNav.items).forEach(function (key) {
			var menuItemElOptions = getMenuItemElOptionsFromItemOptions(key, siteNavItems[key]);
			var menuItemEl = menu.createMenuItemEl(assign(menuItemElOptions, { attributes: { 'data-nav-item-type': 'site' } }));

			siteNavMenuItemEls.push(menuItemEl);
		});
	}

	forEach(accountMenuItemsEl.querySelectorAll('[data-nav-item-type="site"]'), function (idx, item) {
		item.parentElement.removeChild(item);
	});

	for (var i = 0, l = siteNavMenuItemEls.length; i < l; i++) {
		if (i === 0) {
			if (accountMenuItemsEl.firstChild &&
				typeof accountMenuItemsEl.firstChild.getAttribute !== 'undefined' &&
				accountMenuItemsEl.firstChild.getAttribute('data-nav-item-type') === 'all-courses') {
				dom.insertAfter(siteNavMenuItemEls[i], accountMenuItemsEl.firstChild);
			} else if (accountMenuItemsEl.firstChild) {
				accountMenuItemsEl.insertBefore(siteNavMenuItemEls[i], accountMenuItemsEl.firstChild);
			} else {
				accountMenuItemsEl.appendChild(siteNavMenuItemEls[i]);
			}
		} else {
			dom.insertAfter(siteNavMenuItemEls[i], siteNavMenuItemEls[0]);
		}
	}

	if (siteNavMenuItemEls.length) {
		dom.insertAfter(menu.createMenuItemEl({ isDivider: true }), siteNavMenuItemEls[siteNavMenuItemEls.length - 1]);
	}

	// App about menu item
	if (options.appAbout) {
		var appAboutMenuItemOptions = { link: {} };

		if (options.appAbout.onClick) {
			appAboutMenuItemOptions.link.onClick = options.appAbout.onClick;
		} else {
			appAboutMenuItemOptions.link.textContent = options.appAbout.title;
			appAboutMenuItemOptions.link.href = options.appAbout.href;
		}

		var appAboutMenuItemEl = menu.createMenuItemEl(appAboutMenuItemOptions);

		// Insert before the My Account menu item
		var myAccountMenuItemEl = accountMenuItemsEl.querySelector('[data-link="my-account"]').parentElement;

		accountMenuItemsEl.insertBefore(appAboutMenuItemEl, myAccountMenuItemEl);
		accountMenuItemsEl.insertBefore(menu.createMenuItemEl({ isDivider: true }), myAccountMenuItemEl);
	}

	// App nav menu items
	var appNavMenuItemEls = [];

	if (options.appNav.heading) {
		var appNavHeaderOptions = options.appNav.heading;

		var appNavHeadingMenuItemEl = menu.createMenuItemEl({
			isHeading: true,
			link: { textContent: appNavHeaderOptions.text, href: appNavHeaderOptions.href }
		});

		appNavMenuItemEls.push(appNavHeadingMenuItemEl);
	}

	if (options.appNav && typeof options.appNav.items === 'object') {
		var appNavItems = options.appNav.items;

		Object.keys(options.appNav.items).forEach(function (key) {
			var menuItemElOptions = getMenuItemElOptionsFromItemOptions(key, appNavItems[key]);
			var menuItemEl = menu.createMenuItemEl(menuItemElOptions);

			appNavMenuItemEls.push(menuItemEl);
		});
	}

	var appNavMenuItemsEl = accountMenuElInternal.querySelector('.o-app-header__menu-app-nav > ul');

	// Clear existing menu items
	appNavMenuItemsEl.innerHTML = '';

	// Inject the page nav menu items
	var referenceNode = appNavMenuItemsEl.firstChild;

	appNavMenuItemEls.forEach(function (menuItemEl) {
		appNavMenuItemsEl.insertBefore(menuItemEl, referenceNode);
	});
};

// Export the public API
module.exports = {
	defaultSettings: defaultSettingsInternal,
	init: initInternal,
	setMenu: setMenuInternal
};
