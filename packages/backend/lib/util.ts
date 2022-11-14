import fs from "fs"
import JSZip from "jszip"
import path from "path"

export const getEnv = (name: string) => {
  const val = process.env[name]
  if (val == null) {
    throw new Error("Missing environment variable: " + name)
  }
  return val
}

export const readFileAndReplace = (
  filePath: string,
  replaceMap: { [toReplace: string]: string },
) => {
  const fullFilePath = path.resolve(process.cwd(), filePath)
  console.log("Reading file from: ", fullFilePath)
  const buffer = fs.readFileSync(fullFilePath, {
    encoding: "utf-8",
  })
  let fileContent = buffer.toString()
  console.log("File content: ", fileContent.slice(0, 100), "...")
  Object.keys(replaceMap).forEach((key) => {
    fileContent = fileContent.replace(key, replaceMap[key])
  })
  return fileContent
}

export const packageCode = async (code: string) => {
  const zip = new JSZip()
  zip.file("index.js", code, { binary: false })
  const zippedCode = await zip.generateAsync({ type: "nodebuffer" })
  return zippedCode.toString("base64")
}
