#!/usr/bin/env node

const replace = require("replace-in-file")
const inquirer = require("inquirer")
const fs = require("fs")

const CURR_DIR = process.cwd()
const choices = fs.readdirSync(`${__dirname}/templates`)

const questions = [
  {
    name: "projectChoice",
    type: "list",
    message: "What project template would you like to generate?",
    choices: choices,
  },
  {
    name: "projectName",
    type: "input",
    message: "Project name:",
    validate: function(input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true
      else return "Project name may only include letters, numbers, underscores and hashes."
    },
  },
  {
    name: "modulesDirPath",
    type: "input",
    message: "Path to the modules directory, relative to the current directory (e.g.  ../../modules )",
  },
]

inquirer.prompt(questions).then(answers => {
  console.log(answers)
  const { projectChoice, projectName, modulesDirPath } = answers
  const templatePath = `${__dirname}/templates/${projectChoice}`

  console.log(templatePath)
  // Create the App directory in current directory
  console.log(`creating new directory: ${projectName}`)
  const appDir = `${CURR_DIR}/${projectName}`
  fs.mkdirSync(appDir)

  createDirectoryContents(templatePath, projectName)

  // Create a module directory for this app within the modules directory
  createModuleDirectory(modulesDirPath, projectName)

  setTimeout(() => {
    modifyAfterBuildScript(appDir, projectName)
    modifyHtmlQueueFooter(appDir, projectName)
    console.log(`cd ${projectName}`)
    console.log("npm install")
  }, 2000)
})

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath)

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`

    // get stats about the current file
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8")

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`
      fs.writeFileSync(writePath, contents, "utf8")
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`)
      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
    }
  })
}

function modifyAfterBuildScript(appDir, projectName) {
  console.log("modifying afterBuild.js")
  const options = {
    files: `${appDir}/afterBuild.js`,
    from: /projectNamePlaceholder/g,
    to: projectName,
  }
  try {
    let changedFiles = replace.sync(options)
    console.log("Modified files:", changedFiles.join(", "))
  } catch (error) {
    console.error("Error occurred:", error)
  }
}

function modifyHtmlQueueFooter(appDir, projectName) {
  console.log("modifying HTMLQueue Footer", appDir, projectName)
  const options = {
    files: `${appDir}/htmlQueue/footer.cfm`,
    from: /projectNamePlaceholder/g,
    to: projectName,
  }
  try {
    let changedFiles = replace.sync(options)
    console.log("Modified files:", changedFiles)
  } catch (error) {
    console.error("Error occurred:", error)
  }
}

function createModuleDirectory(modulesDirPath, projectName) {
  // create the new module directory
  const newModuleDirPath = `${modulesDirPath}/${projectName}`
  fs.mkdirSync(newModuleDirPath)

  // Copy across moduleFiles to the new module directory
  const moduleFiles = fs.readdirSync(`${__dirname}/moduleFiles/`)
  moduleFiles.forEach(file => {
    const origFilePath = `${__dirname}/moduleFiles/${file}`
    const contents = fs.readFileSync(origFilePath, "utf8")
    const writePath = `${newModuleDirPath}/${file}`
    fs.writeFileSync(writePath, contents, "utf8")
  })

  // replace projectPlaceholder with projectName
  const newModuleFiles = fs.readdirSync(newModuleDirPath)
  newModuleFiles.forEach(file => {
    const origFilePath = `${newModuleDirPath}/${file}`
    const options = {
      files: origFilePath,
      from: /projectNamePlaceholder/g,
      to: projectName,
    }
    try {
      let changedFiles = replace.sync(options)
      console.log("Modified files:", changedFiles)
    } catch (error) {
      console.error("Error occurred:", error)
    }
  })
}
