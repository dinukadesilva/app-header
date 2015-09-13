# o-app-header [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-app-header.svg?branch=master)](https://travis-ci.org/Pearson-Higher-Ed/o-app-header) [![Coverage Status](https://coveralls.io/repos/Pearson-Higher-Ed/o-app-header/badge.svg?branch=master&service=github)](https://coveralls.io/github/Pearson-Higher-Ed/o-app-header?branch=master)

## Initialization

You can initialize the application header by dispatching the `o.DOMContentLoaded` event or by calling the static `init()` method.

Using `o.DOMContentLoaded`:

```js
document.addEventListener('DOMContentLoaded', function() {
  document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```

Using `init()`:

```js
var AppHeader = require('o-app-header');
AppHeader.init();
```

## Configuration

Configuration properties may be passed as an object argument to the `init()` method or defined in a configuration block on the page:

```html
<script data-o-app-header-config type="application/json">
  {
  	"consoleBaseUrl": "https://...",
  	"session": "Session"
  }
</script>
```

Refer to the [options object](#api-methods-init) for a list of properties.

<!-- ## Responsive -->

## API

### Methods

<a name="api-methods-init"></a>
`init([element], [options])`

- `element`: an `HTMLElement` or selector string. The selected element will be replaced with the `header` element unless it is `document.body`, in which case the header will be preprended to the body content.
- `options`: an object with the following properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| consoleBaseUrl           | `string`               | The Console application base URL (default: https://console.pearson.com) |
| locale                   | `string`               | The user's preferred locale (refer to the [i18n](#i18n) section). |
| session                  | `string` or `Object`   | The session object, or the name of the session object in the global scope. If set to `false`, the session controls will not be rendered. |
| user                     | `Object`               | An object with a property `givenName` that contains the user's given name as a string. The value of `givenName` is displayed in the desktop view in the user menu for an authenticated user. |
| menu                     | `Object`               | Takes the same options as the [setMenu](#api-methods-setMenu) method. |

<a name="api-methods-setMenu"></a>
`setMenu(options)`

- `options`: an object with the following optional properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| enableAllCoursesMenuItem | `Boolean`              | If true, the menu will include an item with a link to return to the page that displays the user's course list. |
| siteNav                  | `Object`               | Options for setting site-oriented navigation menu items. |
| siteNav.items            | `Object`               | Site-oriented navigation menu items. The key is the menu item text content. The value can be a `String`, which is the URL of the menu item's link, or an `Object`. |
| appAbout                 | `Object`               | Options for rendering a menu item that links to or initiates an action to display information about the current application. |
| appAbout.text            | `String`               | The text that will be rendered for the menu item. |
| appAbout.href            | `String`               | URL. If defined, the menu item will be rendered as a link. |
| appAbout.onClick         | `Function`             | A callback function that will be called when the menu item is clicked. |
| appNav                   | `Object`               | Options for setting page-oriented navigation menu items. |
| appNav.heading           | `Object`               | Options for rendering a heading menu item. |
| appNav.heading.text      | `String`               | The heading text.                |
| appNav.heading.href      | `String`               | URL. If defined, the menu item will be rendered as a link. |
| appNav.items             | `Object`               | Page-oriented navigation menu items. The key is the menu item text content. The value can be a `String`, which is the URL of the menu item's link, or an `Object`. |

Object values for `items` properties of the `siteNav` and `appNav` properties may contain the following properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| href                     | `String`               | URL. If defined, the menu item will be rendered as a link. |
| active                   | `Boolean`              | If true, the menu is rendered as active. |
| onClick                  | `Function`             | A callback function that will be called when the menu item is clicked. |

Example:

```js
AppHeader.setMenu({
	appNav: {
		// Render a heading menu item
		heading: {
			text: 'Psychology 101',
			href: 'https://example.com/psychology-101'
		},
		items: {
			// Active menu item
			'Foo': { active: true, href: 'https://example.com/foo' },
			// Menu item will execute the callback function on click
			'Bar': { onClick: function () { alert('You clicked "Bar"'); } }
		}
	}
});
```

### Events

| Event Name               | Description                                         |
|--------------------------|-----------------------------------------------------|
| oAppHeader.help.toggle   | Fires when the **Help** nav item is clicked and it is not a link. |

```js
document.addEventListener('oAppHeader.help.toggle', function (e) {
	// Do something
});
```

## z-index

By default, the header's `z-index` property is set to 1000. This value can be changed by setting the `$o-app-header-z-index` SASS variable.

<!-- ## i18n

Setting the `locale` configuration property will render the header with the translated strings, if the locale is supported.
The following languages are supported:

- `ar` Arabic
- `de` German
- `en` English (default)
- `fr` French
- `it` Italian
- `ja` Japanese
- `ko` Korean
- `nl` Dutch
- `pl` Polish
- `pt` Portuguese
- `ru` Russian
- `tr` Turkish
- `zh-Hans` Chinese (simplified) -->

## Browser support

Browser versions that do not support [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) must use a polyfill, for example via the [polyfill service](https://cdn.polyfill.io/v1/docs/):

```html
<script src="https://cdn.polyfill.io/v1/polyfill.min.js?features=default,WeakMap"></script>
```

## License

This software is published by Pearson Education under the [MIT license](LICENSE).
