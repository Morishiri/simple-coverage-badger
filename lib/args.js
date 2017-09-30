const yargs = require('yargs');
const values = require('object.values');

if (!Object.values) {
    values.shim();
}

const formats = require('./formats');
const scopes = require('./scopes');
const styles = require('./styles');


const defaultHosting = 'https://img.shields.io';

module.exports = yargs
    .option('input', {
        describe: 'Input file path',
        default: './coverage/cobertura-coverage.xml',
        alias: 'i',
        string: true
    })
    .option('outputFileName', {
        describe: 'Output file name (without extension)',
        default: 'badge',
        alias: 'o',
        string: true
    })
    .option('outputDirectory', {
        describe: 'Output directory',
        default: '.',
        alias: 'd',
        string: true
    })
    .option('format', {
        describe: 'Output file format (extension)',
        default: formats.SVG,
        alias: 'f',
        string: true,
        choices: Object.values(formats)
    })
    .option('badgeHosting', {
        describe: 'Badge hosting server',
        default: defaultHosting,
        alias: 'h',
        string: true
    })
    .option('coverageScope', {
        describe: 'Scope for badge',
        default: scopes.LINES,
        alias: 'c',
        string: true,
        choices: Object.values(scopes)
    })
    .option('excelentTreshold', {
        describe: 'Treshold for excelent coverage rating (brightgreen)',
        default: 95,
        alias: 'e',
        number: true
    })
    .option('goodTreshold', {
        describe: 'Treshold for good coverage rating (green)',
        default: 80,
        alias: 'g',
        number: true
    })
    .option('mediumTreshold', {
        describe: 'Treshold for medium coverage rating (yellow)',
        default: 60,
        alias: 'm',
        number: true
    })
    .option('style', {
        describe: 'Badge style',
        default: styles.FLAT,
        alias: 's',
        string: true,
        choices: Object.values(styles)
    })
    .option('text', {
        describe: 'Text on the left side of badge',
        default: 'coverage',
        alias: 't',
        string: true
    })
    .check((argv) => {
        if (argv.excelentTreshold < argv.goodTreshold)
            throw new Error('Excelent treshold cannot be smaller than good treshold');
        if (argv.excelentTreshold < argv.mediumTreshold)
            throw new Error('Excelent treshold cannot be smaller than medium treshold');
        if (argv.goodTreshold < argv.mediumTreshold)
            throw new Error('Good treshold cannot be smaller than medium treshold');
        return true;
    })
    .wrap(120)
    .argv;
