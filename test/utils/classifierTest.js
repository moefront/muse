/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use-strict';

import { add, remove, has, toggle } from '../../src/utils';

describe('Utils: classifier', function() {

	beforeEach(function() {
		const dom = document.createElement('div');
		this.dom = dom, this.mirror = dom.cloneNode();
	})

	it('use add() / remove() method to add / remove class', function() {
		add(this.dom, 'naive');
		expect(this.dom.classList.contains('naive')).to.equal(true);

		remove(this.dom, 'naive');
		expect(this.dom.classList.contains('naive')).to.equal(false);
	});

	it('use toggle() method to toggle class', function() {
		toggle(this.dom, 'muse');
		expect(this.dom.classList.contains('muse')).to.equal(true);
		toggle(this.dom, 'muse');
		expect(this.dom.classList.contains('muse')).to.equal(false);
	});

	it('use has() method to check if a class exists', function() {
		add(this.dom, 'muse');
		expect(has(this.dom, 'muse')).to.equal(true);
		toggle(this.dom, 'muse');
		expect(has(this.dom, 'muse')).to.equal(false);
	});

});