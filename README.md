# PostCSS Local Constants [![Build Status][ci-img]][ci]

[PostCSS] plugin to process imported constants from a file, removing them from a global scope.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/macropodhq/postcss-local-constants.svg
[ci]:      https://travis-ci.org/macropodhq/postcss-local-constants

**constants.js**
```js
module.exports = {
  colors: {
    primary: '#8EE7D3',
  },
};
```

**input**
```css
~colors: "./constants.js";
.foo {
  color: ~colors.primary;
}
```

**output**
```css
.foo {
  color: #8EE7D3;
}
```

#### Within static values

**constants.js**
```js
module.exports = {
  borders: {
    weight: '2px',
    style: 'solid',
  },
};
```

**input**
```css
~borders: "./constants.js";
.foo {
  border: ~borders.weight ~borders.style black;
}
```

**output**
```css
.foo {
  border: 2px solid black;
}
```

#### @ Rules

**constants.js**
```js
module.exports = {
  queries: {
    maxWidth: '200px',
  },
}
```

**input**
```css
~queries: "./constants.js";

@media (max-width: ~queries.maxWidth) {
  color: blue;
}
```

**output**
```css
@media (max-width: 200px) {
  color: blue;
}
```

## Usage

```js
postcss([ require('postcss-local-constants') ])
```

You can pass a default set of constants (that can be overriden), if you want to update default constants in webpack hot reload:


```js
postcss([
  localConsts({
    defaults: {
      colors: {
        primary: 'blue',
      },
    }
  })
])
```

Call `postcss-local-constants` before any plugins that will compute values stored in constants. See [PostCSS] docs for examples for your environment.
