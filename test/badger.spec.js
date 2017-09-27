require('mocha');
const fs = require('fs-extra');
const path = require('path');
const assert = require('chai').assert;

const badger = require('../lib/badger');
const args = require('../lib/args');
const nock = require('nock');

describe('# Badger', function () {

    before(() => {
        nock.disableNetConnect();
        this.scriptPath = path.resolve(__dirname, '../index.js');
        this.testOutputPath = path.resolve(__dirname, '../.tmp');
        const inputPath = path.resolve(__dirname, './fixtures/100.xml');

        // input & outputDirectory parameters
        // are used in all integration tests
        // as we don't want to spam our main directory.
        this.testDefaultArgs = {
            input: inputPath,
            outputDirectory: this.testOutputPath
        };
        fs.ensureDirSync(this.testOutputPath);
    });

    beforeEach(() => {
        this.expect = nock('https://img.shields.io')
            .get(/\/badge\/\w+-\d+%\d+-\w+\.\w+/)
            .reply(200);
    });

    afterEach(() => {
        this.expect = null;
    });

    after(() => {
        nock.enableNetConnect();
        this.scriptPath = null;
        if (!this.testOutputPath) return;
        fs.removeSync(this.testOutputPath);
        this.testOutputPath = null;
    });

    describe('# Options', () => {

        it('# should allow custom input and outputDirectory', (done) => {
            badger(Object.assign({}, args, this.testDefaultArgs), () => {
                assert.doesNotThrow(() => { this.expect.done() });
                done();
            });
        });

        describe('# outputFileName', () => {

        });
    });
});