const Bundle = Jymfony.Component.Kernel.Bundle;

/**
 * @memberOf Jymfony.Bundle.AngularUniversalBundle
 */
class AngularUniversalBundle extends Bundle {
    /**
     * @inheritdoc
     */
    async boot() {
        global.__Zone_disable_Error = true;
        global.__Zone_disable_toString = true;
        global.__Zone_disable_node_timers = true;
        global.__Zone_disable_fs = true;
        global.__Zone_disable_EventEmitter = true;
        global.__Zone_disable_nextTick = true;
        global.__Zone_disable_handleUnhandledPromiseRejection = true;
        global.__Zone_disable_crypto = true;

        require('zone.js/dist/zone-node');
        const { enableProdMode } = require('@angular/core');

        enableProdMode();
    }
}

module.exports = AngularUniversalBundle;
