const fs = require('fs');
const promisify = require('util').promisify;

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Loader
 */
class FileLoader {
    /**
     * Asynchronously reads a file.
     *
     * @param {string} url
     *
     * @returns {Promise<Buffer>}
     */
    get(url) {
        return promisify(fs.readFile)(url);
    }
}

module.exports = FileLoader;
