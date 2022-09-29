import { useEffect, useState } from "react"

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false)
  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler)
    window.addEventListener("keyup", upHandler)
    return () => {
      window.removeEventListener("keydown", downHandler)
      window.removeEventListener("keyup", upHandler)
    }
    // eslint-disable-next-line
  }, [])

  return keyPressed
}

export default useKeyPress
