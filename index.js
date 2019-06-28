#!/usr/bin/env node

const replace = require("replace-in-file")
const inquirer = require("inquirer")
const fs = require("fs")
const chalk = require("chalk")

const filesToIgnore = [".DS_Store", "node_modules", "package-lock.json"]

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
  console.clear()

  const { projectChoice, projectName, modulesDirPath } = answers
  const templatePath = `${__dirname}/templates/${projectChoice}`

  // Create the App directory in current directory
  console.log(chalk.magenta(`creating new app directory: ${projectName}`))
  const appDir = `${CURR_DIR}/${projectName}`
  fs.mkdirSync(appDir)
  createDirectoryContents(templatePath, projectName).then(() => {
    console.log(chalk.magenta("App directory successfully created"))
    // Create a module directory for this app within the modules directory
    console.log(chalk.magenta(`creating new module directory: ${modulesDirPath}/${projectName}`))
    createModuleDirectory(modulesDirPath, projectName)

    modifyAfterBuildScript(appDir, projectName)
    modifyHtmlQueueFooter(appDir, projectName)

    printSuccessMessage(projectName)
  })
})

function createDirectoryContents(templatePath, newProjectPath) {
  return new Promise((resolve, reject) => {
    const filesToCreate = fs.readdirSync(templatePath)

    filesToCreate.forEach(file => {
      const origFilePath = `${templatePath}/${file}`

      // get stats about the current file
      const stats = fs.statSync(origFilePath)
      if (stats.isFile()) {
        if (!filesToIgnore.includes(file)) {
          const contents = fs.readFileSync(origFilePath, "utf8")
          const writePath = `${CURR_DIR}/${newProjectPath}/${file}`
          fs.writeFileSync(writePath, contents, "utf8")
          console.log(chalk.blue(`${newProjectPath}/${file} file created`))
        }
      } else if (stats.isDirectory()) {
        if (!filesToIgnore.includes(file)) {
          fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`)
          console.log(chalk.green(`${newProjectPath}/${file}/ directory created`))
          // recursive call
          createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
        }
      }
    })
    resolve()
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
    console.log(chalk.bgMagenta(`Modified files: ${appDir}/afterBuild.js`))
  } catch (error) {
    console.error("Error occurred:", error)
  }
}

function modifyHtmlQueueFooter(appDir, projectName) {
  console.log("modifying HTMLQueue Footer")
  const options = {
    files: `${appDir}/htmlQueue/footer.cfm`,
    from: /projectNamePlaceholder/g,
    to: projectName,
  }
  try {
    let changedFiles = replace.sync(options)
    console.log(chalk.bgMagenta(`Modified files: ${appDir}/htmlQueue/footer.cfm`))
  } catch (error) {
    console.error(chalk.bgRed("Error occurred:", error))
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
      console.log(chalk.bgMagenta(`Modified files: ${newModuleDirPath}/${file}`))
    } catch (error) {
      console.error(chalk.bgRed("Error occurred:", error))
    }
  })
}

function printSuccessMessage(projectName) {
  console.log("\n")
  console.log(`You're ready to go!`)
  console.log(`cd ${projectName}`)
  console.log("npm install")
  console.log("npm run serve")
}
