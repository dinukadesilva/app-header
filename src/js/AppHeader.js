'use strict';

var Header = require('o-header');
var Collapse = require('o-collapse');
var DropdownMenu = require('o-dropdown-menu');
var assign = require('object-assign/index');
var dispatchEvent = require('./utils').dispatchEvent;
var forEach = require('./utils').forEach;
var get = require('./utils').get;
var I18n = require('./I18n');

var rootElInternal;
var usernameElInternal;

var defaultSettingsInternal = {
	session: 'piSession',
	consoleBaseUrl: 'https://console.pearson.com'
};

var linkMapInternal = {
	help: null,
	home: '{consoleBaseUrl}/console/home',
	'my-account': '{consoleBaseUrl}/account/manage/account'
};

var initInternal = function (element, options) {
	if (typeof element === 'object' && !(element instanceof HTMLElement)) {
		options = element;
		element = null;
	}
	if (!element) element = document.body;
	if (!(element instanceof HTMLElement)) element = document.querySelector(element);

	var settings = getSettings();
	var session = (typeof settings.session === 'string') ? window[settings.session] : settings.session;
	rootElInternal = constructRootEl();
	usernameElInternal = rootElInternal.querySelector('.o-app-header__username');

	render('initializing');
	initSession();
	setNavInternal(settings.nav || document.querySelector('.o-app-header__page-nav'));

	function getSettings() {
		return assign({}, defaultSettingsInternal, getGlobalSettings(), options);
	}

	function getGlobalSettings() {
		var configEl = document.querySelector('[data-o-app-header-config]');
		var config = {};

		if (!configEl) return;
		try { config = JSON.parse(configEl.textContent); } catch (e) {}
		return config;
	}

	function resolveLink(key) {
		if (!linkMapInternal[key]) return '';

		return linkMapInternal[key]
			.replace('{consoleBaseUrl}', settings.consoleBaseUrl);
	}

	function constructRootEl() {
		var rootElInternal = document.createElement('header');

		rootElInternal.setAttribute('role', 'banner');
		rootElInternal.classList.add('o-header');
		rootElInternal.classList.add('o-header--fixed');
		rootElInternal.classList.add('o-app-header');
		rootElInternal.innerHTML = requireText('../html/header.html');

		if (element === document.body) {
			element.insertBefore(rootElInternal, element.firstChild);
		} else {
			// Replace the passed in element with the header element
			element.parentElement.insertBefore(rootElInternal, element);
			element.parentNode.removeChild(element);
		}

		// Header
		new Header(rootElInternal);

		// Collapse
		new Collapse(rootElInternal.querySelector('[data-o-component="o-collapse"]'));

		// Dropdown menus
		DropdownMenu.init(rootElInternal);

		// Links
		forEach(rootElInternal.querySelectorAll('[data-link]'), function (idx, item) {
			var link = item.getAttribute('data-link');

			if (linkMapInternal[link] && typeof linkMapInternal[link] === 'function') {
				item.addEventListener('click', linkMapInternal[link]);
			} else {
				item.href = resolveLink(link);
			}
		});

		if (typeof linkMapInternal.help !== 'string') {
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
		usernameElInternal.textContent = username;
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

var setNavInternal = function (navEl) {
	if (!rootElInternal) return;
	if (typeof navEl === 'string') navEl = document.querySelector(navEl);
	if (!navEl) navEl = document.querySelector('.o-app-header__page-nav');
	if (!navEl) return;

	var navContainerEl = rootElInternal.querySelector('.o-app-header__page-nav-container');
	var navItemEls;

	if (navEl instanceof HTMLElement) {
		// Make a deep copy
		navEl = navEl.cloneNode(true);
		navEl.id = '';
		navEl.className = '';
		navEl.classList.add('o-header__nav');

		navItemEls = navEl.querySelectorAll('ul > li');

		for (var i = 0, l = navItemEls.length; i < l; i++) {
			navItemEls[i].className = '';
			navItemEls[i].classList.add('o-header__nav-item');
		}
	} else if (typeof navEl === 'object') {
		var navItems = navEl.navItems || {};

		navEl = document.createElement('nav');
		navEl.classList.add('o-header__nav');

		var navListEl = document.createElement('ul');
		navEl.appendChild(navListEl);

		Object.keys(navItems).forEach(function (key) {
			var navListItemEl = document.createElement('li');
			var navItemHref = typeof navItems[key] === 'string' ? navItems[key] : '#';

			navListItemEl.classList.add('o-header__nav-item');
			navListItemEl.innerHTML = '<a href="' + navItemHref + '">' + key + '</a>';

			if (typeof navItems[key] === 'function') {
				navListItemEl.firstChild.addEventListener('click', navItems[key]);
			}

			navListEl.appendChild(navListItemEl);
		});
	}

	navContainerEl.innerHTML = '';

	if (navEl) {
		navContainerEl.appendChild(navEl);
	}

	return navEl;
};

// Export the public API
module.exports = {
	defaultSettings: defaultSettingsInternal,
	linkMap: linkMapInternal,
	init: initInternal,
	setNav: setNavInternal
};
