/**
 * Represents an angular application compiler.
 *
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Compiler
 */
class CompilerInterface {
    /**
     * Compiles the application.
     * Returns the path of the module to be required.
     *
     * @returns {Promise<string>}
     */
    compile() { }

    /**
     * Sets the progress handler.
     *
     * @param {Function} handler
     */
    set progressHandler(handler) { }
}

module.exports = getInterface(CompilerInterface);
