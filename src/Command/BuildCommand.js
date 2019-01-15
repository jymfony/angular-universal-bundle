const Command = Jymfony.Component.Console.Command.Command;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const path = require('path');

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle.Command
 */
class BuildCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Bundle.AngularUniversalBundle.Compiler.CompilerInterface} compiler
     */
    __construct(compiler) {
        super.__construct();

        this._compiler = compiler;
    }

    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'angular:build-universal';
        this.description = 'Builds the Angular universal bundle';
        this.help = `The <info>%command.name%</info> builds the Angular Universal application bundle.`;

        this.addOption('outDir', 'o', InputOption.VALUE_REQUIRED, 'The output dir');
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Angular universal - compile');

        io.progressStart(undefined, 'Compiling...');
        this._compiler.progressHandler = (percentage, message) => {
            io.progressAdvance(1, ~~(percentage * 100) + '%' + (message ? ' - ' + message.toString() : ''));
        };

        const bundle = await this._compiler.compile();
        const outDir = input.getOption('outDir');
        if (undefined !== outDir) {
            const fs = new Filesystem();
            const dir = path.dirname(bundle);

            const destDir = path.resolve(process.cwd(), outDir);
            await fs.mirror(dir, destDir);
            await fs.remove(path.join(destDir, 'universal_app.js.meta'));
        }

        io.progressFinish('Completed');
        io.success('Built successfully!');
    }
}

module.exports = BuildCommand;
