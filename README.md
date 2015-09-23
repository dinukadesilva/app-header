# o-app-header [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-app-header.svg?branch=master)](https://travis-ci.org/Pearson-Higher-Ed/o-app-header) [![Coverage Status](https://coveralls.io/repos/Pearson-Higher-Ed/o-app-header/badge.svg?branch=master&service=github)](https://coveralls.io/github/Pearson-Higher-Ed/o-app-header?branch=master)

## Initialization

You can initialize the application header by dispatching the `o.DOMContentLoaded` event or by calling the static `init()` method.

Using `o.DOMContentLoaded`:

```js
document.addEventListener('DOMContentLoaded', function() {
  document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```

Using `new`:

```js
var AppHeader = require('o-app-header');
var appHeader = new AppHeader();
```

## Configuration

Configuration properties may be passed as an object argument to the constructor or defined in a configuration block on the page:

```html
<script data-o-app-header-config type="application/json">
  {
  	"consoleBaseUrl": "https://...",
  	"session": "Session"
  }
</script>
```

Refer to the [options object](#api-ctor) for a list of properties.

<!-- ## Responsive -->

## API

### Constructor

<a name="api-ctor"></a>
`new AppHeader([element], [options])`

Creates a new instance of `AppHeader`.

- `element`: an `HTMLElement` or selector string. The selected element will be replaced with the `header` element unless it is `document.body`, in which case the header will be preprended to the body content.
- `options`: an object with the following properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| consoleBaseUrl           | `string`               | The Console application base URL (default: https://console.pearson.com) |
| session                  | `string` or `Object`   | The session object, or the name of the session object in the global scope. If set to `false`, the session controls will not be rendered. |
| mode                     | `string`               | The mode. Refer to the [Modes](#modes) section for a list of supported modes and options. |

```js
var AppHeader = require('o-app-header');
var appHeader = new AppHeader({ mode: 'Signed Out', showLoginControls: false });
```

### Methods

`setMode(mode, [options])`

Sets the mode. Refer to the [Modes](#modes) section for a list of supported modes and options.

- `mode`: a string that indicates the header mode.
- `options`: an object containing the mode options.

<a name="modes"></a>
## Modes

The application header supports multiple modes that can be configured depending on the type and state of the application.

### Mode: Signed Out

Use this mode when the user is anonymous.

```js
new AppHeader({ mode: 'Signed Out', showLoginControls: false });
```

#### Options

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| showLoginControls        | `Boolean`              | If true, show the 'Sign In' nav item. Default: true.

### Mode: Basic

Use this mode when the user is authenticated.

```js
new AppHeader({
	mode: 'Basic',
	user: {
		givenName: 'John'
	},
	courseItems: [
		{ text: 'Physics', href: 'https://example.com/physics' },
		{ text: 'Chemistry', href: 'https://example.com/physics' }
	]
});
```

#### Options

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| user                     | `Object`               | The user data.                    |
| user.givenName           | `string`               | The user's given name.            |
| courseItems              | `Array<Object>`        | A collection of course menu items. |
| courseItems.text         | `string`               | The menu item text.               |
| courseItems.href         | `string`               | The menu item url.                |
| courseItems.onClick      | `Function`             | If provided, the function will be called when the user clicks the menu item. |

### Mode: Course

Use this mode when the user is authenticated and is in an application that adheres to the course format.

```js
new AppHeader({
	mode: 'Course',
	user: {
		givenName: 'John'
	},
	courseNav: {
		heading: { text: 'Physics', href: 'https://example.com/physics' },
		items: [
			{ text: 'Performance', href: 'https://example.com/performance' },
			{ text: 'Assessments', href: 'https://example.com/assessments' }
		]
	}
});
```

#### Options

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| user                     | `Object`               | The user data.                    |
| user.givenName           | `string`               | The user's given name.            |
| courseNav                | `Object`               | An object containing options for course navigation menu items. |
| courseNav.heading        | `Object`               | An object representing the current course. |
| courseNav.heading.text   | `string`               | The heading menu item text.       |
| courseNav.heading.href   | `string`               | The heading menu item url.        |
| courseNav.items          | `Array<Object>`        | The course navigation menu items. |
| courseNav.items.text     | `string`               | The menu item text.               |
| courseNav.items.href     | `string`               | The menu item url.                |
| courseNav.items.active   | `Boolean`              | Represents the active area of the course. If true, the menu item will be disabled. Default: false. |

### Mode: Integration

Use this mode when the application is configured as an integration with a non-Pearson application or web property&mdash;for example, a third party LMS.

```js
new AppHeader({ mode: 'Integration' });
```

### Events

| Event Name               | Description                                         |
|--------------------------|-----------------------------------------------------|
| oAppHeader.help.toggle   | Fires when the **Help** nav item is clicked.        |

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
