const CompilerInterface = Jymfony.Bundle.AngularUniversalBundle.Module.CompilerInterface;

const { ResourceLoader } = require('@angular/compiler');
const { Type, NgModuleFactory, CompilerFactory } = require('@angular/core');
const { platformDynamicServer } = require('@angular/platform-server');

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Module
 */
class Compiler extends implementationOf(CompilerInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Map<Type<any>, NgModuleFactory>}
         *
         * @private
         */
        this._factoryCacheMap = new Map();

        const injector = platformDynamicServer().injector;
        const compilerFactory = injector.get(CompilerFactory);

        /**
         * @type {Compiler}
         *
         * @private
         */
        this._compiler = compilerFactory.createCompiler([
            {
                providers: [
                    { provide: ResourceLoader, useClass: Jymfony.Bundle.AngularUniversalBundle.Loader.FileLoader, deps: [] }
                ]
            }
        ]);
    }

    /**
     * Compiles a type to a NgModuleFactory
     *
     * @param {Type<any>|NgModuleFactory} typeOrFactory
     *
     * @returns {Promise<NgModuleFactory>}
     */
    async compile(typeOrFactory) {
        if (typeOrFactory instanceof NgModuleFactory) {
            return typeOrFactory;
        }

        const moduleFactory = this._factoryCacheMap.get(typeOrFactory);

        // If module factory is cached
        if (moduleFactory) {
          return moduleFactory;
        }

        // Compile the module and cache it
        const factory = await this._compiler.compileModuleAsync(typeOrFactory);
        this._factoryCacheMap.set(typeOrFactory, factory);

        return factory;
    }
}

module.exports = Compiler;
