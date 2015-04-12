#!/usr/bin/env node
var Parser = require('./lib/parser');
var JSONTransform = require('./lib/parser/json-transform.js');
var transpiler = require('./lib/transpiler');
var path = require('path');
var cli = require('cli').enable('status', 'help');

cli.setUsage('falco FILE [OPTIONS]');

cli.parse({
    out: ['o', 'output file path', 'path'],
    tokenOut: ['O', 'output for json file of tokens', 'path'],
    dry: [undefined, 'dry parsing run (useful for validation)'],
    debug: [undefined, 'output debug info to console']
});

var fs = require('fs');

if (cli.args.length === 1) {
    var inputFile = cli.args[0];

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
function main(templatePath) {
    var tokenStream = new Parser();
    fs.createReadStream(templatePath).pipe(tokenStream);

    if (cli.options.debug) {
        tokenStream.pipe(new JSONTransform()).pipe(process.stdout);
    } else {
        cli.spinner('');
    }

    if (cli.options.dry) return;

    var translator = new transpiler.Translator();
    tokenStream.pipe(translator);

    if (cli.options.debug) {
        translator.pipe(process.stdout);
    }

    if (cli.options.out) {
        translator.pipe(fs.createWriteStream(path.resolve(cli.options.out)));
    }

    tokenStream.on('end', function() {
        cli.spinner('', true);
    });
}
