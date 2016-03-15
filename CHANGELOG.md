<a name="0.1.0"></a>
# [0.1.0](https://github.com/Pearson-Higher-Ed/app-header/compare/1.0.0...v0.1.0) (2016-03-15)


### Bug Fixes

* removed eroneous change to demos, not sure how it got in there, auto-generated i ([866ec68](https://github.com/Pearson-Higher-Ed/app-header/commit/866ec68))

### Features

* Allow eventing mode and config changes. ([da102c6](https://github.com/Pearson-Higher-Ed/app-header/commit/da102c6))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/Pearson-Higher-Ed/app-header/compare/1.0.0-rc.2...1.0.0) (2015-10-29)


### Features

* add -app-header-height-mobile Sass variable ([c02591a](https://github.com/Pearson-Higher-Ed/app-header/commit/c02591a))



<a name="1.0.0-rc.2"></a>
# [1.0.0-rc.2](https://github.com/Pearson-Higher-Ed/app-header/compare/v1.0.0-rc.1...1.0.0-rc.2) (2015-10-06)


### Features

* add onLogin and onLogout callback options ([aa2867f](https://github.com/Pearson-Higher-Ed/app-header/commit/aa2867f))
* add support for modes ([1dbc352](https://github.com/Pearson-Higher-Ed/app-header/commit/1dbc352))


### BREAKING CHANGES

* The `session` option has been removed. Consumers may
provide `onLogin` or `onLogout` callback functions and/or subscribe to the
`oAppHeader.login` or `oAppHeader.logout` events, depending on which
mode is configured.



<a name="1.0.0-rc.1"></a>
# [1.0.0-rc.1](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.8.0...v1.0.0-rc.1) (2015-09-18)


### Bug Fixes

* aria-labelledby attributes for dropdown menus ([4e0ff69](https://github.com/Pearson-Higher-Ed/app-header/commit/4e0ff69))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.7.0...v0.8.0) (2015-09-17)


### Bug Fixes

* clicking 'Help' nav item should collapse the user menu ([036cca3](https://github.com/Pearson-Higher-Ed/app-header/commit/036cca3)), closes [#14](https://github.com/Pearson-Higher-Ed/app-header/issues/14)
* maintain a single instance in main ([e0f9de3](https://github.com/Pearson-Higher-Ed/app-header/commit/e0f9de3))
* set menu text to a default value when user.givenName is undefined ([9f73618](https://github.com/Pearson-Higher-Ed/app-header/commit/9f73618))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.6.0...v0.7.0) (2015-09-15)


### Bug Fixes

* lint errors ([361b8e5](https://github.com/Pearson-Higher-Ed/app-header/commit/361b8e5))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.5.0...v0.6.0) (2015-09-15)


### Bug Fixes

* incremental-dom bower incompatibility ([557507c](https://github.com/Pearson-Higher-Ed/app-header/commit/557507c))
* remove checks in session event handlers ([e7cdf83](https://github.com/Pearson-Higher-Ed/app-header/commit/e7cdf83))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.4.0...v0.5.0) (2015-09-15)




<a name="0.4.0"></a>
# [0.4.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.3.0...v0.4.0) (2015-09-11)


### Bug Fixes

* chevron icon not displaying in menu toggle ([b01aabd](https://github.com/Pearson-Higher-Ed/app-header/commit/b01aabd))
* site nav menu items should be hidden on tablet and desktop viewports ([7d3a189](https://github.com/Pearson-Higher-Ed/app-header/commit/7d3a189))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.2.0...v0.3.0) (2015-09-10)


### Bug Fixes

* add a divider between the My Account and Sign Out menu items ([26e593e](https://github.com/Pearson-Higher-Ed/app-header/commit/26e593e))
* throw a meaningful error when session config property is a string and the object ([4134832](https://github.com/Pearson-Higher-Ed/app-header/commit/4134832))

### Features

* add option to render '← All courses' menu item ([3416da4](https://github.com/Pearson-Higher-Ed/app-header/commit/3416da4))
* add option to render menu item for info about the application ([1a448e6](https://github.com/Pearson-Higher-Ed/app-header/commit/1a448e6))
* add support for site nav items in the menu ([3a569b5](https://github.com/Pearson-Higher-Ed/app-header/commit/3a569b5))
* remove support for passing a function in the user option ([358a0ef](https://github.com/Pearson-Higher-Ed/app-header/commit/358a0ef))
* support additional options for setMenu(options) ([037c94b](https://github.com/Pearson-Higher-Ed/app-header/commit/037c94b))
* support headings in the app nav menu items ([8d684bd](https://github.com/Pearson-Higher-Ed/app-header/commit/8d684bd))


### BREAKING CHANGES

* s:

- The  configuration property no longer supports passing a callback function. The value for this property *must* be an object



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.1.0...v0.2.0) (2015-09-01)


### Bug Fixes

* i elements in the account menu should inherit color ([6736ef2](https://github.com/Pearson-Higher-Ed/app-header/commit/6736ef2))

### Features

* update o-header version to 0.10.0 ([48b79b6](https://github.com/Pearson-Higher-Ed/app-header/commit/48b79b6))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.0.5...v0.1.0) (2015-09-01)


### Bug Fixes

* change aria-role to role ([26dbd90](https://github.com/Pearson-Higher-Ed/app-header/commit/26dbd90))
* remove menu items from the tab order ([a98e46a](https://github.com/Pearson-Higher-Ed/app-header/commit/a98e46a))

### Features

* bump o-dropdown-menu version ([2cda8da](https://github.com/Pearson-Higher-Ed/app-header/commit/2cda8da))
* redesign ([4e94a84](https://github.com/Pearson-Higher-Ed/app-header/commit/4e94a84))
* register click handler when linkMap value is a function ([28f98b0](https://github.com/Pearson-Higher-Ed/app-header/commit/28f98b0))


### BREAKING CHANGES

* s

- New version of o-dropdown-menu



<a name="0.0.5"></a>
## [0.0.5](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.0.4...v0.0.5) (2015-07-31)




<a name="0.0.4"></a>
## [0.0.4](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.0.3...v0.0.4) (2015-07-29)


### Bug Fixes

* Pi library always returns NoSession when hasValidSession is called ([f9057a2](https://github.com/Pearson-Higher-Ed/app-header/commit/f9057a2))

### Features

* make header fixed by default ([d4b1a40](https://github.com/Pearson-Higher-Ed/app-header/commit/d4b1a40))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.0.2...v0.0.3) (2015-07-28)


### Features

* add oAppHeader.help.toggle event ([4133749](https://github.com/Pearson-Higher-Ed/app-header/commit/4133749))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/Pearson-Higher-Ed/app-header/compare/v0.0.1...v0.0.2) (2015-07-27)


### Features

* page-oriented nav ([93d9f39](https://github.com/Pearson-Higher-Ed/app-header/commit/93d9f39))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/Pearson-Higher-Ed/app-header/compare/4ec4478...v0.0.1) (2015-07-10)


### Features

* initial implementation of the basic features ([4ec4478](https://github.com/Pearson-Higher-Ed/app-header/commit/4ec4478))



