'use strict';

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const createRenderer = require('./create-renderer');

function makeBabelConfig(jsxRuntime) {
	return {
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
					runtime: jsxRuntime,
				},
			],
		],
	};
}

module.exports = function createReactRenderer(
	configOptions,
	{ jsxRuntime = 'automatic' } = {},
) {
	function reactRenderer(Input, options) {
		return renderToStaticMarkup(React.createElement(Input, options));
	}
	return createRenderer(
		reactRenderer,
		makeBabelConfig(jsxRuntime),
		configOptions,
	);
};
