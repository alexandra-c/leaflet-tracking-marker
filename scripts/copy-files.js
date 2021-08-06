/* eslint-disable no-console */
const path = require('path')
const fse = require('fs-extra')

const packagePath = process.cwd()
const buildPath = path.join(packagePath, './dist')

async function createPackageFile() {
  const packageData = await fse.readFile(path.resolve(packagePath, './package.json'), 'utf8')
  // eslint-disable-next-line no-unused-vars
  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(packageData)
  const newPackageData = {
    ...packageDataOther,
    private: false,
    main: './index.js'
  }
  const targetPath = path.resolve(buildPath, './package.json')

  await fse.writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8')
  console.log(`Created package.json in ${targetPath}`)

  return newPackageData
}

async function run() {
  try {
    await createPackageFile()
    fse.copySync('./README.md', path.resolve(buildPath, './README.md'))
    fse.copySync('./LICENSE', path.resolve(buildPath, './LICENSE'))
    fse.copySync('./src/index.d.ts', path.resolve(buildPath, './index.d.ts'))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
