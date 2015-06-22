/*global require*/
require('../../main');
require('o-dropdown-menu');

document.addEventListener('DOMContentLoaded', function() {
	'use strict';

	window.session = {
		sessionState: 'nosession',
		eventHandlers: {},
		login: function (redirectUrl) {
			this.trigger(this.LoginEvent);
		},
		logout: function (redirectUrl) {
			this.trigger(this.LogoutEvent);
		},
		hasValidSession: function (gracePeriodSeconds) { return this.sessionState; },
		on: function (eventType, handler) {
			this.eventHandlers[eventType] = this.eventHandlers[eventType] || [];
			this.eventHandlers[eventType].push(handler);
		},
		off: function (eventType, handler) {},
		trigger: function (eventType) {
			(this.eventHandlers[eventType] || []).forEach(function (handler) {
				handler.call();
			});
		},
		// Events
		SessionStateKnownEvent: 'sessionstateknown',
		LoginEvent: 'login',
		LogoutEvent: 'logout',
		// States
		Unknown: 'unknown',
		NoSession: 'nosession',
		NoToken: 'notoken',
		RequiredLifetimeTooLong: 'requiredlifetimetoolong',
		Success: 'success',
		TimedOut: 'timedout'
	};

	var locale = localStorage.getItem('locale') || 'en';
	document.querySelector('#demo-btn-locale').textContent = 'Locale: ' + locale;
	document.querySelector('#demo-dd-menu-locale').addEventListener('click', function (e) {
		var locale = e.target.getAttribute('data-locale');
		if (locale) {
			e.preventDefault();
			localStorage.setItem('locale', locale);
			location.reload();
		}
	});

	var config = {
		session: 'session',
		user: { givenName: 'Jake the Dog' },
		locale: locale
	};
	var configEl = document.createElement('script');
	configEl.setAttribute('data-o-app-header-config', '');
	configEl.type = 'application/json';
	configEl.innerHTML = JSON.stringify(config);
	document.head.appendChild(configEl);

	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
