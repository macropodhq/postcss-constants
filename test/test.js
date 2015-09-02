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

describe('postcss-constants', function () {
    it('does not replace static values', function (done) {
        test('a{color: #8EE7D3}', 'a{color: #8EE7D3}', { }, done);
    });

    it('replaces constants in values', function (done) {
        test('~colors: "./test/constants.js"; a{color: ~colors.primary;}', 'a{color: #8EE7D3;}', { }, done);
    });

    it('replaces constants in values without semi-colons', function (done) {
        test('~colors: "./test/constants.js"; a{background: blue; color: ~colors.primary}', 'a{background: blue; color: #8EE7D3}', { }, done);
    });

    it('replaces constants at start of value', function (done) {
        test('~borders: "./test/constants.js"; a{border: ~borders.weight solid #8EE7D3;}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants in middle of value', function (done) {
        test('~borders: "./test/constants.js"; a{border: 2px ~borders.style #8EE7D3;}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants at end of value', function (done) {
        test('~colors: "./test/constants.js"; a{border: 2px solid ~colors.primary;}', 'a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces constants in @ rules', function (done) {
        test('~queries: "./test/constants.js"; @media (max-width: ~queries.maxWidth) {color: red;}', '@media (max-width: 200px) {color: red;}', { }, done);
    });

    it('multiple sources', function (done) {
        test('~colors: "./test/constants.js"; ~borders: "./test/constants.js"; a{color: ~colors.primary; border: 2px ~borders.style black}', 'a{color: #8EE7D3; border: 2px solid black}', { }, done);
    });

    it('multiple constants in a single value', function (done) {
        test('~borders: "./test/constants.js"; a{border: ~borders.weight ~borders.style black}', 'a{border: 2px solid black}', { }, done);
    });

    it('overrides default constants', function (done) {
        test('~colors: "./test/constants.js"; a{color: ~colors.primary;}', 'a{color: #8EE7D3;}', { defaults: {colors: {primary: 'red'} } }, done);
    });

    it('default constants', function (done) {
        test('~colors: "./test/constants.js"; a{color: ~colors.secondary;}', 'a{color: red;}', { defaults: {colors: {secondary: 'red'} } }, done);
    });
});
