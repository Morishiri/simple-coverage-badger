
const path = require('path');
const parser = require('./parser');
const downloader = require('./downloader');
const colors = require('./colors');

module.exports = function (args, callback) {

    const inputFile = path.resolve(args.input);

    parser.parse(inputFile, (error, coverage) => {
        if (error) {
            callback(error);
            throw new Error(`An error occured while parsing report.\n${error.message}\n`);
        }

        const coveragePercent = `${coverage[args.coverageScope]}%`;
        const color = _getBadgeColorByTresholds(coverage[args.coverageScope], args);
        const url = `${args.badgeHosting}/badge/${args.text}-${coveragePercent}-${color}.${args.format}?style=${args.style}`;

        downloader.get(url, args.outputDirectory, `${args.outputFileName}.${args.format}`, (error) => {
            if (error) {
                callback(error);
                throw new Error(`An error occured while downloading badge. ${error}\n`);
            }

            process.stdout.write('Done.\n');
            if (callback) callback();
        });
    });
};

function _getBadgeColorByTresholds(percent, args) {
    if (percent >= args.excelentTreshold) return colors.BRIGHTGREEN;
    if (percent >= args.goodTreshold) return colors.GREEN;
    if (percent >= args.mediumTreshold) return colors.YELLOW;
    return colors.RED;
}