/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Module
 */
class CompilerInterface {
    /**
     * Compiles a type to a NgModuleFactory
     *
     * @param {Type<any>|NgModuleFactory} typeOrFactory
     *
     * @returns {Promise<NgModuleFactory>}
     */
    async compile(typeOrFactory) { }
}

module.exports = getInterface(CompilerInterface);
