/*global sinon, describe, it, before, beforeEach*/
'use strict';

var expect = require('expect.js');
var dispatchEvent = require('../src/js/utils').dispatchEvent;
var forEach = require('../src/js/utils').forEach;
var AppHeader = require('../src/js/AppHeader');

describe('AppHeader', function () {

	var sandbox, session;

	before(function () {
		sandbox = sinon.sandbox.create();

		session = window.session = {
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

		var config = {
			session: 'session',
			user: { givenName: 'FooBar' }
		};
		var configEl = document.createElement('script');
		configEl.setAttribute('data-o-app-header-config', '');
		configEl.type = 'application/json';
		configEl.innerHTML = JSON.stringify(config);
		document.head.appendChild(configEl);
	});

	beforeEach(function () {
		document.body.innerHTML = '';
		sandbox.restore();
	});

	describe('o.DOMContentLoaded', function () {

		require('../main');

		it('should prepend to document.body', function (done) {
			document.addEventListener('o.DOMContentLoaded', function () {
				var appHeaderEl = document.body.firstChild;

				expect(document.body.children.length).to.be(1);
				expect(appHeaderEl).to.not.be(null);
				expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
				done();
			});

			var ready = document.createEvent('Event');
			ready.initEvent('o.DOMContentLoaded', true, true);
			document.dispatchEvent(ready);
		});

	});

	describe('#init(element)', function () {

		it('should prepend to document.body when element is undefined', function () {
			AppHeader.init();

			var appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should replace element when element is an instance of HTMLElement', function () {
			document.body.appendChild(document.createElement('div'));

			var el = document.createElement('div');
			document.body.appendChild(el);

			AppHeader.init(el);

			var appHeaderEl = document.body.childNodes[1];

			expect(document.body.children.length).to.be(2);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should replace element when element is an instance of string', function () {
			document.body.appendChild(document.createElement('div'));

			var el = document.createElement('div');
			el.id = 'app-header';
			document.body.appendChild(el);

			AppHeader.init('#app-header');

			var appHeaderEl = document.body.childNodes[1];

			expect(document.body.children.length).to.be(2);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should set role="banner"', function () {
			AppHeader.init();

			var appHeaderEl = getHeaderEl();

			expect(appHeaderEl.getAttribute('role')).to.be('banner');
		});

		it('should resolve the nav links', function () {
			var consoleBaseUrl = 'https://example.org';
			AppHeader.init({ consoleBaseUrl: consoleBaseUrl });

			var appHeaderEl = getHeaderEl();

			function resolveLink(key) {
				return AppHeader.linkMap[key].replace('{consoleBaseUrl}', consoleBaseUrl);
			}

			expect(appHeaderEl.querySelector('[data-link="my-account"]').href).to.be(resolveLink('my-account'));
			expect(appHeaderEl.querySelector('[data-link="home"]').href).to.be(resolveLink('home'));
		});

		it('should register a click handler when link target is a function', function (done) {
			sandbox.stub(AppHeader.linkMap, 'home', function handleClick(e) {
				e.preventDefault();
				done();
			});

			AppHeader.init();

			var appHeaderEl = getHeaderEl();
			var homeEl = appHeaderEl.querySelector('[data-link="home"]');

			dispatchEvent(homeEl, 'click');
		});

		it('should emit oAppHeader.help.toggle when the Help nav item is clicked', function (done) {
			AppHeader.init();

			var appHeaderEl = getHeaderEl();
			var helpNavEl = appHeaderEl.querySelector('[data-link="help"]');

			appHeaderEl.addEventListener('oAppHeader.help.toggle', done.bind(null, null));

			dispatchEvent(helpNavEl, 'click');
		});

		it('should insert the page nav', function () {
			var navEl = document.createElement('nav');
			navEl.classList.add('o-app-header__page-nav');
			navEl.innerHTML = '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
			document.body.appendChild(navEl);

			AppHeader.init();

			var appHeaderEl = getHeaderEl();
			var appHeaderNavEl = appHeaderEl.querySelector('.o-app-header__page-nav-container .o-header__nav');

			expect(appHeaderNavEl.querySelector('ul').childElementCount).to.be(2);
		});

	});

	describe('.setNav(navElement)', function () {

		it('should find the nav element on the page when the navElement argument is undefined', function () {
			AppHeader.init();
			var navEl = document.createElement('nav');
			navEl.classList.add('o-app-header__page-nav');
			navEl.innerHTML = '<ul><li><a href="#">2ee29043</a></li></ul>';
			document.body.appendChild(navEl);

			AppHeader.setNav();

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);

			expect(navContainerEl.childElementCount).to.be(1);
			expect(navContainerEl.childNodes[0].childNodes[0].textContent).to.be('2ee29043');
		});

		it('should build the nav element when the navElement argument is an object', function () {
			var nav = {
				navItems: {
					Foo: 'http://example.com/foo',
					Bar: 'http://example.com/bar'
				}
			};

			AppHeader.init();
			AppHeader.setNav(nav);

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);
			var navListEl = navContainerEl.querySelector('.o-header__nav ul');

			expect(navContainerEl.childElementCount).to.be(1);
			expect(navListEl.childElementCount).to.be(2);
			expect(navListEl.childNodes[0].textContent).to.be('Foo');
			expect(navListEl.childNodes[0].firstChild.href).to.be(nav.navItems.Foo);
			expect(navListEl.childNodes[1].textContent).to.be('Bar');
			expect(navListEl.childNodes[1].firstChild.href).to.be(nav.navItems.Bar);
		});

		it('should add a click event listener when the navElement argument is an object and the navItems key value is a function', function () {
			var nav = {
				navItems: {
					Foo: 'http://example.com/foo',
					Bar: sinon.spy()
				}
			};

			AppHeader.init();
			AppHeader.setNav(nav);

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);
			var navListEl = navContainerEl.querySelector('ul');

			dispatchEvent(navListEl.childNodes[1].querySelector('a'), 'click');

			expect(nav.navItems.Bar.calledOnce).to.be(true);
		});

		it('should use the provided element when the navElement argument is an instance of HTMLElement', function () {
			AppHeader.init();
			var navEl = document.createElement('nav');
			navEl.innerHTML = 'a8f4af5D';

			AppHeader.setNav(navEl);

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);

			expect(navContainerEl.childElementCount).to.be(1);
			expect(navContainerEl.childNodes[0].textContent).to.be('a8f4af5D');
		});

		it('should select the element when the navElement argument is a string', function () {
			AppHeader.init();
			var navEl = document.createElement('nav');
			navEl.id = 'a25642c2';
			navEl.innerHTML = 'a25642c2';
			document.body.appendChild(navEl);

			AppHeader.setNav('#a25642c2');

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);

			expect(navContainerEl.childElementCount).to.be(1);
			expect(navContainerEl.firstChild.textContent).to.be('a25642c2');
		});

		it('should replace the existing content of the container', function () {
			AppHeader.init();
			var navEl = document.createElement('nav');
			navEl.innerHTML = '<ul><li>Item 1</li></ul>';
			AppHeader.setNav(navEl);

			// Create a new nav element
			navEl = document.createElement('nav');
			navEl.innerHTML = '<ul><li>Item A</li><li>Item B</li></ul>';
			AppHeader.setNav(navEl);

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);

			expect(navContainerEl.childElementCount).to.be(1);
			expect(navContainerEl.querySelector('.o-header__nav ul').childElementCount).to.be(2);
		});

		it('should remove the id from the cloned node', function () {
			AppHeader.init();
			var navEl = document.createElement('nav');
			navEl.id = 'ad1527b9';
			document.body.appendChild(navEl);

			AppHeader.setNav('#ad1527b9');

			var headerEl = getHeaderEl();
			var navContainerEl = getNavContainerEl(headerEl);

			expect(navContainerEl.firstChild.id).to.be('');
		});

	});

	describe('session', function () {

		it('should sign the user in when the Sign In nav item is clicked', function () {
			AppHeader.init();
			var headerEl = getHeaderEl();
			var signInEl = headerEl.querySelector('[data-action="sign-in"]');
			sandbox.stub(session, 'login');

			dispatchEvent(signInEl, 'click');

			expect(session.login.calledWith(window.location.href)).to.be(true);
		});

		it('should sign the user out when the Sign Out dropdown menu item is clicked', function () {
			AppHeader.init();
			var headerEl = getHeaderEl();
			var signOutEl = headerEl.querySelector('[data-action="sign-out"]');
			sandbox.stub(session, 'logout');

			dispatchEvent(signOutEl, 'click');

			expect(session.logout.calledWith(window.location.href)).to.be(true);
		});

		it('should be in the initializing state when the session state is not Success, NoToken, or NoSession', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Unknown);
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'initializing')).to.be(true);
		});

		it('should be in the signed in state when the session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Success);
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed out state when the session state is NoSession', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoSession);
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed out state when the session state is NoToken', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoToken);
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed in state when a session SessionStateKnownEvent is emitted and session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Success);
			sandbox.stub(session, 'on').withArgs(session.SessionStateKnownEvent).yields();
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed in state when a session SessionStateKnownEvent is emitted and session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoSession);
			sandbox.stub(session, 'on').withArgs(session.SessionStateKnownEvent).yields();
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed in state when a session LoginEvent is emitted', function () {
			sandbox.stub(session, 'on').withArgs(session.LoginEvent).yields();
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed out state when a session LogoutEvent is emitted', function () {
			sandbox.stub(session, 'on').withArgs(session.LogoutEvent).yields();
			AppHeader.init();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

	});

});

function getHeaderEl() {
	return document.querySelector('.o-app-header');
}

function getNavContainerEl(headerEl) {
	return headerEl.querySelector('.o-app-header__page-nav-container');
}

function isHeaderInState(headerEl, state) {
	var selector = '[data-show="state:signed-in"],[data-show="state:signed-out"]';
	var elements = headerEl.querySelectorAll(selector);
	var isInState = true;

	if (state === 'initializing') {
		forEach(elements, function (idx, element) {
			if (element.style.display !== 'none') isInState = false;
		});
	} else if (state === 'signed-in') {
		forEach(elements, function (idx, element) {
			if (element.getAttribute('data-show') === 'state:signed-in' && element.style.display === 'none') isInState = false;
			if (element.getAttribute('data-show') === 'state:signed-out' && element.style.display !== 'none') isInState = false;
		});
	} else if (state === 'signed-out') {
		forEach(elements, function (idx, element) {
			if (element.getAttribute('data-show') === 'state:signed-in' && element.style.display !== 'none') isInState = false;
			if (element.getAttribute('data-show') === 'state:signed-out' && element.style.display === 'none') isInState = false;
		});
	}

	return isInState;
}
