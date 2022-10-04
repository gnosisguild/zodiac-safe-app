import * as IPFS from "ipfs-core"

let node: IPFS.IPFS
const textDecoder = new TextDecoder()

const getNode = async () => {
  if (node == null) {
    node = await IPFS.create()
  }
  return node
}
export const getJsonData = async (path: string) => {
  const node = await getNode()

  if (path.startsWith("ipns")) {
    path = await node.resolve(path, { recursive: true })
  }

  path = path.replace("ipfs://", "")

  const chunks: string[] = []
  for await (const chunk of node.cat(path)) {
    chunks.push(textDecoder.decode(chunk))
  }
  const rawContent = chunks.join("")
  return JSON.parse(rawContent)
}

export const add = async (content: any) => {
  const node = await getNode()
  const { cid } = await node.add(content)
  return cid
}
