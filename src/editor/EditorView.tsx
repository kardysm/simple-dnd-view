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
interface Element extends Coordinates{
  id: Id
}

interface Coordinates {
  x: Coordinate,
  y: Coordinate
}

const Draggable = styled.div<Coordinates>`
  position: absolute;
  left: ${props => props.x};
  top: ${props => props.y};
`

const Element = (props: Element) => {
  const {id,x,y} = props;
  return <Draggable x={x} y={y}>
    <figure>
      <span>element {id}</span>
    </figure>
  </Draggable>
}

const Elements = (props: {elements: Element[]}) => {
  const {elements} = props;

  return <>{
    elements.map(({id,x,y}, index) => <Element key={id} id={id} x={x} y={y}/>)
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
