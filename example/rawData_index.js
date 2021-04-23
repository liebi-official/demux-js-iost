const { IostActionReader } = require("../dist/readers");

function main() {
  const actionReader = new IostActionReader({
    startAtBlock: 0,
    onlyIrreversible: false,
    iostEndpoint: "https://api.iost.io",
  });

  printRawBlock(actionReader);
}

async function printRawBlock(reader) {
  let blkInfo = await reader.getBlock(130099971);
  console.log("info: ", blkInfo);
}

main();
