/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Exception
 */
class ConfigurationFileNotFoundException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string} filePath
     */
    __construct(filePath) {
        super.__construct('');

        this.message = `Could not find configuration file at path "${filePath}".`;

        this._filePath = filePath;
    }

    /**
     * @returns {string}
     */
    get filePath() {
        return this._filePath;
    }
}

module.exports = ConfigurationFileNotFoundException;
