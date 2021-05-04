"use strict"

module.exports = exec

const Package = require("@wade-cli-dev/package")
const log = require("@wade-cli-dev/log")

const SETTINGS = {
  init: "@wade-dev-cli/init",
}

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  log.verbose("targetPath", targetPath)
  log.verbose("homePath", homePath)
  const cmjObj = arguments[arguments.length - 1]
  const packageName = SETTINGS[cmjObj.name()]
  const packageVersion = "latest"
  if (!targetPath) {
    targetPath = ""
  }
  const pkg = new Package({
    targetPath,
    homePath,
    packageName,
    packageVersion,
  })
  console.log("s0000"+pkg.getRootFilePath())
  console.log(process.env.CLI_TARGET_PATH)
}
