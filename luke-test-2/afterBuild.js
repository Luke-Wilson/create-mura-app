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

var manifest = ""
var app = indexHtml.match(reApp)[0]
var vendor = indexHtml.match(reVendor)[0]
var css = indexHtml.match(reCSS)[0]

const manifestScriptString = `<cfset manifestJS = "#$.siteConfig('themeAssetPath')#/apps/luke-test-2/dist/${manifest}">`
const vendorScriptString = `<cfset vendorJS = "#$.siteConfig('themeAssetPath')#/apps/luke-test-2/dist/${vendor}">`
const appScriptString = `<cfset appJS = "#$.siteConfig('themeAssetPath')#/apps/luke-test-2/dist/${app}">`
const cssScriptString = `<cfset appCSS = "#$.siteConfig('themeAssetPath')#/apps/luke-test-2/dist/${css}">`

const options = {
  files: "./htmlQueue/footer.cfm",
  from: /<!--inject:luke-test-2-->(.*)<!--\/inject:luke-test-2-->/g,
  to: `<!--inject:luke-test-2-->${manifestScriptString + vendorScriptString + appScriptString + cssScriptString}<!--/inject:luke-test-2-->`,
}

try {
  let changedFiles = replace.sync(options)
  console.log("Modified files:", changedFiles.join(", "))
} catch (error) {
  console.error("Error occurred:", error)
}
