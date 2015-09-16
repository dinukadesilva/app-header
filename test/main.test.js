/*global describe, it, before*/
'use strict';

var expect = require('expect.js');
var dispatchEvent = require('../src/js/utils/dom').dispatchEvent;
var AppHeader = require('../main');

describe('o.DOMContentLoaded', function () {

	before(function () {
		document.body.innerHTML = '';
	});

	it('should prepend to document.body', function (done) {
		document.addEventListener('o.DOMContentLoaded', function () {
			var appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
			expect(appHeaderEl.classList.contains('o-app-header')).to.be(true);

			done();
		});

		dispatchEvent(document, 'o.DOMContentLoaded');
	});

	it('should not construct a new element if one already exists', function (done) {
		new AppHeader();

		document.addEventListener('o.DOMContentLoaded', function () {
			var appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
			expect(appHeaderEl.classList.contains('o-app-header')).to.be(true);

			done();
		});

		dispatchEvent(document, 'o.DOMContentLoaded');
	});

});

describe('new AppHeader()', function () {

	it('should return the same instance', function () {
		expect(new AppHeader()).to.be(new AppHeader());
	});

});
