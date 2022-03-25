"use strict"

module.exports = exec

const Package = require("@wade-cli-dev/package")
const log = require("@wade-cli-dev/log")
const path = require("path")

const SETTINGS = {
  init: "@imooc-cli/init",
}

const CACHE_DIR = "dependencies" // 依赖缓存目录

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  let storeDir = ""
  const homePath = process.env.CLI_HOME_PATH
  log.verbose("targetPath", targetPath)
  log.verbose("homePath", homePath)
  const cmjObj = arguments[arguments.length - 1]
  const packageName = SETTINGS[cmjObj.name()]
  const packageVersion = "latest"
  let pkg
  if (targetPath) {
    pkg = new Package({
      targetPath,
      homePath,
      packageName,
      packageVersion,
    })
  } else {
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, "node_modules") // 存放缓存模块的目录

    console.log(targetPath)
    console.log(storeDir)

    pkg = new Package({
      targetPath,
      homePath,
      packageName,
      packageVersion,
      storeDir,
    })
  }
  if (await pkg.exists()) {
    // 存在，就升级
    await pkg.update()
  } else {
    // 安装 包
    await pkg.install()
  }
  const rootFile = pkg.getRootFilePath()
  console.log('rootFile', rootFile);
  // if (rootFile) {
  //   // 实现动态加载模块
  //   // 问题：在当前进程中调用
  //   try {
  //     // require(rootFile).call(null, Array.from(arguments));
  //     // 通过 node 子进程调用
  //     // cp.fork(); // 这个方法不提供回调，需要通过子父进程通信解决
  //     // const code = 'console.log(1);';// node -e "console.log(1);"
  //     let args = Array.from(arguments)
  //     const cmd = args[args.length - 1]
  //     const o = Object.create(null)
  //     Object.keys(cmd).forEach((key) => {
  //       if (
  //         cmd.hasOwnProperty(key) && // 自身属性
  //         !key.startsWith("_") && // 不是 _ 开始
  //         key !== "parent"
  //       ) {
  //         o[key] = cmd[key]
  //       }
  //     })
  //     // console.log(o);
  //     args[args.length - 1] = o
  //     // 相当于执行： node require('${rootFile}').call(null, ${JSON.stringify(args)})
  //     const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
  //     // cp.spawn('cmd', ['/c', 'node', '-e', code]) // window
  //     // const child = cp.spawn('node', ['-e', code], {
  //     //     cwd: process.cwd(),
  //     //     stdio: 'inherit'
  //     // });

  //     // let child;
  //     const option = {
  //       cwd: process.cwd(),
  //       stdio: "inherit",
  //     }

  //     // if (process.platform === 'win32') {
  //     //     child = cp.spawn('cmd', ['/c', 'node', '-e', code], option);
  //     // } else {
  //     //     child = cp.spawn('node', ['-e', code], option);
  //     // }
  //     let child = spawn("node", ["-e", code], option)
  //     child.on("error", (e) => {
  //       log.error(e.message)
  //       process.exit(1) // 发生错误，中断执行
  //     })
  //     child.on("exit", (e) => {
  //       log.verbose("命令执行成功：" + e.message)
  //       process.exit(e)
  //     })
  //   } catch (error) {
  //     log.error(error.message)
  //   }

  //   // 改造成在node子进程中调用
  // }
}
