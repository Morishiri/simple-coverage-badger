const https = require('https');
const fs = require('fs');

module.exports = {
    get
};

function get(url, outputFile, callback) {
    process.stdout.write(`Getting ${url}\n`);
    const encodedUrl = encodeURI(url);
    https.get(encodedUrl, (res) => {
        process.stdout.write(`Got response. Status: ${res.statusCode}\n`);

        if (res.statusCode !== 200)
            throw new Error(`Request to ${url} failed with code ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            process.stdout.write('Data transfer finished.\n');
          _saveToFile(outputFile, data, callback);
        });
    }).on('error', (error) => {
        callback(error);
    });
}

function _saveToFile(filePath, data, callback) {
    process.stdout.write(`Saving to ${filePath}\n`);
    fs.writeFile(filePath, data, (error) => {
        callback(error);
    });
}