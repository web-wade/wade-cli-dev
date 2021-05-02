"use strict"

const axios = require("axios")
const urlJoin = require("url-join")
const semver = require("semver")

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null
  }
  const registryUrl = registry || getDefaultRegistry()
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

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org"
}

function getSemverVersions(baseVersion,versions){
  versions = versions.filter((version)=>{
      semver.satisfies(version,`^${baseVersion}`)
  })  
  return versions
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVersions
}
