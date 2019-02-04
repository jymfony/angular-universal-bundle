const path = require('path');

/**
 * Builds webpack configuration to compile an Angular Universal application.
 *
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack
 */
class ConfigurationBuilder {
    /**
     * Constructor.
     *
     * @param {string} tsConfigPath
     * @param {string} mainTs
     * @param {string} rootDir
     * @param {boolean} aot
     */
    __construct(tsConfigPath, mainTs, rootDir, aot = true) {
        this._tsConfigPath = tsConfigPath;
        this._mainTs = mainTs;
        this._rootDir = rootDir;
        this._aot = aot;
    }

    /**
     * Gets the built configuration.
     *
     * @returns {Object.<string, *>}
     */
    getConfiguration() {
        const projectTs = require('typescript');
        const { NodeJsAsyncHost } = require('@angular-devkit/core/node');
        const webpackMerge = require('webpack-merge');
        const webpackConfigs = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');

        const configResult = projectTs.readConfigFile(this._tsConfigPath, projectTs.sys.readFile);
        const tsConfig = projectTs.parseJsonConfigFileContent(configResult.config, projectTs.sys, path.dirname(this._tsConfigPath), undefined, this._tsConfigPath);

        const wco = {
            root: this._rootDir,
            projectRoot: this._rootDir,
            buildOptions: {
                outputPath: '/dist',
                main: path.relative(this._rootDir, this._mainTs),
                buildOptimizer: false,
                aot: this._aot,
                platform: 'server',
                scripts: [],
                styles: [],
                optimization: {},
                sourceMap: {},
            },
            tsConfig,
            tsConfigPath: this._tsConfigPath,
            supportES2015: true,
        };

        const host = new NodeJsAsyncHost();
        return webpackMerge([
            webpackConfigs.getCommonConfig(wco),
            webpackConfigs.getServerConfig(wco),
            webpackConfigs.getStylesConfig(wco),
            webpackConfigs.getStatsConfig(wco),
            this._aot ? webpackConfigs.getAotConfig(wco, host) : webpackConfigs.getNonAotConfig(wco, host),
            {
                target: 'node',
                mode: 'none',
                // this makes sure we include node_modules and other 3rd party libraries
                externals: [(context, request, callback) => {
                    if (/^@angular|^@nguniversal|^@jymfony/.test(request)) {
                        return callback(null, 'commonjs ' + request);
                    }

                    callback();
                }],
                output: { futureEmitAssets: false },
            }
        ]);
    }
}

module.exports = ConfigurationBuilder;
