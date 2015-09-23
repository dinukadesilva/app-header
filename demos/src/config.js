/*global __dirname*/
'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
	"options": {
		"sass": "demos/src/demo.scss",
		"js": "demos/src/demo.js",
		"template": "demos/src/demo.mustache"
	},
	"demos": [
		{
			"name": "signed-out",
			"data": {
				"mode": "Signed Out",
				"modeOptions": fs.readFileSync(path.join(__dirname, 'html/signed-out-mode-options.html'))
			}
		},
		{
			"name": "basic",
			"data": {
				"mode": "Basic",
				"modeOptions": fs.readFileSync(path.join(__dirname, 'html/basic-mode-options.html'))
			}
		},
		{
			"name": "course",
			"data": {
				"mode": "Course",
				"modeOptions": fs.readFileSync(path.join(__dirname, 'html/course-mode-options.html')),
				"showSidebar": true
			}
		},
		{
			"name": "integration",
			"data": {
				"mode": "Integration",
				"modeOptions": fs.readFileSync(path.join(__dirname, 'html/integration-mode-options.html'))
			}
		}
	]
};
