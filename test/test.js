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

describe('postcss-local-constants', function () {
    it('does not replace static values', function (done) {
        test('a{color: #8EE7D3}', 'a{color: #8EE7D3}', { }, done);
    });

    it('replaces constants in values', function (done) {
        test('~colors: "test/constants.js"; a{color: primary from ~colors;}', '~colors: "test/constants.js"; a{color: #8EE7D3;}', { }, done);
    });

    it('replaces constants in values without semi-colons', function (done) {
        test('~colors: "test/constants.js"; a{background: blue; color: primary from ~colors}', '~colors: "test/constants.js"; a{background: blue; color: #8EE7D3}', { }, done);
    });

    it('replaces constants at start of value', function (done) {
        test('~borders: "test/constants.js"; a{border: weight from ~borders solid #8EE7D3;}', '~borders: "test/constants.js"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants in middle of value', function (done) {
        test('~borders: "test/constants.js"; a{border: 2px style from ~borders #8EE7D3;}', '~borders: "test/constants.js"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants at end of value', function (done) {
        test('~colors: "test/constants.js"; a{border: 2px solid primary from ~colors;}', '~colors: "test/constants.js"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants in @ rules', function (done) {
        test('~queries: "test/constants.js"; @media (max-width: maxWidth from ~queries) {color: red;}', '~queries: "test/constants.js"; @media (max-width: 200px) {color: red;}', { }, done);
    });

    it('multiple sources', function (done) {
        test('~colors: "test/constants.js"; ~borders: "test/constants.js"; a{color: primary from ~colors; border: 2px style from ~borders black}', '~colors: "test/constants.js"; ~borders: "test/constants.js"; a{color: #8EE7D3; border: 2px solid black}', { }, done);
    });

    it('multiple constants in a single value', function (done) {
        test('~borders: "test/constants.js"; a{border: weight from ~borders style from ~borders black}', '~borders: "test/constants.js"; a{border: 2px solid black}', { }, done);
    });

    it('overrides default constants', function (done) {
        test('~colors: "test/constants.js"; a{color: primary from ~colors;}', '~colors: "test/constants.js"; a{color: #8EE7D3;}', { defaults: {colors: {primary: 'red'} } }, done);
    });

    it('default constants', function (done) {
        test('~colors: "test/constants.js"; a{color: secondary from ~colors;}', '~colors: "test/constants.js"; a{color: red;}', { defaults: {colors: {secondary: 'red'} } }, done);
    });
});
