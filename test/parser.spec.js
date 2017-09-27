require('mocha');
const assert = require('chai').assert;
const path = require('path');

const parser = require('../lib/parser');

describe('# parser', () => {

    it('# should return ENOENT error if file doesn\'t exist', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/thisdoesntexist.xml'), (error) => {
            assert.isNotNull(error);
            assert.include(error.message, 'no such file or directory');
            done();
        });
    });

    it('# should return parser error if file is not proper xml', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/corrupted.xml'), (error) => {
            assert.isNotNull(error);
            assert.include(error.message, 'Unclosed root tag');
            done();
        });
    });

    it('# should return nulls if coverage tag has no attributes', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/no-coverage-attrs.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, null);
            assert.equal(data.branches, null);
            done();
        });
    });

    it('# should return nulls if coverage tag has no rates attributes', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/no-coverage-rates.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, null);
            assert.equal(data.branches, null);
            done();
        });
    });

    it('# should properly parse file with 33% rates', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/33.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, 33);
            assert.equal(data.branches, 33);
            done();
        });
    });

    it('# should properly parse file with 67% rates', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/67.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, 67);
            assert.equal(data.branches, 67);
            done();
        });
    });

    it('# should properly parse file with 100% rates', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/100.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, 100);
            assert.equal(data.branches, 100);
            done();
        });
    });

    it('# should properly parse file with different branches and lines rate', (done) => {
        parser.parse(path.resolve(__dirname, './fixtures/different.xml'), (error, data) => {
            assert.isNull(error);
            assert.equal(data.lines, 67);
            assert.equal(data.branches, 50);
            done();
        });
    });
});