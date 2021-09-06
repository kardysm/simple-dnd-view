import { useCallback, useState } from "react"
import { v4 as uuidv4, validate } from 'uuid'
import styled from "styled-components";


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

type Coordinate = number;
interface Element{
  id: Id,
  x: Coordinate,
  y: Coordinate
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
      id: generateId(),
      x: elements[elements.length-1].x + 10,
      y: elements[elements.length-1].y + 10
    }
    setElements([...elements, nextElement])
  },[elements, setElements]);

  return <Canvas>
    <button onClick={addElement}>Add</button>
    <Elements elements={elements}/>
  </Canvas>
}

const Canvas = styled.div`
  position: relative;
`
