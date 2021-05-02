"use strict"

module.exports = core

const semver = require("semver")
const colors = require("colors/safe")
const pkg = require("../package.json")
const log = require("@wade-cli-dev/log")
const constant = require("./const")

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (error) {
    log.error(error.message)
  }
}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`wade-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    )
  }
}

function checkPkgVersion() {
  log.notice("cli", pkg.version)
}
