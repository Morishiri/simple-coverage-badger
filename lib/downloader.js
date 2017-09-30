const fs = require('fs-extra');
const https = require('https');
const path = require('path');

module.exports = {
    get
};

function get(url, outputDirectory, outputFile, callback) {
    process.stdout.write(`Getting ${url}\n`);
    const encodedUrl = encodeURI(url);
    process.stdout.write(`After encoding: ${encodedUrl}\n`);
    https.get(encodedUrl, (res) => {
        process.stdout.write(`Got response. Status: ${res.statusCode}\n`);

        if (res.statusCode !== 200)
            throw new Error(`Request to ${url} failed with code ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            process.stdout.write('Data transfer finished.\n');
          _saveToFile(outputDirectory, outputFile, data, callback);
        });
    }).on('error', (error) => {
        callback(error);
    });
}

function _saveToFile(outputDirectory, outputFile, data, callback) {
    const filePath = path.resolve(outputDirectory, outputFile);
    process.stdout.write(`Saving to ${filePath}\n`);
    fs.ensureDir(outputDirectory, (dirEnsureError) => {
        if (dirEnsureError) {
            callback(dirEnsureError);
            return;
        }
        fs.writeFile(filePath, data, (writeFileError) => {
            callback(writeFileError);
        });
    });
}