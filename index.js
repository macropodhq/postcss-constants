var postcss = require('postcss');
var fs = require('fs');

module.exports = postcss.plugin('postcss-local-vars', function () {
    var importRegex = /((import)(\s+)(local)(\.))((?:[A-z]+))( )(from)( )(".*?"|'.*?')/g;
    var nameRegex = /.*?((local)(\.))((?:[A-z]+))/g;

    var readFile = function(file) {
        return fs.readFileSync(file, 'utf8');
    };

    var requiresAction = function(context) {
        return context.indexOf('import local.') !== -1;
    };

    var getPath = function(context) {
        var pathMatches = importRegex.exec(context);
        return pathMatches[pathMatches.length - 1].replace(/'|"/g, '');
    };

    var getName = function(context) {
        var nameMatches = nameRegex.exec(context);
        return nameMatches[nameMatches.length - 1];
    };

    var strip = function(context) {
        if (!requiresAction(context)) {
            return context;
        }

        var variablesFile = readFile(getPath(context));
        var variablesRegex = new RegExp('(local\.' + getName(context) + ')(:).*?(.*?)(;)', 'g');
        var variables = variablesRegex.exec(variablesFile);
        var value = variables[variables.length - 2].trim();

        return context.replace(importRegex, value);
    };

    return function (css) {
        css.eachInside(function (node) {
            if (node.type === 'decl') {
                node.value = strip(node.value);
            }

            if (node.type === 'atrule') {
                node.params = strip(node.params);
            }
        });
    };
});
