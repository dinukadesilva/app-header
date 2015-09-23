/*global require, alert*/
'use strict';

require('o-dropdown-menu');
var AppHeader = require('../../main');
var assign = require('object-assign/index');
var forEach = require('../../src/js/utils/forEach');

document.addEventListener('DOMContentLoaded', function() {

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

	function getModeOptions() {
		var options = {};

		forEach(document.querySelectorAll('[name="mode-options"]'), function (idx, el) {
			if (el.checked) {
				if (el.hasAttribute('data-option-value')) {
					options[el.value] = JSON.parse(el.getAttribute('data-option-value'));
				} else {
					options[el.value] = true;
				}
			} else {
				options[el.value] = undefined;
			}
		});

		return options;
	}

	var mode = document.querySelector('.demo-container').getAttribute('data-header-mode');
	var modeOptions = getModeOptions();

	var config = assign({
		session: 'session',
		user: { givenName: 'XXXXXXXXXXXXXXXX' },
		mode: mode
	}, modeOptions);

	var appHeader = new AppHeader(config);

	// Help menu
	document.addEventListener('oAppHeader.help.toggle', function () {
		alert('You toggled help');
	});

	// Select mode option
	document.getElementById('mode-options').addEventListener('change', function (e) {
		appHeader.setMode(mode, getModeOptions());
	});
});
