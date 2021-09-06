import { useCallback, useState } from "react"

interface Element{}

const Elements = (props: {elements: Element[]}) => {
  const {elements} = props;

  return elements.map((el, index) => <figure><span>element {index}</span></figure>)
}

export const EditorView = () => {
  const [elements,setElements] = useState<Element[]>([])
  const addElement = useCallback(() => {
    const nextElement = {}
    setElements([...elements, nextElement])
  },[elements, setElements])

  return <>
    <button onClick={addElement}>Add</button>
    <Elements elements={elements}/>
  </>
}
