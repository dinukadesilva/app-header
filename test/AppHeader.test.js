/*global sinon, describe, it, before, beforeEach*/
'use strict';

var expect = require('expect.js');
var dispatchEvent = require('../src/js/utils/dom').dispatchEvent;
var forEach = require('../src/js/utils/forEach');
var AppHeader = require('../src/js/AppHeader');

describe('AppHeader:', function () {

	var sandbox, session;

	before(function () {
		sandbox = sinon.sandbox.create();
		session = require('./stubs/session');

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

	describe('new AppHeader(element, options):', function () {

		it ('should throw an error when options.session is a string and the session object is undefined in the global scope', function () {
			expect(AppHeader.init.bind(null, { session: 'nonexistent' })).to.throwException(/unable to find window\[\'nonexistent\'\]/);
		});

		it('should prepend to document.body when element is undefined', function () {
			new AppHeader();

			var appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should replace element when element is an instance of HTMLElement', function () {
			document.body.appendChild(document.createElement('div'));

			var el = document.createElement('div');
			document.body.appendChild(el);

			new AppHeader(el);

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

			new AppHeader('#app-header');

			var appHeaderEl = document.body.childNodes[1];

			expect(document.body.children.length).to.be(2);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should set role="banner"', function () {
			new AppHeader();

			var appHeaderEl = getHeaderEl();

			expect(appHeaderEl.getAttribute('role')).to.be('banner');
		});

		it('should set the light theme', function () {
			var options = { theme: 'light' };

			new AppHeader(options);

			var appHeaderEl = getHeaderEl();

			expect(appHeaderEl.classList.contains('o-header--theme-light')).to.be(true);
		});

		describe('Help nav item:', function () {

			it('should emit oAppHeader.help.toggle when the Help nav item is clicked', function (done) {
				new AppHeader();

				var appHeaderEl = getHeaderEl();
				var helpNavEl = getHelpNavItemEl(appHeaderEl);

				appHeaderEl.addEventListener('oAppHeader.help.toggle', done.bind(null, null));

				dispatchEvent(helpNavEl.querySelector('a'), 'click');
			});

			it('should render as a dropdown menu when options.help is an object', function () {
				var options = {
					help: {
						'Foo': 'https://example.org/foo',
						'Bar': 'https://example.org/bar'
					}
				};

				new AppHeader(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);

				expect(helpNavItemEl.firstChild.classList.contains('o-dropdown-menu')).to.be(true);
			});

			it('should render the Help menu menu item as a link when options.help[key] is an object', function () {
				var href = 'https://example.org/foo';
				var target = '_blank';
				var options = {
					help: {
						'Foo': { href: href, target: target }
					}
				};

				new AppHeader(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				var menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.href).to.be(href);
				expect(menuItemLinkEl.getAttribute('target')).to.be(target);
			});

			it('should register a click event listener for the Help menu menu item when options.help[key].onClick is a function', function (done) {
				var options = {
					help: {
						'Foo': { onClick: done.bind(null, null) }
					}
				};

				new AppHeader(options);

				var appHeaderEl = getHeaderEl();
				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				var menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.getAttribute('href')).to.be('#');

				dispatchEvent(menuItemLinkEl, 'click');
			});

			it('should close the account menu when clicked', function () {
				sandbox.stub(session, 'on').withArgs(session.LoginEvent).yields();

				new AppHeader();

				var appHeaderEl = getHeaderEl();
				var accountMenuEl = getMenuMenuEl(appHeaderEl);

				dispatchEvent(accountMenuEl, 'click');

				expect(accountMenuEl.classList.contains('o-dropdown-menu--expanded')).to.be(true);

				var helpNavItemEl = getHelpNavItemEl(appHeaderEl);

				dispatchEvent(helpNavItemEl.querySelector('a'), 'click');

				var accountMenuIconEls = accountMenuEl.querySelectorAll('.o-app-header__icon');

				expect(accountMenuEl.classList.contains('o-dropdown-menu--expanded')).to.be(false);

				forEach(accountMenuIconEls, function (idx, el) {
					expect(el.classList.contains('o-app-header__icon-chevron-up')).to.be(false);
					expect(el.classList.contains('o-app-header__icon-chevron-down')).to.be(true);
				});
			});

		});

		describe('Menu (user) nav item:', function () {

			beforeEach(function () {
				sandbox.stub(session, 'on').withArgs(session.LoginEvent).yields();
			});

			it('should set the menu toggle text content to a default value when user.givenName is undefined', function () {
				var options = {
					user: {}
				};

				new AppHeader(options);

				var headerEl = getHeaderEl();
				var usernameEl = getUsernameEl(headerEl);

				expect(usernameEl.textContent.trim()).to.be('Menu');
			});

			describe('showAllCoursesMenuItem:', function () {

				it('should render a menu item with a link to the course listing page when the showAllCoursesMenuItem option is true', function () {
					var options = {
						menu: {
							showAllCoursesMenuItem: true
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var allCoursesMenuItemEl = getAllCoursesMenuItemEl(headerEl);

					expect(allCoursesMenuItemEl.querySelector('a').textContent).to.match(/All courses$/);
				});

				it('should hide the course listing menu item in tablet and wider viewports when the showAllCoursesMenuItem option is true', function () {
					var options = {
						menu: {
							showAllCoursesMenuItem: true
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var allCoursesMenuItemEl = getAllCoursesMenuItemEl(headerEl);

					expect(allCoursesMenuItemEl.classList.contains('o-header__viewport-tablet--hidden')).to.be(true);
					expect(allCoursesMenuItemEl.classList.contains('o-header__viewport-desktop--hidden')).to.be(true);
				});

				it('should resolve the link to the course listing page using the consoleBaseUrl setting when the showAllCoursesMenuItem option is true', function () {
					var consoleBaseUrl = 'https://example.com';
					var options = {
						consoleBaseUrl: consoleBaseUrl,
						menu: {
							showAllCoursesMenuItem: true
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var allCoursesMenuItemEl = getAllCoursesMenuItemEl(headerEl);
					var expectedUrl = AppHeader.defaultSettings.links.home.replace('{consoleBaseUrl}', consoleBaseUrl);

					expect(allCoursesMenuItemEl.querySelector('a').href).to.be(expectedUrl);
				});

			});

			describe('siteNav:', function () {

				it('should render the site nav menu items when the menu.siteNav option is an object', function () {
					var options = {
						menu: {
							siteNav: {
								items: {
									Foo: 'http://example.com/foo',
									Bar: 'http://example.com/bar'
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

					expect(siteNavMenuItemEls.length).to.be(2);
					expect(siteNavMenuItemEls[0].classList.contains('o-header__viewport-tablet--hidden')).to.be(true);
					expect(siteNavMenuItemEls[0].classList.contains('o-header__viewport-desktop--hidden')).to.be(true);
					expect(siteNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
					expect(siteNavMenuItemEls[0].querySelector('a').href).to.be(options.menu.siteNav.items.Foo);
					expect(siteNavMenuItemEls[1].classList.contains('o-header__viewport-tablet--hidden')).to.be(true);
					expect(siteNavMenuItemEls[1].classList.contains('o-header__viewport-desktop--hidden')).to.be(true);
					expect(siteNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
					expect(siteNavMenuItemEls[1].querySelector('a').href).to.be(options.menu.siteNav.items.Bar);
				});

				it('should render the site nav menu item as a link when the href option is a string', function () {
					var href = 'http://example.com/foo';
					var options = {
						menu: {
							siteNav: {
								items: {
									Foo: { href: href },
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

					expect(siteNavMenuItemEls[0].querySelector('a').href).to.be(href);
				});

				it('should add a click handler when the onClick option is a function', function () {
					var handler = sinon.spy();
					var options = {
						menu: {
							siteNav: {
								items: {
									Foo: { onClick: handler }
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var siteNavMenuItemEls = getSiteNavMenuItemEls(headerEl);

					dispatchEvent(siteNavMenuItemEls[0].querySelector('a'), 'click');

					expect(handler.calledOnce).to.be(true);
				});

				it('should throw an error when the onClick option is not a function', function () {
					var options = {
						menu: {
							siteNav: {
								items: {
									Foo: { onClick: 'invalid' }
								}
							}
						}
					};

					expect(function () { new AppHeader(options); })
						.to.throwException(/value must be a function/);
				});

			});

			describe('appNav:', function () {

				it('should render the app nav menu items when the menu.appNav option is an object', function () {
					var item1href = 'http://example.com/foo';
					var item2href = 'http://example.com/bar';
					var options = {
						menu: {
							appNav: {
								items: {
									Foo: item1href,
									Bar: item2href
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

					expect(appNavMenuItemEls.length).to.be(2);
					expect(appNavMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
					expect(appNavMenuItemEls[0].querySelector('a').href).to.be(item1href);
					expect(appNavMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
					expect(appNavMenuItemEls[1].querySelector('a').href).to.be(item2href);
				});

				it('should render the menu item as a link when the href option is a string', function () {
					var href = 'http://example.com/foo';
					var options = {
						menu: {
							appNav: {
								items: {
									Foo: { href: href },
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

					expect(appNavMenuItemEls[0].querySelector('a').href).to.be(href);
				});

				it('should render the menu item as disabled when the active option is true', function () {
					var options = {
						menu: {
							appNav: {
								items: {
									Foo: { href: 'http://example.com/foo', active: true },
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

					expect(appNavMenuItemEls[0].classList.contains('o-dropdown-menu__menu-item--disabled')).to.be(true);
				});

				it('should add a click handler when the onClick option is a function', function () {
					var handler = sinon.spy();
					var options = {
						menu: {
							appNav: {
								items: {
									Foo: { onClick: handler }
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

					dispatchEvent(appNavMenuItemEls[0].querySelector('a'), 'click');

					expect(handler.calledOnce).to.be(true);
				});

				it('should throw an error when the onClick option is not a function', function () {
					var options = {
						menu: {
							appNav: {
								items: {
									Foo: { onClick: 'invalid' }
								}
							}
						}
					};

					expect(function () { new AppHeader(options); })
						.to.throwException(/value must be a function/);
				});

				it('should insert a heading menu item when the heading option is defined', function () {
					var text = 'Foo';
					var href = 'https://example.com/';
					var options = {
						menu: {
							appNav: {
								heading: {
									text: text,
									href: href
								}
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appNavMenuItemEls = getAppNavMenuItemEls(headerEl);

					expect(appNavMenuItemEls[0].classList.contains('o-dropdown-menu__heading')).to.be(true);
					expect(appNavMenuItemEls[0].querySelector('a').textContent).to.be(text);
					expect(appNavMenuItemEls[0].querySelector('a').href).to.be(href);
				});

			});

			describe('appAbout:', function () {

				it('should render the app info menu item when the appAbout option is defined', function () {
					var text = 'About Foo';
					var href = 'https://example.com/about';
					var options = {
						menu: {
							appAbout: {
								text: text,
								href: href
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appAboutMenuItemEl = getAppAboutMenuItemEl(headerEl);

					expect(appAboutMenuItemEl.classList.contains('o-dropdown-menu__menu-item')).to.be(true);
					expect(appAboutMenuItemEl.querySelector('a').textContent).to.be(text);
					expect(appAboutMenuItemEl.querySelector('a').href).to.be(href);
				});

				it('should add a click handler when onClick is a function', function () {
					var text = 'About Foo';
					var handler = sinon.spy();
					var options = {
						menu: {
							appAbout: {
								text: text,
								onClick: handler
							}
						}
					};

					new AppHeader(options);

					var headerEl = getHeaderEl();
					var appAboutMenuItemEl = getAppAboutMenuItemEl(headerEl);

					dispatchEvent(appAboutMenuItemEl.querySelector('a'), 'click');

					expect(appAboutMenuItemEl.querySelector('a').textContent).to.be(text);
					expect(handler.calledOnce).to.be(true);
				});

				it('should throw an error when onClick is not a function', function () {
					var options = {
						menu: {
							appAbout: {
								onClick: 'invalid'
							}
						}
					};

					expect(function () { new AppHeader(options); })
						.to.throwException(/value must be a function/);
				});

			});

		});

	});

	describe('session', function () {

		it('should sign the user in when the Sign In nav item is clicked', function () {
			sandbox.stub(session, 'login');
			new AppHeader();
			var headerEl = getHeaderEl();
			var signInNavEl = getSignInNavItemEl(headerEl);

			dispatchEvent(signInNavEl.querySelector('a'), 'click');

			expect(session.login.calledWith(window.location.href)).to.be(true);
		});

		it('should sign the user out when the Sign Out dropdown menu item is clicked', function () {
			sandbox.stub(session, 'on').withArgs(session.LoginEvent).yields();
			sandbox.stub(session, 'logout');
			new AppHeader();
			var headerEl = getHeaderEl();
			var signOutMenuItemEl = getSignOutMenuItemEl(headerEl);

			dispatchEvent(signOutMenuItemEl.querySelector('a'), 'click');

			expect(session.logout.calledWith(window.location.href)).to.be(true);

		});

		it('should be in the initializing state when the session state is not Success, NoToken, or NoSession', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Unknown);
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'initializing')).to.be(true);
		});

		it('should be in the signed in state when the session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Success);
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed out state when the session state is NoSession', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoSession);
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed out state when the session state is NoToken', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoToken);
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed in state when a session SessionStateKnownEvent is emitted and session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.Success);
			sandbox.stub(session, 'on').withArgs(session.SessionStateKnownEvent).yields();
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed in state when a session SessionStateKnownEvent is emitted and session state is Success', function () {
			sandbox.stub(session, 'hasValidSession').returns(session.NoSession);
			sandbox.stub(session, 'on').withArgs(session.SessionStateKnownEvent).yields();
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should be in the signed in state when a session LoginEvent is emitted', function () {
			sandbox.stub(session, 'on').withArgs(session.LoginEvent).yields();
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-in')).to.be(true);
		});

		it('should be in the signed out state when a session LogoutEvent is emitted', function () {
			sandbox.stub(session, 'on').withArgs(session.LogoutEvent).yields();
			new AppHeader();
			var headerEl = getHeaderEl();

			expect(isHeaderInState(headerEl, 'signed-out')).to.be(true);
		});

		it('should not display the Sign In nav item when the session option is false', function () {
			var options = {
				session: false
			};

			new AppHeader(options);
			var headerEl = getHeaderEl();

			expect(getMenuMenuEl(headerEl)).to.be(null);
		});

	});

});

function getHeaderEl() {
	return document.querySelector('.o-app-header');
}

function getHelpNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-help');
}

function getSignInNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-sign-in');
}

function getMenuMenuEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-menu');
}

function getAllCoursesMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-all-courses');
}

function getSiteNavMenuItemEls(headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item-site-nav');
}

function getAppNavMenuItemEls(headerEl) {
	return getMenuMenuEl(headerEl).querySelectorAll('.o-app-header__menu-item-app-nav');
}

function getAppAboutMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-app-about');
}

function getSignOutMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-sign-out');
}

function getUsernameEl(headerEl) {
	return headerEl.querySelector('.o-app-header__username');
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
