var postcss = require('postcss');
var nodepath = require('path');
var assign = require('lodash/object/assign');
var resolve = require('resolve');
var dotty = require('dotty');

module.exports = postcss.plugin('postcss-constants', function (opts) {
    var sets = opts && opts.defaults || {};
    var globalNode;

    var regex = /~([\w]+)\.([\w]+)([a-zA-Z0-9\.]*)/g;

    var getConstants = function(name, path, directory) {
        path = path.replace(/'/g, '"');

        var res = resolve.sync(JSON.parse(path), {
            basedir: nodepath.dirname(directory),
            paths: opts.baseDir ? nodepath.join(this.process.env.PWD, opts.baseDir) : this.process.env.PWD
        });

        var requiredSet = name.replace(/~/g, '');
        var constantSets = require(res);

        if (constantSets[requiredSet]) {
            if (sets[requiredSet]) {
                sets[requiredSet] = assign({}, sets[requiredSet], constantSets[requiredSet]);
            }

            else {
                sets[requiredSet] = constantSets[requiredSet];
            }
        }
    };

    var requiresAction = function(context) {
        return !!context.match(regex);
    };

    var getValue = function(path) {
        var value = dotty.get(sets, path);

        if (value === undefined) {
            throw globalNode.error('No such set `' + path + '`');
        } else {
            return value;
        }
    };

    var strip = function(context) {
        if (!requiresAction(context)) {
            return context;
        }

        var requires = context.match(regex);

        requires.forEach(function(require) {
            var path = require.substring(1);

            context = context.replace(require, getValue(path));
        });

        return context;
    };

    return function (css) {
        css.walk(function (node) {
            globalNode = node;
            if (node.prop && node.prop.indexOf('~') > -1) {
                getConstants(node.prop, node.value, node.source.input.from);
                node.remove();
            }

            if (node.type === 'decl') {
                node.value = strip(node.value);
            }

            if (node.type === 'atrule') {
                node.params = strip(node.params);
            }
        });
    };
});
