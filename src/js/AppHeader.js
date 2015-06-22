'use strict';

var Header = require('o-header');
var Collapse = require('o-collapse');
var DropdownMenu = require('o-dropdown-menu');
var assign = require('object-assign/index');
var forEach = require('./utils').forEach;
var get = require('./utils').get;
var I18n = require('./I18n');

var AppHeader = module.exports = {

	defaultSettings: {
		session: 'piSession',
		consoleBaseUrl: 'https://console.pearson.com'
	},

	linkMap: {
		'home': '{consoleBaseUrl}/console/home',
		'help': 'https://example.com/help',
		'my-account': '{consoleBaseUrl}/account/manage/account'
	},

	init: function (element, options) {
		if (typeof element === 'object' && !(element instanceof HTMLElement)) {
			options = element;
			element = null;
		}
		if (!element) element = document.body;
		if (!(element instanceof HTMLElement)) element = document.querySelector(element);

		var settings = getSettings();
		var session = (typeof settings.session === 'string') ? window[settings.session] : settings.session;
		var headerEl = constructRootEl();
		var usernameEl = headerEl.querySelector('.o-app-header__username');

		setState('initializing');
		initSession();

		function getSettings() {
			return assign({}, AppHeader.defaultSettings, getGlobalSettings(), options);
		}

		function getGlobalSettings() {
			var configEl = document.querySelector('[data-o-app-header-config]');
			var config = {};

			if (!configEl) return;
			try { config = JSON.parse(configEl.textContent); } catch (e) {}
			return config;
		}

		function resolveLink(key) {
			if (!AppHeader.linkMap[key]) return '';

			return AppHeader.linkMap[key]
				.replace('{consoleBaseUrl}', settings.consoleBaseUrl);
		}

		function constructRootEl() {
			var headerEl = document.createElement('header');

			headerEl.setAttribute('data-o-component', 'o-header');
			headerEl.setAttribute('aria-role', 'banner');
			headerEl.classList.add('o-header');
			headerEl.classList.add('o-app-header');
			headerEl.innerHTML = requireText('../html/header.html');

			if (element === document.body) {
				element.insertBefore(headerEl, element.firstChild);
			} else {
				// Replace the passed in element with the header element
				element.parentElement.insertBefore(headerEl, element);
				element.parentNode.removeChild(element);
			}

			// Header
			new Header(headerEl);

			// Collapse
			new Collapse(headerEl.querySelector('[data-o-component="o-collapse"]'));

			// Dropdown menus
			DropdownMenu.init(headerEl);

			// Links
			forEach(headerEl.querySelectorAll('[data-link]'), function (idx, item) {
				item.href = resolveLink(item.getAttribute('data-link'));
			});

			// Actions
			headerEl.querySelector('[data-action="sign-in"]').addEventListener('click', handleSignIn);
			headerEl.querySelector('[data-action="sign-out"]').addEventListener('click', handleSignOut);

			// i18n
			var i18n = new I18n({ locale: settings.locale });
			forEach(headerEl.querySelectorAll('[data-i18n]'), function (idx, item) {
				item.textContent = i18n.translate(item.textContent.trim());
			});

			return headerEl;
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

		function setUsername(username) {
			usernameEl.textContent = username;
		}

		function setState(state) {
			var selector = '[data-show="state:signed-in"],[data-show="state:signed-out"]';
			var elements = headerEl.querySelectorAll(selector);

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

		function initSession() {
			var sessionState = session.hasValidSession();

			if (sessionState === session.Success) {
				setState('signed-in');
			} else if (sessionState === session.NoSession || sessionState === session.NoToken) {
				setState('signed-out');
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

		function handleSessionStateKnown(e) {
			if (session.hasValidSession() === session.Success) {
				getUsername(handleGetUsername);
			} else {
				setState('signed-out');
			}
		}

		function handleGetUsername(error, username) {
			if (error) return;
			setUsername(username);
			setState('signed-in');
		}

		function handleSessionLogin(e) {
			getUsername(handleGetUsername);
		}

		function handleSessionLogout(e) {
			setState('signed-out');
		}

	}
};
