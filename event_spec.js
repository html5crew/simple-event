/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit, jasmine */
describe('simple-event', function () {
    'use strict';

    it('use \'DOMEvent\' as namespace', function () {
        expect(DOMEvent).toBeDefined();
    });
});
