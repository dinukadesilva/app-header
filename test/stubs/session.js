module.exports = window.session = {
	login: function (redirectUrl) {},
	logout: function (redirectUrl) {},
	hasValidSession: function (gracePeriodSeconds) {},
	on: function (eventType, handler) {},
	off: function (eventType, handler) {},
	// Events
	SessionStateKnownEvent: 'sessionstateknown',
	LoginEvent: 'login',
	LogoutEvent: 'logout',
	// States
	Success: 'success',
	NoToken: 'notoken',
	NoSession: 'nosession',
	Unknown: 'unknown'
};
