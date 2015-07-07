var postcss = require('postcss');
var fs = require('fs');
var _ = require('lodash-node');

module.exports = postcss.plugin('postcss-local-vars', function (opts) {
    var sets = opts && opts.defaults || {};
    var globalNode;

    var regex = /((?:[A-z]+))( )(from)(\s+)(~)((?:[A-z]+))/g;

    var readFile = function(file) {
        return fs.readFileSync(file, 'utf8');
    };

    var getVariables = function(name, path) {
        var file = readFile(path.replace(/'|"/g, ''));
        var requiredSet = name.replace(/~/g, '');
        var variableSets = eval(file)[0];
        if (variableSets[requiredSet]) {
            if (sets[requiredSet]) {
                sets[requiredSet] = _.assign({}, sets[requiredSet], variableSets[requiredSet]);
            }

            else {
                sets[requiredSet] = variableSets[requiredSet];
            }
        }
    };

    var requiresAction = function(context) {
        return context.indexOf(' ~') !== -1;
    };

    var getValue = function(variable, parent) {
        if (!sets[parent]) {
            throw globalNode.error('No such set `' + parent + '`');
        }

        if (!sets[parent][variable]) {
            throw globalNode.error('No such variable `' + variable + '` in `' + parent + '`');
        }
        return sets[parent][variable];
    };

    var strip = function(context) {
        if (!requiresAction(context)) {
            return context;
        }

        var requires = context.match(regex);

        requires.forEach(function(require) {
            var matches = regex.exec(require);
            regex.lastIndex = 0;
            var variable = matches[1];
            var variableSet = matches[matches.length - 1];

            context = context.replace(require, getValue(variable, variableSet));
        });

        return context;
    };

    return function (css) {
        css.eachInside(function (node) {
            globalNode = node;
            if (node.prop && node.prop.indexOf('~') > -1) {
                getVariables(node.prop, node.value);
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
