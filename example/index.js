const { IostActionReader } = require("demux-iost")
const { BaseActionWatcher } = require("demux")
const IostActionHandler = require("./IostActionHandler")
const handlerVersion = require("./handlerVersions/v1")


const actionHandler = new IostActionHandler([handlerVersion])

const actionReader = new IostActionReader({
  startAtBlock: 0,
  onlyIrreversible: false,
  iostEndpoint: 'https://api.iost.io'
})

const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, 0)

actionWatcher.watch()



