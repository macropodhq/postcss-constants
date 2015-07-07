# PostCSS Local Vars [![Build Status][ci-img]][ci]

[PostCSS] plugin to process imported variables from a file, removing them from a global scope.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/ojame/postcss-local-vars.svg
[ci]:      https://travis-ci.org/ojame/postcss-local-vars

```css
/* var.css */
local.primaryGreen: #8EE7D3;
```

```css
.foo {
  color: import local.primaryGreen from './vars.css';
}
```

```css
.foo {
  color: #8EE7D3;
}
```

#### Within static values

```css
/* var.css */
local.primaryGreen: #8EE7D3;
```

```css
.foo {
  border: 2px solid import local.primaryGreen from './vars.css';
}
```

```css
.foo {
  border: 2px solid #8EE7D3;
}
```

#### @ Rules

```css
/* var.css */
local.query: 200px;
```

```css
@media (max-width: import local.query from './vars.css') {
  color: blue;
}
```

```css
@media (max-width: 200px) {
  color: blue;
}
```

## Usage

```js
postcss([ require('postcss-local-vars') ])
```

Call `postcss-local-vars` before any plugins that will compute values stored in variables. See [PostCSS] docs for examples for your environment.
