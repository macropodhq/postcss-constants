var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-local-vars', function () {
    it('does not replace static values', function (done) {
        test('a{color: #8EE7D3}', 'a{color: #8EE7D3}', { }, done);
    });

    it('replaces variables in values', function (done) {
        test('a{color: import local.green from "./test/vars.css"}', 'a{color: #8EE7D3}', { }, done);
    });

    it('replaces variables in values with semi-colons', function (done) {
        test('a{color: import local.green from "./test/vars.css";}', 'a{color: #8EE7D3;}', { }, done);
    });

    it('replaces variables in values with single quotes', function (done) {
        test('a{color: import local.green from \'./test/vars.css\';}', 'a{color: #8EE7D3;}', { }, done);
    });

    it('replaces variables at start of value', function (done) {
        test('a{border: import local.borderWeight from "./test/vars.css" solid #8EE7D3;}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables in middle of value', function (done) {
        test('a{border: 2px import local.borderStyle from "./test/vars.css" #8EE7D3;}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables at end of value', function (done) {
        test('a{border: 2px solid import local.green from "./test/vars.css";}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables in @ rules', function (done) {
        test('@media (max-width: import local.mediaQuery from "./test/vars.css") {color: red;}', '@media (max-width: 200px) {color: red;}', { }, done);
    });
});
