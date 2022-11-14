import JSZip from "jszip"

export const getEnv = (name: string) => {
  const val = process.env[name]
  if (val == null) {
    throw new Error("Missing environment variable: " + name)
  }
  return val
}

export const replaceInString = (
  contentIn: string,
  replaceMap: { [toReplace: string]: string },
) => {
  let content = contentIn
  Object.keys(replaceMap).forEach((key) => {
    content = content.replace(key, replaceMap[key])
  })
  return content
}

export const packageCode = async (code: string) => {
  const zip = new JSZip()
  zip.file("index.js", code, { binary: false })
  const zippedCode = await zip.generateAsync({ type: "nodebuffer" })
  return zippedCode.toString("base64")
}
