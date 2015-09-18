/* jshint ignore: start */

// *** DO NOT MODIFY THIS FILE ***
// This file was generated from src/html/header.template
// Regenerate using bin/gen-template

var incrementalDom = require('../../lib/incremental-dom');
var elementOpen = incrementalDom.elementOpen;
var elementClose = incrementalDom.elementClose;
var elementVoid = incrementalDom.elementVoid;
var text = incrementalDom.text;

module.exports = template;

function template (data, user, handlers, translate) {
  var _ = {
  			get: require('./utils/get')
  		};

  		var siteNavItems = _.get(data, 'menu.siteNav.items');
  		var appNavHeading = _.get(data, 'menu.appNav.heading');
  		var appNavItems = _.get(data, 'menu.appNav.items');
  		var appAbout = _.get(data, 'menu.appAbout') || {};
  elementOpen("div", null, ["class", "o-header__container"])
    elementOpen("section", null, ["class", "o-header__section"])
      elementOpen("div", null, ["class", "o-header__brand"])
        if (data.session && user.isAuthenticated) {
          elementOpen("a", null, null, "href", data.links.home)
            elementOpen("div", null, ["class", "o-header__logo o-header__logo--pearson"])
            elementClose("div")
          elementClose("a")
        }
        if (!user.isAuthenticated) {
          elementOpen("div", null, ["class", "o-header__logo o-header__logo--pearson"])
          elementClose("div")
        }
      elementClose("div")
    elementClose("section")
    elementOpen("section", null, ["class", "o-header__section o-header__section--right"])
      elementOpen("nav", null, ["class", "o-header__nav"])
        elementOpen("ul", null, ["class", "o-header__nav-items"])
          elementOpen("li", null, ["class", "o-header__nav-item o-app-header__nav-item-help"])
            if (!data.help) {
              elementOpen("a", null, ["href", "#"], "onclick", function ($event) {handlers.handleHelpNavItemClick($event)})
                text("" + (translate('Help')) + "")
              elementClose("a")
            }
            if (typeof data.help === 'string') {
              elementOpen("a", null, null, "href", data.help)
                text("" + (translate('Help')) + "")
              elementClose("a")
            }
            if (typeof data.help === 'object') {
              elementOpen("div", null, ["class", "o-dropdown-menu o-dropdown-menu--right"])
                elementOpen("a", null, ["href", "#", "id", "o-app-header-help-menu-toggle", "class", "o-dropdown-menu__toggle", "data-toggle", "dropdown-menu", "aria-haspopup", "true", "aria-expanded", "false"])
                  text("" + (translate('Help')) + "")
                elementClose("a")
                elementOpen("ul", null, ["class", "o-dropdown-menu__menu-items", "role", "menu", "aria-labelledby", "o-app-header-menu-toggle-help"])
                  ;(Array.isArray(data.help) ? data.help : Object.keys(data.help)).forEach(function(key, $index) {
                    elementOpen("li", $index, ["class", "o-dropdown-menu__menu-item", "role", "presentation"])
                      if (typeof data.help[key] === 'string') {
                        elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", data.help[key])
                          text("" + (key) + "")
                        elementClose("a")
                      }
                      if (data.help[key].href) {
                        elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", data.help[key].href, "target", data.help[key].target)
                          text("" + (key) + "")
                        elementClose("a")
                      }
                      if (typeof data.help[key].onClick === 'function') {
                        elementOpen("a", null, ["role", "menuitem", "href", "#", "tabindex", "-1"], "onclick", function ($event) {data.help[key].onClick($event)})
                          text("" + (key) + "")
                        elementClose("a")
                      }
                    elementClose("li")
                  }, data.help)
                elementClose("ul")
              elementClose("div")
            }
          elementClose("li")
          if (data.session && !user.isAuthenticated) {
            elementOpen("li", null, ["class", "o-header__nav-item o-app-header__nav-item-sign-in"])
              elementOpen("a", null, ["href", "#"], "onclick", function ($event) {handlers.handleLogin($event)})
                text("" + (translate('Sign In')) + "")
              elementClose("a")
            elementClose("li")
          }
          if (user.isAuthenticated) {
            elementOpen("li", null, ["class", "o-header__nav-item o-app-header__nav-item-menu"])
              elementOpen("div", null, ["class", "o-dropdown-menu o-dropdown-menu--right o-app-header__menu-menu"])
                elementOpen("a", null, ["href", "#", "class", "o-dropdown-menu__toggle", "data-toggle", "dropdown-menu", "aria-haspopup", "true", "aria-expanded", "false"])
                  elementOpen("span", null, ["id", "o-app-header-user-menu-label", "class", "o-app-header--sr-only"])
                    text("" + (translate('User account menu')) + "")
                  elementClose("span")
                  elementOpen("span", null, ["class", "o-app-header__username o-app-header--truncate o-header__viewport-tablet--visible o-header__viewport-desktop--visible"])
                    text("" + (user.givenName || translate('Menu')) + " ")
                    elementOpen("i", null, ["class", "o-app-header__icon o-app-header__icon-chevron-down"])
                    elementClose("i")
                  elementClose("span")
                  elementOpen("span", null, ["class", "o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden"])
                    text("" + (translate('Menu')) + " ")
                    elementOpen("i", null, ["class", "o-app-header__icon o-app-header__icon-chevron-down"])
                    elementClose("i")
                  elementClose("span")
                elementClose("a")
                elementOpen("ul", null, ["class", "o-dropdown-menu__menu-items", "role", "menu", "aria-labelledby", "o-app-header-user-menu-label"])
                  if (data.menu.showAllCoursesMenuItem) {
                    elementOpen("li", null, ["class", "o-app-header__menu-item-all-courses o-dropdown-menu__menu-item o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden", "role", "presentation"])
                      elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", data.links.home)
                        elementOpen("span", null, ["class", "o-app-header__icon-left-arrow"])
                        elementClose("span")
                        text(" " + (translate('All courses')) + "")
                      elementClose("a")
                    elementClose("li")
                  }
                  if (data.menu.showAllCoursesMenuItem) {
                    elementOpen("li", null, ["class", "o-dropdown-menu__divider o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden", "role", "presentation"])
                    elementClose("li")
                  }
                  if (typeof siteNavItems !== 'undefined') {
                    ;(Array.isArray(siteNavItems) ? siteNavItems : Object.keys(siteNavItems)).forEach(function(key, $index) {
                      elementOpen("li", $index, ["class", "o-app-header__menu-item-site-nav o-dropdown-menu__menu-item o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden", "role", "presentation"])
                        if (typeof siteNavItems[key] === 'string') {
                          elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", siteNavItems[key])
                            text("" + (key) + "")
                          elementClose("a")
                        }
                        if (siteNavItems[key].href) {
                          elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", siteNavItems[key].href, "target", siteNavItems[key].target)
                            text("" + (key) + "")
                          elementClose("a")
                        }
                        if (typeof siteNavItems[key].onClick === 'function') {
                          elementOpen("a", null, ["role", "menuitem", "href", "#", "tabindex", "-1"], "onclick", function ($event) {siteNavItems[key].onClick($event)})
                            text("" + (key) + "")
                          elementClose("a")
                        }
                      elementClose("li")
                    }, siteNavItems)
                    elementOpen("li", null, ["class", "o-dropdown-menu__divider o-dropdown-menu__menu-item o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden", "role", "presentation"])
                    elementClose("li")
                  }
                  if (appNavHeading || appNavItems) {
                    elementOpen("li", null, ["class", "o-header__viewport-tablet--hidden o-header__viewport-desktop--hidden"])
                      elementOpen("ul", null, ["class", "o-app-header__menu-items-app-nav"])
                        if (appNavHeading) {
                          if (typeof appNavHeading !== 'undefined') {
                            elementOpen("li", null, ["class", "o-app-header__menu-item-app-nav o-dropdown-menu__menu-item o-dropdown-menu__heading", "role", "presentation"])
                              if (appNavHeading.href) {
                                elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", appNavHeading.href)
                                  text("" + (appNavHeading.text) + "")
                                elementClose("a")
                              }
                            elementClose("li")
                          }
                        }
                        if (appNavItems) {
                          ;(Array.isArray(appNavItems) ? appNavItems : Object.keys(appNavItems)).forEach(function(key, $index) {
                            elementOpen("li", $index, ["role", "presentation"], "class", appNavItems[key].active ? 'o-app-header__menu-item-app-nav o-dropdown-menu__menu-item o-dropdown-menu__menu-item--disabled' : 'o-app-header__menu-item-app-nav o-dropdown-menu__menu-item')
                              if (typeof appNavItems[key] === 'string') {
                                elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", appNavItems[key])
                                  text("" + (key) + "")
                                elementClose("a")
                              }
                              if (appNavItems[key].href) {
                                elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", appNavItems[key].href, "target", appNavItems[key].target)
                                  text("" + (key) + "")
                                elementClose("a")
                              }
                              if (typeof appNavItems[key].onClick === 'function') {
                                elementOpen("a", null, ["role", "menuitem", "href", "#", "tabindex", "-1"], "onclick", function ($event) {appNavItems[key].onClick($event)})
                                  text("" + (key) + "")
                                elementClose("a")
                              }
                            elementClose("li")
                          }, appNavItems)
                        }
                      elementClose("ul")
                    elementClose("li")
                  }
                  if (appAbout) {
                    elementOpen("li", null, ["class", "o-app-header__menu-item-app-about o-dropdown-menu__menu-item", "role", "presentation"])
                      if (appAbout.href) {
                        elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", appAbout.href)
                          text("" + (appAbout.text) + "")
                        elementClose("a")
                      }
                      if (appAbout.onClick) {
                        elementOpen("a", null, ["role", "menuitem", "href", "#", "tabindex", "-1"], "onclick", function ($event) {appAbout.onClick($event)})
                          text("" + (appAbout.text) + "")
                        elementClose("a")
                      }
                    elementClose("li")
                    elementOpen("li", null, ["class", "o-dropdown-menu__divider", "role", "presentation"])
                    elementClose("li")
                  }
                  elementOpen("li", null, ["class", "o-dropdown-menu__menu-item", "role", "presentation"])
                    elementOpen("a", null, ["role", "menuitem", "tabindex", "-1"], "href", data.links.myAccount)
                      text("" + (translate('My Account')) + "")
                    elementClose("a")
                  elementClose("li")
                  elementOpen("li", null, ["class", "o-dropdown-menu__divider", "role", "presentation"])
                  elementClose("li")
                  elementOpen("li", null, ["class", "o-dropdown-menu__menu-item o-app-header__menu-item-sign-out", "role", "presentation"])
                    elementOpen("a", null, ["role", "menuitem", "href", "#", "tabindex", "-1"], "onclick", function ($event) {handlers.handleLogout($event)})
                      text("" + (translate('Sign Out')) + "")
                    elementClose("a")
                  elementClose("li")
                elementClose("ul")
              elementClose("div")
            elementClose("li")
          }
        elementClose("ul")
      elementClose("nav")
    elementClose("section")
  elementClose("div")
}