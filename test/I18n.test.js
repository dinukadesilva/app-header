/*global describe, it, before*/
'use strict';

var expect = require('expect.js');
var I18n = require('../src/js/utils/I18n');

describe('I18n', function () {

	before(function () {
		I18n.prototype.strings.test = {
			'Foo': 'Le Foo'
		};
	});

	it('should default to en locale', function () {
		expect((new I18n()).keys).to.eql(I18n.prototype.strings.en);
	});

	it('should set the keys based on the locale', function () {
		expect((new I18n({ locale: 'test' })).keys).to.eql(I18n.prototype.strings.test);
	});

	it('should set the keys to en if the locale is unrecognized', function () {
		expect((new I18n({ locale: 'nullisland' })).keys).to.eql(I18n.prototype.strings.en);
	});

	describe('translate(key)', function () {

		it('should translate the key', function () {
			expect((new I18n({ locale: 'test' })).translate('Foo')).to.be('Le Foo');
		});

		it('should return the key when there is no translation', function () {
			expect((new I18n({ locale: 'test' })).translate('Bar')).to.be('Bar');
		});

	});

});
