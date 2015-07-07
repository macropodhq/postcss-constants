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
        test('~colors: "test/vars.json"; a{color: primary from ~colors;}', '~colors: "test/vars.json"; a{color: #8EE7D3;}', { }, done);
    });

    it('replaces variables in values without semi-colons', function (done) {
        test('~colors: "test/vars.json"; a{background: blue; color: primary from ~colors}', '~colors: "test/vars.json"; a{background: blue; color: #8EE7D3}', { }, done);
    });

    it('replaces variables in values with single quotes', function (done) {
        test('~colors: \'test/vars.json\'; a{color: primary from ~colors;}', '~colors: \'test/vars.json\'; a{color: #8EE7D3;}', { }, done);
    });

    it('replaces variables at start of value', function (done) {
        test('~borders: "test/vars.json"; a{border: weight from ~borders solid #8EE7D3;}', '~borders: "test/vars.json"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables in middle of value', function (done) {
        test('~borders: "test/vars.json"; a{border: 2px style from ~borders #8EE7D3;}', '~borders: "test/vars.json"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables at end of value', function (done) {
        test('~colors: "test/vars.json"; a{border: 2px solid primary from ~colors;}', '~colors: "test/vars.json"; a{border: 2px solid #8EE7D3;}', { }, done);
    });

    it('replaces variables in @ rules', function (done) {
        test('~queries: "test/vars.json"; @media (max-width: maxWidth from ~queries) {color: red;}', '~queries: "test/vars.json"; @media (max-width: 200px) {color: red;}', { }, done);
    });

    it('multiple sources', function (done) {
        test('~colors: "test/vars.json"; ~borders: "test/vars.json"; a{color: primary from ~colors; border: 2px style from ~borders black}', '~colors: "test/vars.json"; ~borders: "test/vars.json"; a{color: #8EE7D3; border: 2px solid black}', { }, done);
    });

    it('multiple variables in a single value', function (done) {
        test('~borders: "test/vars.json"; a{border: weight from ~borders style from ~borders black}', '~borders: "test/vars.json"; a{border: 2px solid black}', { }, done);
    });

    it('overrides default variables', function (done) {
        test('~colors: "test/vars.json"; a{color: primary from ~colors;}', '~colors: "test/vars.json"; a{color: #8EE7D3;}', { defaults: {colors: {primary: 'red'} } }, done);
    });

    it('default variables', function (done) {
        test('~colors: "test/vars.json"; a{color: secondary from ~colors;}', '~colors: "test/vars.json"; a{color: red;}', { defaults: {colors: {secondary: 'red'} } }, done);
    });
});
