'use strict';

const fsPath = require('path');
const assureArray = require('assure-array');

function callIfFunction(subject, [...args]) {
	if (typeof subject === 'function') {
		return subject(...args);
	}
	return subject;
}

function setupBabelRegister(views, babelConfig) {
	require('@babel/register')({
		ignore: [],
		only: views,
		extensions: ['.jsx', '.js', '.mjs'],
		...callIfFunction(babelConfig, [views]),
	});
}

function createRenderer(
	renderToString,
	babelConfig,
	{ doctype: userDoctype } = {},
) {
	const doctype = userDoctype ?? '<!DOCTYPE html>';
	let needBabelRegister = Boolean(babelConfig);
	const testedSafe = {};
	async function renderer(path, options, callback) {
		if (needBabelRegister) {
			setupBabelRegister(assureArray(options.settings.views), babelConfig);
			needBabelRegister = false;
		}
		try {
			// Not something that should be considered super safe, but it at least avoids mistakes.
			// Checking if given view path has the absolute base path as the prefix, as a simple test
			// that the file is inside the views folder.
			// Note: should only need to test once in app lifetime due to require cache
			if (testedSafe[path] === undefined) {
				const pathIsSafe = assureArray(options.settings.views).some(view => {
					const viewFolder = fsPath.resolve(view);
					// Ensure last character in `view` paths is `/` to avoid matching a longer folder/file name
					const folderWithSlash =
						viewFolder.slice(-1) === '/' ? viewFolder : `${viewFolder}/`;
					return new RegExp(`^${folderWithSlash}`).test(path);
				});
				if (!pathIsSafe) {
					throw new Error(
						`Attempted to use unsafe path outside view directory: ${path}`,
					);
				}
				testedSafe[path] = true;
			}

			// eslint-disable-next-line import/no-dynamic-require
			const Component = require(path);
			let output = renderToString(Component, options);
			if (output.then) {
				output = await output;
			}
			// eslint-disable-next-line prefer-template
			callback(null, doctype + output);
		} catch (error) {
			callback(error);
		}
	}
	return renderer;
}

module.exports = createRenderer;
