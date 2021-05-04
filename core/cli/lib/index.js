"use strict"

module.exports = core

const semver = require("semver")
const path = require("path")
const colors = require("colors/safe")
const userHome = require("user-home")
const pathExists = require("path-exists")
const { Command } = require('commander');

const pkg = require("../package.json")
const log = require("@wade-cli-dev/log")
const init = require("@wade-cli-dev/init")
const exec = require("@wade-cli-dev/exec")
const constant = require("./const")

let args

const program = new Command()

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    // checkInputArgs()
    checkEnv()
    checkGlobalUpdate()
    registerCommand()
  } catch (error) {
    log.error(error.message)
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0]) // Usage: imooc-test-berners <command> [options] 实现nanme
    .usage("<command> [options]") // Usage: imooc-test-berners <command> [options] 实现后面两个参数
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "")

  program
    .command("init [projectName]")
    .option("-f, --force", "是否强制初始化项目")
    .action(exec)

  // 实现debug
  program.on("option:debug", () => {
    const options = program.opts()
    if (options.debug) {
      process.env.LOG_LEVEL = "verbose" // 修改日志级别
    } else {
      process.env.LOG_LEVEL = "info"
    }
    log.level = process.env.LOG_LEVEL // 设置日志级别
    // log.verbose('test');
  })

  // 监听targetPath属性，在写入环境变量中
  program.on("option:targetPath", () => {
    const options = program.opts()
    if (options.targetPath) {
      process.env.CLI_TARGET_PATH = options.targetPath
    }
  })

  program.on("command:*", (obj) => {
    if (Array.isArray(obj) && obj.length > 0) {
      console.log(colors.red(`未知的命令：${obj.join(",")}`))
      const availableCommands = program.commands.map((cmd) => cmd.name())
      if (availableCommands.length > 0) {
        console.log(colors.red(`可用的命令：${availableCommands.join(",")}`))
      }
    }
  })

  if (process.argv.length < 3) {
    program.outputHelp()
  }

  // 这句话要写在结尾， 解析参数
  program.parse(process.argv)
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version
  const npmName = pkg.name
  const { getNpmSemverVersion } = require("@wade-cli-dev/get-npm-info")
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      "更新提醒",
      colors.yellow(
        `请手动更新 ${npmName}, 当前的版本是 ${currentVersion}，最新版本：${lastVersion}，执行 npm install -g ${npmName}`
      )
    )
  }
}

function checkEnv() {
  const dotenv = require("dotenv")
  const dotenvPath = path.resolve(userHome, ".env")
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    })
  }
  createDefaultConfig()
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgs() {
  const minimist = require("minimist")
  args = minimist(process.argv.slice(2))
  checkArgs()
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose"
  } else {
    process.env.LOG_LEVEL = "info"
  }
  log.level = process.env.LOG_LEVEL
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户不存在"))
  }
}

function checkRoot() {
  const rootCheck = require("root-check")
  rootCheck()
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
