# demux-js-iost [![Build Status](https://travis-ci.org/liebi-official/demux-js-iost.svg?branch=master)](https://travis-ci.org/liebi-official/demux-js-iost)

Demux Action Reader implementations to read block and action data from IOST-based blockchains. 

## Installation


```bash
# Using yarn
yarn add demux-iost

# Using npm
npm install demux-iost --save
```

#### Example

Makes requests directly to a specified Node API endpoint to obtain block data.

```javascript
const { IostActionReader } = require("demux-iost")
const { BaseActionWatcher } = require("demux")
const IostActionHandler = require("./IostActionHandler")
const handlerVersion = require("./handlerVersions/v1")


const actionHandler = new IostActionHandler([handlerVersion])

const actionReader = new IostActionReader({
  startAtBlock: 0,
  onlyIrreversible: false,
  iostEndpoint: "https://api.iost.io"
})

const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, 250)

actionWatcher.watch()

```
