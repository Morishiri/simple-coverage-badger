const fs = require('fs');
const xml2js = require('xml2js');

const scopes = require('./scopes');

const xmlParser = new xml2js.Parser();

module.exports = {
    parse
};

function parse(reportPath, callback) {
    fs.readFile(reportPath, (readError, data) => {
        if (readError) {
            callback(readError);
            return;
        }

        xmlParser.parseString(data, (parseError, result) => {
            if (parseError) {
                callback(parseError);
                return;
            }
            const coverageData = _extractCoverageRate(result.coverage);

            callback(null, coverageData);
        });
    });
}

function _extractCoverageRate(coverage) {
    if (coverage && coverage.$) {
        const lineRate = Math.round(coverage.$['line-rate'] * 100);
        const branchRate = Math.round(coverage.$['branch-rate'] * 100);
        return {
            [scopes.LINES]: isNaN(lineRate) ? null : lineRate,
            [scopes.BRANCHES]: isNaN(branchRate) ? null : branchRate,
        };
    }
    return {
        [scopes.LINES]: null,
        [scopes.BRANCHES]: null
    };
}