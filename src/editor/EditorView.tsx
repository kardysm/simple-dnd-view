import { useCallback, useState } from "react"
import { v4 as uuidv4, validate } from 'uuid'

type Id = string & {readonly type: symbol}

function generateId() {
  const newId = uuidv4();
  isId(newId)
  return newId;
}
function isId(x: string): asserts x is Id{
  if (!validate(x)){
    throw new Error('id is not uuid')
  }
}

interface Element{
  id: Id
}

const Elements = (props: {elements: Element[]}) => {
  const {elements} = props;

  return <>{
    elements.map((el, index) => <figure><span>element {el.id}</span></figure>)
  }</>
}

export const EditorView = () => {
  const [elements,setElements] = useState<Element[]>([])
  const addElement = useCallback(() => {
    const nextElement = {
      id: generateId()
    }
    setElements([...elements, nextElement])
  },[elements, setElements]);

  return <>
    <button onClick={addElement}>Add</button>
    <Elements elements={elements}/>
  </>
}
