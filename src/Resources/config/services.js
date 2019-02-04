/** @global {Jymfony.Component.DependencyInjection.Loader.JsFileLoader} loader */
/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register(Jymfony.Bundle.AngularUniversalBundle.Command.BuildCommand)
    .setPublic(true)
    .addTag('console.command')
    .addArgument(new Reference(Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface))
;

container.register(Jymfony.Bundle.AngularUniversalBundle.Module.Compiler);
container.setAlias(Jymfony.Bundle.AngularUniversalBundle.Module.CompilerInterface, new Alias(Jymfony.Bundle.AngularUniversalBundle.Module.Compiler, true));

container.register(Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack.ConfigurationBuilder)
    .addArgument('%jymfony.angular.ts_config_path%')
    .addArgument('%jymfony.angular.main_ts%')
    .addArgument('%kernel.project_dir%')
;

container.register(Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack.CachedCompiler)
    .addArgument(new Reference(Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack.ConfigurationBuilder))
    .addArgument('%kernel.cache_dir%/angular-universal')
    .addArgument('%kernel.debug%')
;

container.setAlias(Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface, new Alias(Jymfony.Bundle.AngularUniversalBundle.Compiler.Webpack.CachedCompiler, true));

container.register(Jymfony.Bundle.AngularUniversalBundle.Renderer.Renderer)
    .setPublic(true)
    .addArgument('%jymfony.angular.ts_config_path%')
    .addArgument(new Reference(Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface))
    .addArgument(new Reference(Jymfony.Bundle.AngularUniversalBundle.Module.CompilerInterface))
    .addMethodCall('setContainer', [ new Reference('service_container') ])
;

container.register(Jymfony.Bundle.AngularUniversalBundle.CacheWarmer.CompilerWarmer)
    .addTag('kernel.cache_warmer')
    .addArgument(new Reference(Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface))
;
