'use strict';

const CurrentPath = (props, context = {}) => {
	return <pre>Currently at {context.path}</pre>;
};

module.exports = CurrentPath;
