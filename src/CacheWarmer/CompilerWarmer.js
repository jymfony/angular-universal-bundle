const CacheWarmer = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.CacheWarmer
 */
class CompilerWarmer extends implementationOf(CacheWarmer) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface} compiler
     */
    __construct(compiler) {
        this._compiler = compiler;
    }

    /**
     * @inheritdoc
     */
    get optional() {
        return true;
    }

    /**
     * @inheritdoc
     */
    async warmUp() {
        await this._compiler.compile();
    }
}

module.exports = CompilerWarmer;
