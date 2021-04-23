const { IostActionReader } = require("demux-js-iost");
const { BaseActionWatcher } = require("demux-js-iost");
const IostActionHandler = require("./IostActionHandler");
const handlerVersion = require("./handlerVersions/v1");

const actionHandler = new IostActionHandler([handlerVersion]);

const actionReader = new IostActionReader({
  // By default it starts from blocknumber 1. You can put whatever number to it. However, 0 means it is in a "tail" mode, starting from the current blocknumber.
  // startAtBlock: 0,
  onlyIrreversible: false,
  iostEndpoint: "https://api.iost.io",
});

const actionWatcher = new BaseActionWatcher(actionReader, actionHandler);

actionWatcher.watch();
