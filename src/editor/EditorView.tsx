import { useCallback, useEffect, useState } from "react"
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

interface ElementProps extends Element{
  onClick: () => void
  highlight?: boolean
}
interface Element extends Coordinates{
  id: Id
}

interface Coordinates {
  x: Coordinate,
  y: Coordinate
}

enum DragStatus {
  INACTIVE,
  ACTIVE
}

const Element = (props: ElementProps) => {
  const {id,x,y, highlight, onClick} = props;

  const [newX, setNewX] = useState(x);
  const [newY, setNewY] = useState(y);
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)
  const handleDragStart = useCallback(() => {
    setDragStatus(DragStatus.ACTIVE)
    console.log('set active')
  },[id])
  const handleDragMove = useCallback((event: MouseEvent) => {
    if (dragStatus !== DragStatus.ACTIVE){
      return
    }
    console.log(event)
    //update delta
    // setNewX(delta => delta + event.movementX)
    // setNewY(delta => delta + event.movementY)
    setNewX(event.clientX)
    setNewY(event.clientY)
  },[newX, newY, id,dragStatus])
  const handleDragEnd = useCallback(() => {
    //persist position
    //reset delta
    console.log('set inactive')
    setDragStatus(DragStatus.INACTIVE)
  }, [id])
  return <Draggable key={id} x={newX} y={newY} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={handleDragMove as any}>
    <figure>
      <ElementView highlight={highlight} onClick={onClick}/>
    </figure>
  </Draggable>
}

const Elements = (props: {elements: Element[]}) => {
  const {elements} = props;

  const [focusedElement, setFocusedElement] = useState<Id | null>(null)

  const setFocus = useCallback((id: Id) => {
    if (focusedElement === id){
      return setFocusedElement(null)
    }
    return setFocusedElement(id)
  },[focusedElement])


  return <>{
    elements.map(({id,x,y}, index) => <Element
      onClick={() => setFocus(id)}
      highlight={focusedElement === id}
      key={id}
      id={id}
      x={x}
      y={y}
    />)
  }</>

}
export const EditorView = () => {

  const [elements,setElements] = useState<Element[]>([])
  const addElement = useCallback(() => {
    const nextElement = {
      id: generateId(),
      x: (elements[elements.length-1]?.x ?? 0)+ 40,
      y: (elements[elements.length-1]?.y ?? 0)+ 40
    }
    setElements([...elements, nextElement])
  },[elements, setElements]);

  return <Canvas>
    <button onClick={addElement}>Add</button>
    <Elements elements={elements}/>
  </Canvas>
}

const Canvas = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 200px;
  min-height: 200px;
`

const Draggable = styled.div<Coordinates>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`

const ElementView = styled.div<{ highlight?: boolean }>`
  width: 46px;
  height: 46px;
  background: cornflowerblue;
  border: 4px ${props => props.highlight ? `red solid` : `#000 dashed`};
  overflow: hidden;
`
