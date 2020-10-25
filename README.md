# express-jsx-views

An Express template engine for JSX-based views.

Licensed under 0BSD, which basically means you can use any code here freely for any purpose, without attribution requirements. Feel free to attribute if you want, and let me know if you use my code somewhere cool!

- [Installation](#Installation)
- [Usage](#Usage)
  - [Inferno example](#Inferno-example)
  - [React example](#React-example)
- [API](#API)
- [Alternatives](#Alternatives)

## Installation

```bash
# Required
npm i @nsrv/express-jsx-views

# For Inferno
npm i inferno inferno-hyperscript inferno-server

# For React
npm i react react-server
```

The necessary babel plugins are included for both.

## Usage

For development, you will want to setup nodemon or whatever restarts your server on changes to watch the view files. With nodemon, that means adding the -e option like `-e js,jsx,mjs,json` to include .jsx files.

Strictly speaking, you don't have to use .jsx for your view files, if you set the view engine to `'js'` instead, it will work fine. But it makes a good convention, and lets you easily know which files are probably being compiled through Babel Register.

### Inferno example

index.js
```js
'use strict';

const express = require('express');
const createRenderer = require('@nsrv/express-jsx-views');

const app = express();

app.set('views', 'views');
app.set('view engine', 'jsx');
app.engine('jsx', createRenderer('inferno'));

app.get('*', (req, res) => {
	res.locals = {
		title: 'Homepage',
	};
	res.render('Home', { name: 'Sam' });
});

app.listen(3000);
```

views/home.jsx
```jsx
'use strict';

const CurrentPath = require('./current-path');

function Home({ name, _locals }) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{_locals.title}</title>
			</head>
			<body>
				<h1>Hello {name}</h1>
			</body>
		</html>
	);
}

module.exports = Home;
```

### React example

For React, just take the Inferno example and switch from
```js
app.engine('jsx', createRenderer('inferno'));
```
to
```js
app.engine('jsx', createRenderer('react'));
```

## Features

- Simple React and Inferno default renderer setups.
- Inferno default renderer passes the view props as props to the top component, but also into the global context.

You can get the global context in any function component as the second argument
```js
// Inferno only
function MyComponent(props, context) {
  return <h1>{context._locals.title}</h1>;
}
```
A React equivalent is an eventually planned feature, and will probably utilize an external package exporting a React Context.

- (Unstable) Checks that any passed view path is actually in one of the configured view folders. Unlike the Express default, you can't pass an arbitrary absolute path or traverse outside the views folders. `res.render('../outside-file.jsx')` will cause a throw.
  - This is for convenience and mistake catching, it's not thoroughly tested as a security measure. Don't pass arbitrary user input to res.render()'s first argument.

## API

```js
const createRenderer = require('@nsrv/express-jsx-views');

createRenderer(renderer: RendererOption, [options: Options])

RendererOption: 'inferno'|'react'|Function
// 'inferno' or 'react' will setup the basic renderers for each, with
// appropriate babel register transforms applied to the view folder
// automatically.
// A function lets you pass a custom renderer.

// A custom renderer has this signature
renderToString(Component, props)
// props will be the full Express template engine `options` object.

// A simple renderer example
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function reactRenderer(Component, props) {
  return renderToStaticMarkup(React.createElement(Component, props));
}
// That's basically what the 'react' option does already. But this can be useful to add a custom element wrapper, such as a React Context Provider which you pass the props as value, to be used throughout the tree.

// Options
{
  // Universal options
  doctype: String, // default '<!DOCTYPE html>'
  // The doctype string will be prepended to all render outputs.
  // It's the only thing you simply *can't* do in JSX.
  // The default is correct (html5 and newer) for the vast majority of cases.

  // 'react' specific options
  jsxRuntime: 'automatic'|'classic', // default 'automatic'
  // By default we're using the modern JSX transform which does not require your source code to import React.
  // You can switch this to 'classic' to support older React.

  // Options when passing a custom renderer
  babelConfig: Object|Function|undefined, // default undefined
  // If you pass this option, Babel Register transform for view files will be
  // enabled, with the options given or options returned by calling a given
  // function `babelConfig(viewFolderPaths: Array)`. The viewFolderPaths
  // arguments will be `views` list Express passes to template engines.
  // example viewFolderPaths: ['/path/to/project/views']
  // The babel options will be merged with the BabelDefaults

  // 'inferno' doesn't have any extra options.
}

// BabelDefaults
{
  ignore: [],
  only: views,
  extensions: ['.jsx', '.js', '.mjs'],
  ...babelConfig, // or `...babelConfig(viewFolderPaths)`
}

// The default Inferno renderer babel config
{
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
	],
	plugins: ['babel-plugin-inferno'],
}

// The default React renderer babel config
{
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: jsxRuntime, // default 'automatic'
      },
    ],
  ],
}
```

## Alternatives

Advantages over express-react-views

- Supports Inferno
- Supports custom rendering wrappers
- More permissive license (0BSD), no patent grant stuff

However, express-react-views might be a better choice if these things are important to you

- Older package, longer existing stability track record
- Clearing the require cache without server restart in development
  - express-jsx-views outsources reloading by expecting your development process to use nodemon or similar, and have it watch the .jsx files.
