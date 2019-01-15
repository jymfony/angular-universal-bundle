const Response = Jymfony.Component.HttpFoundation.Response;

const { INITIAL_CONFIG, renderModuleFactory } = require('@angular/platform-server');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const { REQUEST, RESPONSE } = require('@jymfony/angular-universal-bridge');
const fs = require('fs');
const path = require('path');

const templateCache = {};

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Renderer
 */
class Renderer {
    /**
     * Constructor.
     *
     * @param {string} tsConfig
     * @param {Object} compiler
     * @param {Object} moduleCompiler
     */
    __construct(tsConfig, compiler, moduleCompiler) {
        const configs = [];

        while (true) {
            const currentPath = path.dirname(tsConfig);
            const config = require(tsConfig);
            const extensionOf = config.extends;

            delete config.extends;

            if (config.compilerOptions) {
                if (config.compilerOptions.outDir) {
                    config.compilerOptions.outDir = path.resolve(currentPath, config.compilerOptions.outDir);
                }

                if (config.compilerOptions.baseUrl) {
                    config.compilerOptions.baseUrl = path.resolve(currentPath, config.compilerOptions.baseUrl);
                }
            }

            if (config.angularCompilerOptions && config.angularCompilerOptions.entryModule) {
                config.angularCompilerOptions.entryModule = path.resolve(currentPath, config.angularCompilerOptions.entryModule);
            }

            configs.push(config);

            if (extensionOf) {
                tsConfig = path.resolve(currentPath, extensionOf);
            } else {
                break;
            }
        }

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._tsConfig = __jymfony.deepMerge(...configs);

        if (! this._tsConfig.angularCompilerOptions || ! this._tsConfig.angularCompilerOptions.entryModule) {
            throw new LogicException('No entry module defined in tsconfig');
        }

        const match = this._tsConfig.angularCompilerOptions.entryModule.match(/^[^#]+#(.+)$/);
        if (null === match) {
            throw new LogicException('Entry module name not specified');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._moduleName = match[1];

        /**
         * @type {Object}
         *
         * @private
         */
        this._compiler = compiler;

        /**
         * @type {Object}
         *
         * @private
         */
        this._moduleCompiler = moduleCompiler;

        /**
         * @type {undefined}
         *
         * @private
         */
        this._factory = undefined;

        /**
         * @type {StaticProvider}
         *
         * @private
         */
        this._moduleMap = undefined;
    }

    /**
     * Renders a page from the request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {string} template
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.Response>}
     */
    async render(request, template) {
        const factory = await this._getFactory();

        const response = new Response();
        let renderError;
        response.content = await renderModuleFactory(factory, {
            extraProviders: [
                this._moduleMap,
                { provide: REQUEST, useValue: request },
                { provide: RESPONSE, useValue: response },
                {
                    provide: INITIAL_CONFIG,
                    useValue: {
                        document: __self.getDocument(template),
                        url: request.uri,
                    },
                },
            ],
        });

        if (undefined !== renderError) {
            throw renderError;
        }

        return response;
    }

    /**
     * Get the document at the file path
     */
    static getDocument(filePath) {
        return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
    }

    /**
     * Gets the ang
     *
     * @returns {Promise<undefined>}
     *
     * @private
     */
    async _getFactory() {
        if (undefined === this._factory) {
            const moduleObj = require(await this._compiler.compile());
            this._factory = await this._moduleCompiler.compile(
                moduleObj[this._moduleName + 'NgFactory'] || moduleObj[this._moduleName]
            );

            this._moduleMap = provideModuleMap(moduleObj.LAZY_MODULE_MAP);
        }

        return this._factory;
    }
}

module.exports = Renderer;
