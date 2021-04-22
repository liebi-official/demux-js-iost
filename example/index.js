const { IostActionReader } = require("../dist/readers");
const { BaseActionWatcher } = require("demux");
const IostActionHandler = require("./IostActionHandler");
const handlerVersion = require("./handlerVersions/v1");

const actionHandler = new IostActionHandler([handlerVersion]);

const actionReader = new IostActionReader({
  startAtBlock: 0,
  onlyIrreversible: false,
  iostEndpoint: "https://api.iost.io",
});

console.log("Here is before watch");
const actionWatcher = new BaseActionWatcher(actionReader, actionHandler);
console.log("Here is after watch");

actionWatcher.watch();
