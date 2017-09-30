const assert = require('chai').assert;
const path = require('path');
const spawnSync = require('child_process').spawnSync;

describe('# Integration (CLI)', () => {

    before(() => {
        this.scriptPath = path.resolve(__dirname, '../index.js');
    });

    describe('#Input files', () => {
        it('# should throw if input file is corrupted', () => {
            const corruptedFilePath = path.resolve(__dirname, './fixtures/corrupted.xml');
            const resultCode = spawnSync(this.scriptPath, ['--input', corruptedFilePath]).status;

            assert.equal(resultCode, 1);
        });
    });

    describe('# Tresholds', () => {
        it('# should not allow \'excelent\' treshold smaller than \'good\'', () => {
            const resultCode = spawnSync(this.scriptPath, ['--excelentTreshold', '50', '--goodTreshold', '70', '--mediumTreshold', '30']).status;

            assert.equal(resultCode, 1);
        });

        it('# should not allow \'excelent\' treshold smaller than \'medium\'', () => {
            const resultCode = spawnSync(this.scriptPath, ['--excelentTreshold', '50', '--goodTreshold', '30', '--mediumTreshold', '70']).status;

            assert.equal(resultCode, 1);
        });

        it('# should not allow \'good\' treshold smaller than \'medium\'', () => {
            const resultCode = spawnSync(this.scriptPath, ['--excelentTreshold', '70', '--goodTreshold', '30', '--mediumTreshold', '50']).status;

            assert.equal(resultCode, 1);
        });
    });
});