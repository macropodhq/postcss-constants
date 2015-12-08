var postcss = require('postcss');
var nodepath = require('path');
var assign = require('lodash/object/assign');
var resolve = require('resolve');

module.exports = postcss.plugin('postcss-constants', function (opts) {
    var sets = opts && opts.defaults || {};
    var globalNode;

    var regex = /~([\w]+)\.([\w]+)/g;

    var getConstants = function(name, path, directory) {
        var res = resolve.sync(JSON.parse(path), { basedir: nodepath.dirname(directory) });
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

    var getValue = function(constant, parent) {
        if (!sets[parent]) {
            throw globalNode.error('No such set `' + parent + '`');
        }

        if (!sets[parent][constant]) {
            throw globalNode.error('No such constant `' + constant + '` in `' + parent + '`');
        }
        return sets[parent][constant];
    };

    var strip = function(context) {
        if (!requiresAction(context)) {
            return context;
        }

        var requires = context.match(regex);

        requires.forEach(function(require) {
            var matches = regex.exec(require);
            regex.lastIndex = 0;
            var constant = matches[2];
            var constantSet = matches[1];

            context = context.replace(require, getValue(constant, constantSet));
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
