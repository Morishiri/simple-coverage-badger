require('mocha');
const fs = require('fs-extra');
const path = require('path');
const chai = require('chai');
chai.use(require('chai-fs'));
const assert = chai.assert;

const badger = require('../lib/badger');
const args = require('../lib/args');
const nock = require('nock');

describe('# Badger', function () {

    before(() => {
        nock.disableNetConnect();
        this.testOutputPath = path.resolve(__dirname, '../.tmp');
        const inputPath = path.resolve(__dirname, './fixtures/100.xml');

        // input & outputDirectory parameters
        // are used in all integration tests
        // as we don't want to spam our main directory.
        this.testDefaultArgs = {
            input: inputPath,
            outputDirectory: this.testOutputPath
        };
    });

    beforeEach(() => {
        this.expect = nock('https://img.shields.io')
            .get(/\/badge\/\w+-\d+%\d+-\w+\.\w+\?style=\w+/)
            .reply(200, 'badge data');
        fs.ensureDirSync(this.testOutputPath);
    });

    afterEach(() => {
        nock.cleanAll();
        this.expect = null;
        fs.removeSync(this.testOutputPath);
    });

    after(() => {
        nock.enableNetConnect();
        this.testOutputPath = null;
        this.testDefaultArgs = null;
    });

    describe('# Options', () => {

        it('# should not throw during execution', (done) => {
            assert.doesNotThrow(() => {
                badger(Object.assign({}, args, this.testDefaultArgs), () => {
                    done();
                });
            });
        });

        it('# should allow custom input and outputDirectory', (done) => {
            badger(Object.assign({}, args, this.testDefaultArgs), () => {
                assert.doesNotThrow(() => { this.expect.done(); });
                done();
            });
        });

        describe('# defaults', () => {

            it('# should save file under default name and format', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.svg`);
                    done();
                });
            });
        });

        describe('# input file', () => {
            it('# should request badge from server while 33% file is used', (done) => {
                const inputPath33 = path.resolve(__dirname, './fixtures/33.xml');
                badger(Object.assign({}, args, this.testDefaultArgs, { input: inputPath33 }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should request badge from server while 67% file is used', (done) => {
                const inputPath67 = path.resolve(__dirname, './fixtures/67.xml');
                badger(Object.assign({}, args, this.testDefaultArgs, { input: inputPath67 }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should request badge from server while 100% file is used', (done) => {
                const inputPath100 = path.resolve(__dirname, './fixtures/100.xml');
                badger(Object.assign({}, args, this.testDefaultArgs, { input: inputPath100 }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should request badge from server while files with different branches and lines coverage is used', (done) => {
                const inputPathDifferent = path.resolve(__dirname, './fixtures/different.xml');
                badger(Object.assign({}, args, this.testDefaultArgs, { input: inputPathDifferent }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });


        });

        describe('# outputDirectory', () => {
            it('# should create directory if doesn\'t exist', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { outputDirectory: `${this.testOutputPath}/badges` }), () => {
                    assert.pathExists(`${this.testOutputPath}/badges/badge.svg`);
                    done();
                });
            });
        });

        describe('# outputFileName', () => {

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { outputFileName: 'mybadge' }), () => {
                        done();
                    });
                });
            });

            it('# should request badge from server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { outputFileName: 'mybadge' }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should create file with given name', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { outputFileName: 'mybadge' }), () => {
                    assert.pathExists(`${this.testOutputPath}/mybadge.svg`);
                    done();
                });
            });
        });

        describe('# format', () => {

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { format: 'png' }), () => {
                        done();
                    });
                });
            });

            it('# should request badge from server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { format: 'png' }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should create file with given format', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { format: 'png' }), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.png`);
                    done();
                });
            });
        });

        describe('# badgeHosting', () => {

            beforeEach(() => {
                this.localExpect = nock('https://example.com')
                    .get(/\/badge\/\w+-\d+%\d+-\w+\.\w+/)
                    .reply(200);
            });

            afterEach(() => {
                this.localExpect = null;
            });

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { badgeHosting: 'https://example.com' }), () => {
                        done();
                    });
                });
            });

            it('# should not request badge from default server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { badgeHosting: 'https://example.com' }), () => {
                    assert.throws(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should request badge from custom server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { badgeHosting: 'https://example.com' }), () => {
                    assert.doesNotThrow(() => { this.localExpect.done(); });
                    done();
                });
            });

            it('# should download file from custom hosting', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { badgeHosting: 'https://example.com' }), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.svg`);
                    done();
                });
            });
        });

        describe('# coverageScope', () => {

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { coverageScope: 'branches' }), () => {
                        done();
                    });
                });
            });

            it('# should request badge from server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { coverageScope: 'branches' }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should read branches value instead of default lines from file', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { coverageScope: 'branches' }), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.svg`);
                    done();
                });
            });
        });

        describe('# style', () => {

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { style: 'social' }), () => {
                        done();
                    });
                });
            });

            it('# should request badge from server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { style: 'social' }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should read branches value instead of default lines from file', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { style: 'social' }), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.svg`);
                    done();
                });
            });
        });

        describe('# text', () => {

            it('# should not throw during execution', (done) => {
                assert.doesNotThrow(() => {
                    badger(Object.assign({}, args, this.testDefaultArgs, { text: 'myowntext' }), () => {
                        done();
                    });
                });
            });

            it('# should request badge from server', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { text: 'myowntext' }), () => {
                    assert.doesNotThrow(() => { this.expect.done(); });
                    done();
                });
            });

            it('# should read branches value instead of default lines from file', (done) => {
                badger(Object.assign({}, args, this.testDefaultArgs, { text: 'myowntext' }), () => {
                    assert.pathExists(`${this.testOutputPath}/badge.svg`);
                    done();
                });
            });
        });
    });

});