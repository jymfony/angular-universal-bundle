const ConfigCache = Jymfony.Component.Config.ConfigCache;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const File = Jymfony.Component.Filesystem.File;

const fs = require('fs');
const promisify = require('util').promisify;

/**
 * Webpack caching compiler.
 *
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack
 */
class CachedCompiler {
    /**
     * Constructor.
     *
     * @param configurationBuilder
     * @param {string} cacheDir
     * @param {boolean} debug
     */
    __construct(configurationBuilder, cacheDir, debug) {
        /**
         *
         */
        this._configurationBuilder = configurationBuilder;

        /**
         * @type {string}
         *
         * @private
         */
        this._cacheDir = cacheDir;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;

        /**
         * @type {Function}
         *
         * @private
         */
        this._progressHandler = () => { };
    }

    /**
     * Sets the progress handler function.
     *
     * @param {Function} handler
     */
    set progressHandler(handler) {
        this._progressHandler = handler;
    }

    /**
     * @inheritdoc
     */
    async compile() {
        const file = this._cacheDir + '/universal_app.js';
        const cache = new ConfigCache(file, this._debug);

        if (! cache.isFresh()) {
            const webpack = require('webpack');
            const MemoryFs = require('memory-fs');

            try { __jymfony.mkdir(this._cacheDir); } catch (e) { }
            const configuration = await this._configurationBuilder.getConfiguration();
            configuration.plugins.push(new webpack.ProgressPlugin({
                profile: true,
                handler: this._progressHandler,
            }));

            const Webpack = webpack(configuration);

            const memoryFs = new MemoryFs();
            memoryFs.mkdirpSync('/dist');
            Webpack.outputFileSystem = memoryFs;

            const stats = await promisify(Webpack.run.bind(Webpack))();
            if (stats.hasErrors()) {
                throw new RuntimeException(__jymfony.sprintf(
                    'Cannot compile application: "%s"',
                    stats.toJson().errors.join('", "')
                ));
            }

            const chunkStats = stats.toJson('verbose').chunks;
            const resources = [];
            if (this._debug) {
                for (const chunk of chunkStats || []) {
                    for (const module of chunk.modules || []) {
                        const m = module.identifier.match(/^(?:(multi|external) )?([^?!]+)([!?].*)?$/);
                        if (null === m) {
                            continue;
                        }

                        if (m[1] === 'external') {
                            continue;
                        }

                        const fn = m[3] ? __jymfony.ltrim(m[3], '?!') : undefined;
                        if (fn && fs.existsSync(fn)) {
                            resources.push(new FileResource(fn));
                        }

                        resources.push(new FileResource(m[2]));
                    }
                }
            }

            const requires = [];
            for (const [name, asset] of __jymfony.getEntries(stats.compilation.assets)) {
                if (! name.match(/\.js$/i)) {
                    continue;
                }

                const file = new File(this._cacheDir + '/' + name);

                const openFile = await file.openFile('w');
                await openFile.fwrite(Buffer.from(asset.source()));
                await openFile.close();

                requires.push('...require(\'./' + name + '\'),');
            }

            cache.write('module.exports = { ' + requires.join('\n') + ' };\n', resources);
        }

        return cache.getPath();
    }
}

module.exports = CachedCompiler;
