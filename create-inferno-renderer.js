'use strict';

const { Component } = require('inferno');
const { renderToStaticMarkup } = require('inferno-server');
const { h } = require('inferno-hyperscript');
const createRenderer = require('./create-renderer');

const babelConfig = {
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
};

class Provider extends Component {
	getChildContext() {
		return this.props;
	}

	render() {
		// eslint-disable-next-line react/prop-types
		return this.props.children;
	}
}

module.exports = function createInfernoRenderer(configOptions) {
	function infernoRenderer(Input, options) {
		return renderToStaticMarkup(h(Provider, options, h(Input, options)));
	}
	return createRenderer(infernoRenderer, babelConfig, configOptions);
};
