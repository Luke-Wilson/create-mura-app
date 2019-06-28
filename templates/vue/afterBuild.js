/*
afterBuild.js
*/
const replace = require("replace-in-file")
const fs = require("fs")

const indexHtml = fs.readFileSync("./dist/index.html", "utf-8")

var reManifest = /js\/manifest\.(.*?)\.js/g
var reApp = /js\/app\.(.*?)\.js/g
var reVendor = /js\/chunk-vendors\.(.*?)\.js/g
var reCSS = /css\/app\.(.*?)\.css/g

// var manifest = indexHtml.match(reManifest)[0]
var manifest = ""
var app = indexHtml.match(reApp)[0]
var vendor = indexHtml.match(reVendor)[0]
var css = indexHtml.match(reCSS)[0]

// const manifestScriptString = `<cfset manifestJS = "#$.siteConfig('themeAssetPath')#/apps/projectNamePlaceholder/dist/${manifest}">`
const manifestScriptString = ""
const vendorScriptString = `<cfset vendorJS = "#$.siteConfig('themeAssetPath')#/apps/projectNamePlaceholder/dist/${vendor}">`
const appScriptString = `<cfset appJS = "#$.siteConfig('themeAssetPath')#/apps/projectNamePlaceholder/dist/${app}">`
const cssScriptString = `<cfset appCSS = "#$.siteConfig('themeAssetPath')#/apps/projectNamePlaceholder/dist/${css}">`

const options = {
  files: "./htmlQueue/footer.cfm",
  from: /<!--inject:projectNamePlaceholder-->(.*)<!--\/inject:projectNamePlaceholder-->/g,
  to: `<!--inject:projectNamePlaceholder-->${manifestScriptString + vendorScriptString + appScriptString + cssScriptString}<!--/inject:projectNamePlaceholder-->`,
}

try {
  let changedFiles = replace.sync(options)
  console.log("Modified files:", changedFiles.join(", "))
} catch (error) {
  console.error("Error occurred:", error)
}
