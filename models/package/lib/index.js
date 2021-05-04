"use strict"

const path = require('path')

const { isObject } = require("@wade-cli-dev/utils")
const pkgDir = require("pkg-dir").sync

class Package {
  constructor(options) {
    if (!options) throw new Error("Package 类的 options 参数不能为空")
    if (!isObject(options))
      throw new Error("Package 类的 options 参数必须是对象")
    this.targetPath = options.targetPath
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion
  }

  exists() {}

  install() {}

  update() {}

  getRootFilePath() {
    // 1.读取package.json所在目录， pkg-dir
    // 2.读取package.json - require()
    // 3.寻找main/lib - path
    // 4.路径兼容（macOS/windows）
    // console.log('this.targetPath', this.targetPath);
    if (!this.targetPath) {
      console.error("targetPath 不存在")
      return
    }

    // 获取一个要执行包路径的，执行入口文件
    function _getRootFile(targetPath) {
      const dir = pkgDir(targetPath) // 找到模块路径
      if (dir) {
        // 2.读取package.json - require()
        const pagFile = require(path.resolve(dir, "package.json"))
        // console.log(pagFile);
        // 3.寻找main/lib - path
        if (pagFile && pagFile.main) {
          // 4.路径兼容（macOS/windows）
          return formatPath(path.resolve(dir, pagFile.main))
        }
      }
      return null
    }

    // 缓存路径存在
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath)
    } else {
      // 不存在
      return _getRootFile(this.targetPath)
    }
  }
}

module.exports = Package
