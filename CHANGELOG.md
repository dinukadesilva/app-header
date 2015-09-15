<a name="0.7.0"></a>
# [0.7.0](https://github.com/Pearson-Higher-Ed/o-app-header/compare/v0.6.0...v0.7.0) (2015-09-15)


### Bug Fixes

* lint errors ([361b8e5](https://github.com/Pearson-Higher-Ed/o-app-header/commit/361b8e5))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/Pearson-Higher-Ed/o-app-header/compare/v0.5.0...v0.6.0) (2015-09-15)


### Bug Fixes

* incremental-dom bower incompatibility ([557507c](https://github.com/Pearson-Higher-Ed/o-app-header/commit/557507c))
* remove checks in session event handlers ([e7cdf83](https://github.com/Pearson-Higher-Ed/o-app-header/commit/e7cdf83))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/Pearson-Higher-Ed/o-app-header/compare/v0.4.0...v0.5.0) (2015-09-15)

### Refactor
 * use Google incremental DOM ([7cd078b](https://github.com/Pearson-Higher-Ed/o-app-header/commit/7cd078ba69d9df2908675a2e543e6ca8da500101))

#### Breaking Changes

- `appAbout.title` is now `appAbout.text`
- `appNav.heading.title` is now `appNav.heading.text`

Note that the `locale` configuration option and i18n section have been removed from the documentation. This feature will be supported in the future but should not be used in the current version because the strings have not been properly translated.

<a name="0.4.0"></a>
# [0.4.0](https://github.com/Pearson-Higher-Ed/o-app-header/compare/v0.3.0...v0.4.0) (2015-09-11)


### Bug Fixes

* chevron icon not displaying in menu toggle ([b01aabd](https://github.com/Pearson-Higher-Ed/o-app-header/commit/b01aabd))
* site nav menu items should be hidden on tablet and desktop viewports ([7d3a189](https://github.com/Pearson-Higher-Ed/o-app-header/commit/7d3a189))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/Pearson-Higher-Ed/o-app-header/compare/v0.2.0...v0.3.0) (2015-09-10)


### Bug Fixes

* add a divider between the My Account and Sign Out menu items ([26e593e](https://github.com/Pearson-Higher-Ed/o-app-header/commit/26e593e))
* throw a meaningful error when session config property is a string and the object ([4134832](https://github.com/Pearson-Higher-Ed/o-app-header/commit/4134832))

### Features

* add option to render '← All courses' menu item ([3416da4](https://github.com/Pearson-Higher-Ed/o-app-header/commit/3416da4))
* add option to render menu item for info about the application ([1a448e6](https://github.com/Pearson-Higher-Ed/o-app-header/commit/1a448e6))
* add support for site nav items in the menu ([3a569b5](https://github.com/Pearson-Higher-Ed/o-app-header/commit/3a569b5))
* remove support for passing a function in the user option ([358a0ef](https://github.com/Pearson-Higher-Ed/o-app-header/commit/358a0ef))
* support additional options for setMenu(options) ([037c94b](https://github.com/Pearson-Higher-Ed/o-app-header/commit/037c94b))
* support headings in the app nav menu items ([8d684bd](https://github.com/Pearson-Higher-Ed/o-app-header/commit/8d684bd))



<a name="0.2.0"></a>
# [0.2.0](//compare/v0.1.0...v0.2.0) (2015-09-01)


### Bug Fixes

* i elements in the account menu should inherit color 6736ef2

### Features

* update o-header version to 0.10.0 48b79b6



<a name="0.1.0"></a>
# [0.1.0](//compare/v0.0.5...v0.1.0) (2015-09-01)


### Bug Fixes

* change aria-role to role 26dbd90
* remove menu items from the tab order a98e46a

### Features

* bump o-dropdown-menu version 2cda8da
* redesign 4e94a84
* register click handler when linkMap value is a function 28f98b0



<a name"0.0.5"></a>
### 0.0.5 (2015-07-31)


<a name"0.0.4"></a>
### 0.0.4 (2015-07-29)


#### Bug Fixes

* Pi library always returns NoSession when hasValidSession is called with no argument ([f9057a24](https://github.com/Pearson-Higher-Ed/o-app-header/commit/f9057a24))


#### Features

* make header fixed by default ([d4b1a40c](https://github.com/Pearson-Higher-Ed/o-app-header/commit/d4b1a40c))


<a name"0.0.3"></a>
### 0.0.3 (2015-07-28)


#### Features

* add oAppHeader.help.toggle event ([41337493](https://github.com/Pearson-Higher-Ed/o-app-header/commit/41337493))


<a name"0.0.2"></a>
### 0.0.2 (2015-07-27)


#### Features

* page-oriented nav ([93d9f393](https://github.com/Pearson-Higher-Ed/o-app-header/commit/93d9f393))


<a name"0.0.1"></a>
### 0.0.1 (2015-07-10)


#### Features

* initial implementation of the basic features ([4ec4478a](https://github.com/Pearson-Higher-Ed/o-app-header/commit/4ec4478a))

