const Haml = require('haml');

module.exports = function (embark) {
  embark.registerServiceCheck('PluginService', function (cb) {
    cb({name: "ServiceName", status: "on"});
  });

  embark.registerPipeline((embark.pluginConfig.files || ['**/*.haml']), function (opts) {
    return Haml.render(opts.source);
  });

  embark.registerContractConfiguration({
    "default": {
      "contracts": {
        "PluginStorage": {
          "args": ["$SimpleStorage"]
        }
      }
    }
  });
  embark.addContractFile("./contracts/pluginSimpleStorage.sol");

  embark.addFileToPipeline('./fileInPipeline.js');
  embark.addFileToPipeline('./fileInPipeline.js', 'js/fileInPipeline.js');

  embark.registerBeforeDeploy(function (options, callback) {
    // Just calling register to prove it works. We don't actually want to change the contracts
    callback({contractCode: options.contract.code});
  });

  embark.registerClientWeb3Provider(function(options) {
    return "web3 = new Web3(new Web3.providers.HttpProvider('http://" + options.rpcHost + ":" + options.rpcPort + "'));";
  });

  /*embark.registerContractsGeneration(function (options) {
    const contractGenerations = [];
    Object.keys(options.contracts).map(className => {
      const contract = options.contracts[className];
      const abi = JSON.stringify(contract.abiDefinition);

      contractGenerations.push(`${className} = new this.web3.eth.contract('${abi}').at('${contract.deployedAddress}')`);
    });
    return contractGenerations.join('\n');
    // return '';
  });*/

  embark.registerConsoleCommand((cmd) => {
    if (cmd === "hello") {
      return "hello there!";
    }
    // continue to embark or next plugin;
    return false;
  });

};
