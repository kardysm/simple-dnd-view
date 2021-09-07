import React, {
  createContext,
  DragEventHandler,
  FC,
  MutableRefObject, PropsWithChildren,
  ReactChildren, ReactElement, RefObject,
  useCallback, useContext,
  useEffect,
  useRef,
  useState
} from "react"
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

  const draggableRef = useRef<HTMLDivElement>(null)
  const activeDragRef = useContext(DragRefProvider)
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)
  const handleDragStart = useCallback(() => {
    setDragStatus(DragStatus.ACTIVE)

    if (!activeDragRef || draggableRef.current === null){
      return
    }
    activeDragRef.current = draggableRef.current
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
    // setNewX(event.clientX)
    // setNewY(event.clientY)
  },[newX, newY, id,dragStatus])
  const handleDragEnd = useCallback((e: any) => {
    //persist position
    //reset delta
    console.log('set inactive', e)
    if (!activeDragRef){
      return;
    }
    activeDragRef.current = undefined
    setNewX(e.screenX)
    setNewY(e.screenY)
    setDragStatus(DragStatus.INACTIVE)
  }, [id])
  return <Draggable
    ref={draggableRef}
    draggable
    key={id} x={newX} y={newY} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag={handleDragMove as any}>
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

  const draggedRef = useRef<HTMLDivElement>();

  const dispatchDragPosition: DragEventHandler<HTMLDivElement> = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!draggedRef.current){
      return;
    }
    draggedRef.current?.dispatchEvent(new MouseEvent('drag', event as unknown as MouseEventInit))
    event.preventDefault();
  },[draggedRef])

  return <Canvas onDragOver={dispatchDragPosition}>
    <button onClick={addElement}>Add</button>
    <DragProvider dragRef={draggedRef}>
      <Elements elements={elements}/>
    </DragProvider>
  </Canvas>
}

type DragRef = MutableRefObject<HTMLDivElement|undefined>
const DragRefProvider = createContext<DragRef | undefined>(undefined)
interface DragProviderProps{
  dragRef: DragRef
}
const DragProvider = (props: PropsWithChildren<DragProviderProps>) => {
  return <DragRefProvider.Provider value={props.dragRef}>{props.children}</DragRefProvider.Provider>
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
