export const getEnv = (name: string) => {
  const val = process.env[name]
  if (val == null) {
    throw new Error("Missing environment variable: " + name)
  }
  return val
}
