'use strict';

var assign = require('object-assign/index');
var dom = require('./utils/dom');
var get = require('./utils/get');
var forEach = require('./utils/forEach');
var patch = require('../../bower_components/incremental-dom').patch;
var template = require('./template');
var I18n = require('./utils/I18n');
var DropdownMenu = require('o-dropdown-menu');

module.exports = AppHeader;

/**
 * Represents the header for Pearson Higher Ed web applications.
 * @param {HTMLElement} element
 * @param {Object} options
 */
function AppHeader(element, options) {
	this.init(element, options);
}


/**
 * Default settings for all AppHeader instances.
 * @type {Object}
 */
AppHeader.defaultSettings = {
	session: 'piSession',
	consoleBaseUrl: 'https://console.pearson.com',
	links: {
		home: '{consoleBaseUrl}/console/home',
		myAccount: '{consoleBaseUrl}/account/manage/account'
	},
	menu: {
		showAllCoursesMenuItem: false
	}
};


/**
 * Initializes an AppHeader instance.
 * @param  {HTMLElement} element
 * @param  {Object} options
 * @return {AppHeader}
 */
AppHeader.init = function (element, options) {
	return new AppHeader(element, options);
};


/**
 * Initializes the current AppHeader instance.
 * @param  {HTMLElement} [element] The DOM element to initialize.
 * Defaults to document.body, in which case the header element is
 * prepended to the contents of the body element.
 * @param  {Object} options
 */
AppHeader.prototype.init = function (element, options) {
	if (typeof element === 'object' && !(element instanceof HTMLElement)) {
		options = element;
		element = null;
	}
	if (!element) element = document.body;
	if (!(element instanceof HTMLElement)) element = document.querySelector(element);

	var settings = this.settings_ = this.getSettings_(options);
	var rootEl = this.element = this.constructRootEl_(settings);

	this.i18n_ = new I18n({ locale: settings.locale });
	this.state_ = this.getInitialState_(settings);
	this.initSession_(settings);

	if (element === document.body) {
		element.insertBefore(rootEl, element.firstChild);
	} else {
		// Replace the passed in element with the header element
		element.parentElement.insertBefore(rootEl, element);
		element.parentNode.removeChild(element);
	}

	this.render_();
};


/**
 * Sets the theme.
 * @param {String} [theme] Possible values:
 * - 'light'
 */
AppHeader.prototype.setTheme = function (theme) {
	this.element.classList[theme === 'light' ? 'add' : 'remove']('o-header--theme-light');
};


/**
 * Sets the user account menu options.
 * @param {Object} options
 */
AppHeader.prototype.setMenu = function (options) {
	options = options || {};
	this.settings_ = assign({}, this.settings_, { menu: options });
	this.render_();
};


/**
 * Private methods
 */


AppHeader.prototype.getInitialState_ = function (options) {
	var state = {};

	state.user = assign({}, options.user, { isAuthenticated: false });

	return state;
};


AppHeader.prototype.getSettings_ = function (options) {
	options = options || {};

	// Merge links object
	var globalSettings = this.getGlobalSettings_();
	var links = assign({}, AppHeader.defaultSettings.links, globalSettings.links, options.links);

	var settings = assign({}, AppHeader.defaultSettings, globalSettings, options, { links: links });

	function validate() {

		function checkNavItemOptions(path, key) {
			if (typeof get(settings, path) !== 'undefined') {
				var items = settings.menu[key].items;
				Object.keys(items).forEach(function (itemKey) {
					if (items[itemKey].onClick) checkIsFunction(items[itemKey].onClick, 'onClick');
				});
			}
		}

		function checkIsFunction(value, name) {
			if (typeof value !== 'function') throw new TypeError(name + ': value must be a function');
		}

		checkNavItemOptions('menu.siteNav.items', 'siteNav');
		checkNavItemOptions('menu.appNav.items', 'appNav');

		if (typeof get(settings, 'menu.appAbout') !== 'undefined') {
			if (settings.menu.appAbout.onClick) checkIsFunction(settings.menu.appAbout.onClick);
		}
	}

	validate();

	return settings;
};


AppHeader.prototype.getGlobalSettings_ = function () {
	var configEl = document.querySelector('[data-o-app-header-config]');
	var config = {};

	if (!configEl) return config;
	try { config = JSON.parse(configEl.textContent); } catch (e) { throw new Error('Unable to parse configuration object: invalid JSON'); }
	return config;
};


AppHeader.prototype.resolveLink_ = function (key) {
	if (!this.settings_.links[key] || typeof this.settings_.links[key] !== 'string') return;

	return this.settings_.links[key].replace('{consoleBaseUrl}', this.settings_.consoleBaseUrl);
};


AppHeader.prototype.initSession_ = function (options) {
	var state = this.state_;
	var render = this.render_.bind(this);

	if (!options.session) {
		this.state_.session = false;
	} else {
		var session = (typeof options.session === 'string') ?
			window[options.session] : options.session;

		if (!session) throw new TypeError('Invalid configuration for \'session\': unable to find window[\'' + options.session + '\']');

		var sessionState = session.hasValidSession(0);

		if (sessionState === session.Success) {
			this.state_.user.isAuthenticated = true;
		} else if (sessionState === session.NoSession || sessionState === session.NoToken) {
			this.state_.user.isAuthenticated = false;
		}

		this.handleSessionStateKnown_ = function (e) {
			if (e && typeof e.preventDefault === 'function') e.preventDefault();
			state.user.isAuthenticated = (session.hasValidSession(0) === session.Success);
			render();
		};

		this.handleSessionLogin_ = function (e) {
			if (e && typeof e.preventDefault === 'function') e.preventDefault();
			state.user.isAuthenticated = true;
			render();
		};

		this.handleSessionLogout_ = function (e) {
			if (e && typeof e.preventDefault === 'function') e.preventDefault();
			state.user.isAuthenticated = false;
			render();
		};

		this.handleSignInClick_ = function (e) {
			e.preventDefault();
			session.login(window.location.href);
		};

		this.handleSignOutClick_ = function (e) {
			e.preventDefault();
			session.logout(window.location.href);
		};

		session.on(session.SessionStateKnownEvent, this.handleSessionStateKnown_);
		session.on(session.LoginEvent, this.handleSessionLogin_);
		session.on(session.LogoutEvent, this.handleSessionLogout_);
	}
};


AppHeader.prototype.constructRootEl_ = function (options) {
	var element = document.createElement('header');

	element.classList.add('o-app-header');
	element.setAttribute('role', 'banner');
	element.classList.add('o-header');
	element.classList.add('o-header--fixed');
	if (options.theme === 'light') element.classList.add('o-header--theme-light');

	element.addEventListener('oDropdownMenu.expand', function (e) {
		forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
			item.classList.remove('o-app-header__icon-chevron-down');
			item.classList.add('o-app-header__icon-chevron-up');
		});
	});

	element.addEventListener('oDropdownMenu.collapse', function (e) {
		forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
			item.classList.remove('o-app-header__icon-chevron-up');
			item.classList.add('o-app-header__icon-chevron-down');
		});
	});

	return element;
};


AppHeader.prototype.render_ = function () {
	var element = this.element;
	var state = this.state_;
	var i18n = this.i18n_;

	var data = assign({}, this.settings_, {
		links: {
			home: this.resolveLink_('home'),
			myAccount: this.resolveLink_('myAccount')
		}
	});

	var handlers = {
		handleLogin: this.handleSignInClick_,
		handleLogout: this.handleSignOutClick_,
		handleHelpNavItemClick: this.handleHelpNavItemClick_.bind(this)
	};

	patch(element, function () {
		template(data, state.user, handlers, i18n.translate.bind(i18n));
		DropdownMenu.init(element);
		dom.dispatchEvent(element, 'oAppHeader.didUpdate');
	});
};


AppHeader.prototype.handleHelpNavItemClick_ = function (e) {
	e.preventDefault();
	dom.dispatchEvent(this.element, 'oAppHeader.help.toggle');
};
