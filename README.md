# PostCSS Local Vars [![Build Status][ci-img]][ci]

[PostCSS] plugin to process imported variables from a file, removing them from a global scope.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/ojame/postcss-local-vars.svg
[ci]:      https://travis-ci.org/ojame/postcss-local-vars

**vars.js**
```js
module.exports = {
  colors: {
    primary: '#8EE7D3',
  },
};
```

**input**
```css
~colors: "./vars.json";
.foo {
  color: primary from ~colors;
}
```

**output**
```css
.foo {
  color: #8EE7D3;
}
```

#### Within static values

**vars.js**
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
~borders: "./vars.json";
.foo {
  border: weight from ~borders style from ~borders black;
}
```

**output**
```css
.foo {
  border: 2px solid black;
}
```

#### @ Rules

**vars.js**
```js
module.exports = {
  queries: {
    maxWidth: '200px',
  },
}
```

**input**
```css
~queries: "./vars.json";

@media (max-width: maxWidth from ~queries) {
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
postcss([ require('postcss-local-vars') ])
```

You can pass a default set of variables (that can be overriden), if you want to update default variables in webpack hot reload:


```js
postcss([
  localVars({
    defaults: {
      colors: {
        primary: 'blue',
      },
    }
  })
])
```

Call `postcss-local-vars` before any plugins that will compute values stored in variables. See [PostCSS] docs for examples for your environment.
