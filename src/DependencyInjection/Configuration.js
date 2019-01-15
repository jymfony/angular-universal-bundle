/* eslint-disable indent */

const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.DependencyInjection
 */
class Configuration extends implementationOf(ConfigurationInterface) {
    /**
     * @inheritdoc
     */
    get configTreeBuilder() {
        const treeBuilder = new TreeBuilder('angular_universal');
        const rootNode = treeBuilder.rootNode;

        rootNode
            .children()
                .scalarNode('main')
                    .isRequired()
                    .info('The main entry point for the universal application (main.ts)')
                .end()
                .scalarNode('ts_config')
                    .isRequired()
                    .info('The tsconfig.json location')
                .end()
                .scalarNode('aot')
                    .defaultTrue()
                    .info('Compile application in AoT mode')
                .end()
            .end()
        ;

        return treeBuilder;
    }
}

module.exports = Configuration;
