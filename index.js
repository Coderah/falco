#!/usr/bin/env node
var Parser = require('./lib/parser.js');
var cli = require('cli').enable('status', 'help');

cli.setUsage('whiskers FILE [OPTIONS]');

cli.parse({
    out: ['o', 'output file path', 'path'],
    tokenOut: ['O', 'output for json file of tokens', 'path'],
    dry: [undefined, 'dry parsing run (useful for validation)'],
    debug: [undefined, 'output debug info to console']
});

var fs = require('fs');

var args = cli.args;
var options = cli.options;

if (args.length === 1) {
    var inputFile = args[0];

    fs.stat(inputFile, function(err, stats) {
        if (!stats || err) {
            cli.error('the file "' + inputFile + '" does not exist, aborting compile.');
        } else if (stats.isFile()) {
            return main(inputFile);
        } else if (stats.isDirectory()) {
            cli.error(inputFile + ' is a directory, we need an html file.');
        }
        
        cli.info('for usage information run with --help');
    });
} else {
    cli.getUsage();
}

var utils = require('util');
function main(path) {
    var contents = fs.readFileSync(path).toString();

    cli.spinner('Parsing...');
    Parser(contents, function(tokens) {
        cli.spinner('Parsing... Done\n', true);

        if (options.debug) {
            console.log(utils.inspect(tokens, {depth: 5}));
        }

        if (options.dry) process.exit(0);

        if (options.tokenOut) {
            fs.writeFileSync(options.tokenOut, JSON.stringify(tokens));
        }
    });
}