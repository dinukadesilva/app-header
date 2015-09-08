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

	describe('#init(element, options)', function () {

		it ('should throw an error when options.session is a string and the session object is undefined in the global scope', function () {
			expect(AppHeader.init.bind(null, { session: 'nonexistent' })).to.throwException(/unable to find window\[\'nonexistent\'\]/);
		});

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

		it('should set the light theme', function () {
			var options = { theme: 'light' };

			AppHeader.init(options);

			var appHeaderEl = getHeaderEl();

			expect(appHeaderEl.classList.contains('o-header--theme-light')).to.be(true);
		});

		it('should resolve the nav links', function () {
			var consoleBaseUrl = 'https://example.org';
			var options = {
				consoleBaseUrl: consoleBaseUrl,
				links: {
					home: '{consoleBaseUrl}/home',
					'my-account': '{consoleBaseUrl}/my-account'
				}
			};
			AppHeader.init(options);

			var appHeaderEl = getHeaderEl();

			function resolveLink(key) {
				return options.links[key].replace('{consoleBaseUrl}', consoleBaseUrl);
			}

			expect(appHeaderEl.querySelector('[data-link="my-account"]').href).to.be(resolveLink('my-account'));
			expect(appHeaderEl.querySelector('[data-link="home"]').href).to.be(resolveLink('home'));
		});

		it('should add a click handler when link target is a function', function (done) {
			function handleHomeClick(e) {
				e.preventDefault();
				done();
			}

			AppHeader.init({
				links: {
					home: handleHomeClick
				}
			});

			var appHeaderEl = getHeaderEl();
			var homeEl = appHeaderEl.querySelector('[data-link="home"]');

			dispatchEvent(homeEl, 'click');
		});

		it('should merge the links object', function () {
			var consoleBaseUrl = 'https://example.com';
			var options = {
				consoleBaseUrl: consoleBaseUrl,
				links: {
					home: 'https://example.com/home'
				}
			};

			AppHeader.init(options);

			var appHeaderEl = getHeaderEl();
			var myAccountLinkEl = appHeaderEl.querySelector('[data-link="my-account"]');

			expect(myAccountLinkEl.href).to.be(AppHeader.defaultSettings.links['my-account'].replace('{consoleBaseUrl}', consoleBaseUrl));
		});

		it('should emit oAppHeader.help.toggle when the Help nav item is clicked', function (done) {
			AppHeader.init();

			var appHeaderEl = getHeaderEl();
			var helpNavEl = appHeaderEl.querySelector('[data-link="help"]');

			appHeaderEl.addEventListener('oAppHeader.help.toggle', done.bind(null, null));

			dispatchEvent(helpNavEl, 'click');
		});

		describe('Help nav item dropdown menu', function () {

			it('should render the Help nav item as a dropdown menu when the link is an object', function () {
				var options = {
					links: {
						help: {
							'Foo': 'https://example.org/foo',
							'Bar': 'https://example.org/bar'
						}
					}
				};

				AppHeader.init(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);

				expect(helpNavItemEl.firstChild.classList.contains('o-dropdown-menu')).to.be(true);
			});

			it('should handle an object value', function () {
				var options = {
					links: {
						help: {
							'Foo': { href: 'https://example.org/foo', target: '_blank' }
						}
					}
				};

				AppHeader.init(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				var menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.href).to.be(options.links.help.Foo.href);
				expect(menuItemLinkEl.getAttribute('target')).to.be(options.links.help.Foo.target);
			});

			it('should handle a function value', function (done) {
				var options = {
					links: {
						help: {
							'Foo': done.bind(null, null)
						}
					}
				};

				AppHeader.init(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				var menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.getAttribute('href')).to.be('#');

				dispatchEvent(menuItemLinkEl, 'click');
			});

		});

	});

	describe('.setMenu(options)', function () {

		describe('options.showAllCoursesMenuItem', function () {

			it('should render a menu item with a link to the course listing page when the showAllCoursesMenuItem option is true', function () {
				var options = {
					showAllCoursesMenuItem: true
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var accountMenuItemEls = getAccountMenuItemEls(headerEl);

				expect(accountMenuItemEls[0].querySelector('a').textContent).to.match(/All courses$/);
			});

			it('should hide the course listing menu item in tablet and wider viewports when the showAllCoursesMenuItem option is true', function () {
				var options = {
					showAllCoursesMenuItem: true
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var accountMenuItemEls = getAccountMenuItemEls(headerEl);

				expect(accountMenuItemEls[0].classList.contains('o-header__viewport-tablet--hidden')).to.be(true);
				expect(accountMenuItemEls[0].classList.contains('o-header__viewport-desktop--hidden')).to.be(true);
			});

			it('should resolve the link to the course listing page using the consoleBaseUrl setting when the showAllCoursesMenuItem option is true', function () {
				var options = {
					showAllCoursesMenuItem: true
				};

				AppHeader.init({ consoleBaseUrl: 'https://example.com' });
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var accountMenuItemEls = getAccountMenuItemEls(headerEl);

				var expectedUrl = AppHeader.defaultSettings.links.home.replace('{consoleBaseUrl}', 'https://example.com');

				expect(accountMenuItemEls[0].querySelector('a').href).to.be(expectedUrl);
			});

		});

		describe('options.siteNav', function () {

			it('should inject the site nav menu items when options.siteNav is an object', function () {
				var options = {
					siteNav: {
						items: {
							Foo: 'http://example.com/foo',
							Bar: 'http://example.com/bar'
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

				expect(siteNavMenuItemEls.length).to.be(2);
				expect(siteNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
				expect(siteNavMenuItemEls[0].querySelector('a').href).to.be(options.siteNav.items.Foo);
				expect(siteNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
				expect(siteNavMenuItemEls[1].querySelector('a').href).to.be(options.siteNav.items.Bar);
			});

			it('should inject the menu items after the all courses menu item when options.showAllCoursesMenuItem is true', function () {
				var options = {
					showAllCoursesMenuItem: true,
					siteNav: {
						items: {
							Foo: 'http://example.com/foo',
							Bar: 'http://example.com/bar'
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var accountMenuItemEls = getAccountMenuItemEls(headerEl);

				expect(accountMenuItemEls[0].querySelector('a').textContent).to.match(/All courses$/);
				expect(accountMenuItemEls[1].querySelector('a').textContent).to.be('Foo');
				expect(accountMenuItemEls[1].querySelector('a').href).to.be(options.siteNav.items.Foo);
				expect(accountMenuItemEls[2].querySelector('a').textContent).to.be('Bar');
				expect(accountMenuItemEls[2].querySelector('a').href).to.be(options.siteNav.items.Bar);
			});

			it('should replace the existing site nav menu items on each invocation', function () {
				var options = {
					siteNav: {
						items: {
							Foo: 'http://example.com/foo',
							Bar: 'http://example.com/bar'
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

				expect(siteNavMenuItemEls.length).to.be(2);
				expect(siteNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
				expect(siteNavMenuItemEls[0].querySelector('a').href).to.be(options.siteNav.items.Foo);
				expect(siteNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
				expect(siteNavMenuItemEls[1].querySelector('a').href).to.be(options.siteNav.items.Bar);
			});

			it('should render the site nav menu item as a link when the href option is a string', function () {
				var href = 'http://example.com/foo';
				var options = {
					siteNav: {
						items: {
							Foo: { href: href },
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

				expect(siteNavMenuItemEls[0].querySelector('a').href).to.be(href);
			});

			it('should add a click handler when the onClick option is a function', function () {
				var handler = sinon.spy();
				var options = {
					siteNav: {
						items: {
							Foo: { onClick: handler }
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

				dispatchEvent(siteNavMenuItemEls[0].querySelector('a'), 'click');

				expect(handler.calledOnce).to.be(true);
			});

			it('should throw an error when the onClick option is not a function', function () {
				var options = {
					siteNav: {
						items: {
							Foo: { onClick: 'invalid' }
						}
					}
				};

				AppHeader.init();

				expect(AppHeader.setMenu.bind(AppHeader, options)).to.throwException(/Click handler must be a function/);
			});

		});

		describe('options.appNav', function () {

			it('should inject the app nav menu items when options.appNav is an object', function () {
				var options = {
					appNav: {
						items: {
							Foo: 'http://example.com/foo',
							Bar: 'http://example.com/bar'
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				expect(appNavMenuItemEls.length).to.be(2);
				expect(appNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
				expect(appNavMenuItemEls[0].querySelector('a').href).to.be(options.appNav.items.Foo);
				expect(appNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
				expect(appNavMenuItemEls[1].querySelector('a').href).to.be(options.appNav.items.Bar);
			});

			it('should replace the existing app nav menu items on each invocation', function () {
				var options = {
					appNav: {
						items: {
							Foo: 'http://example.com/foo',
							Bar: 'http://example.com/bar'
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				expect(appNavMenuItemEls.length).to.be(2);
				expect(appNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
				expect(appNavMenuItemEls[0].querySelector('a').href).to.be(options.appNav.items.Foo);
				expect(appNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
				expect(appNavMenuItemEls[1].querySelector('a').href).to.be(options.appNav.items.Bar);
			});

			it('should render the app nav menu item as a link when the href option is a string', function () {
				var href = 'http://example.com/foo';
				var options = {
					appNav: {
						items: {
							Foo: { href: href },
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				expect(appNavMenuItemEls[0].querySelector('a').href).to.be(href);
			});

			it('should render the app nav menu item as disabled when the active option is true', function () {
				var options = {
					appNav: {
						items: {
							Foo: { href: 'http://example.com/foo', active: true },
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				expect(appNavMenuItemEls[0].classList.contains('o-dropdown-menu__menu-item--disabled')).to.be(true);
			});

			it('should add a click handler when the onClick option is a function', function () {
				var handler = sinon.spy();
				var options = {
					appNav: {
						items: {
							Foo: { onClick: handler }
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				dispatchEvent(appNavMenuItemEls[0].querySelector('a'), 'click');

				expect(handler.calledOnce).to.be(true);
			});

			it('should throw an error when the onClick option is not a function', function () {
				var options = {
					appNav: {
						items: {
							Foo: { onClick: 'invalid' }
						}
					}
				};

				AppHeader.init();

				expect(AppHeader.setMenu.bind(AppHeader, options)).to.throwException(/Click handler must be a function/);
			});

			it('should insert a heading menu item when the heading option is defined', function () {
				var text = 'Foo';
				var href = 'https://example.com/';
				var options = {
					appNav: {
						heading: {
							text: text,
							href: href
						}
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

				expect(appNavMenuItemEls[0].classList.contains('o-dropdown-menu__heading')).to.be(true);
				expect(appNavMenuItemEls[0].querySelector('a').textContent).to.be(text);
				expect(appNavMenuItemEls[0].querySelector('a').href).to.be(href);
			});

		});

		describe('options.appAbout', function () {

			it('should render a menu item with a link to the app info when the appAbout option is defined', function () {
				var title = 'About Foo';
				var href = 'https://example.com/about';
				var options = {
					appAbout: {
						title: title,
						href: href
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appAboutMenuItemEl = getAppAboutMenuItemEl(headerEl);

				expect(appAboutMenuItemEl.classList.contains('o-dropdown-menu__menu-item')).to.be(true);
				expect(appAboutMenuItemEl.querySelector('a').textContent).to.be(title);
				expect(appAboutMenuItemEl.querySelector('a').href).to.be(href);
			});

			it('should add a click handler when onClick is a function', function (done) {
				var options = {
					appAbout: {
						onClick: done.bind(null, null)
					}
				};

				AppHeader.init();
				AppHeader.setMenu(options);

				var headerEl = getHeaderEl();
				var appAboutMenuItemEl = getAppAboutMenuItemEl(headerEl);

				dispatchEvent(appAboutMenuItemEl.querySelector('a'), 'click');
			});

			it('should throw an error when onClick is not a function', function () {
				var options = {
					appAbout: {
						onClick: 'invalid'
					}
				};

				AppHeader.init();

				expect(AppHeader.setMenu.bind(AppHeader, options)).to.throwException(/Click handler must be a function/);
			});

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

		it('should not display the Sign In nav item when the session option is false', function () {
			var options = {
				session: false
			};

			AppHeader.init(options);
			var headerEl = getHeaderEl();

			expect(getAccountMenuEl(headerEl)).to.be(null);
		});

	});

});

function getHeaderEl() {
	return document.querySelector('.o-app-header');
}

function getAccountMenuEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-account');
}

function getAccountMenuItemEls(headerEl) {
	return getAccountMenuEl(headerEl).querySelectorAll('.o-dropdown-menu__menu-item');
}

function getSiteNavMenuItemEls(headerEl) {
	return getAccountMenuEl(headerEl).querySelectorAll('[data-nav-item-type="site"].o-dropdown-menu__menu-item');
}

function getAppNavMenuItemEls(headerEl) {
	return getAccountMenuEl(headerEl).querySelectorAll('.o-app-header__menu-app-nav .o-dropdown-menu__menu-item');
}

function getAppAboutMenuItemEl(headerEl) {
	return getAccountMenuEl(headerEl).querySelector('[data-link="my-account"]')
		.parentElement
		.previousElementSibling
		.previousElementSibling;
}

function getHelpNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-help');
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
