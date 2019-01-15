const Processor = Jymfony.Component.Config.Definition.Processor;
const FileLocator = Jymfony.Component.Config.FileLocator;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;

const path = require('path');

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.DependencyInjection
 */
class AngularUniversalExtension extends Extension {
    /**
     * @inheritdoc
     */
    load(configs, container) {
        const processor = new Processor();
        const config = processor.processConfiguration(this.getConfiguration(), configs);

        container.setParameter('jymfony.angular.ts_config_path', config.ts_config);
        container.setParameter('jymfony.angular.main_ts', config.main);

        const loader = new JsFileLoader(container, new FileLocator(path.join(__dirname, '..', 'Resources', 'config')));
        loader.load('services.js');

        container.getDefinition(Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack.ConfigurationBuilder)
            .addArgument(config.aot);
    }
}

module.exports = AngularUniversalExtension;
