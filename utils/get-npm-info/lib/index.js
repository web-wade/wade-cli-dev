"use strict"

const axios = require("axios")
const urlJoin = require("url-join")
const semver = require("semver")

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null
  }
  const registryUrl = registry || getDefineRegistry()
  const npmInfoUrl = urlJoin(registryUrl, npmName)
  return axios.get(npmInfoUrl).then((res) => {
    if (res.status === 200) {
      return res.data
    }
    return null
  })
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry)
  if (data) {
    return Object.keys(data.versions)
  } else {
    return []
  }
}

function getDefineRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org"
}

function getSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.lt(baseVersion, version))
    .sort((a, b) => semver.gt(a, b))
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry)
  const newVersions = getSemverVersions(baseVersion, versions)
  if (Array.isArray(newVersions) && newVersions.length > 0) {
    return newVersions[0]
  }
  return null
}

// 获取最大版本号
async function getNpmLatestVersion(npmName, _registry) {
  let versions = await getNpmVersions(npmName, _registry);
  if (Array.isArray(versions) && versions.length > 0) {
      versions = versions.sort((a, b) => semver.gt(a, b)); // 从大到小排序
      return versions[0];
  }
  return null;
}



module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVersions,
  getNpmSemverVersion,
  getDefineRegistry,
  getNpmLatestVersion
}
