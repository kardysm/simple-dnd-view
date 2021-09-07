import React, {
  createContext,
  DragEventHandler,
  FC,
  MutableRefObject, PropsWithChildren,
  ReactChildren, ReactElement, RefObject,
  useCallback, useContext,
  useEffect, useMemo,
  useRef,
  useState
} from "react"
import { v4 as uuidv4, validate } from 'uuid'
import styled from "styled-components";
import {pipeline} from "stream";


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

function existsDragRefProvider(ctx: ProviderValue | undefined): asserts ctx is ProviderValue {
  if (!ctx){
    throw new Error('Provider DragRefProvider provider is not present')
  }
}

const Element = (props: ElementProps) => {
  const {id,x,y, highlight, onClick} = props;

  const [newX, setNewX] = useState(x);
  const [newY, setNewY] = useState(y);

  const draggableRef = useRef<HTMLDivElement>()
  const lastMeaningfulEvent = useRef<HTMLDivElement>()
  const dragContext = useContext(DragRefProvider)
  existsDragRefProvider(dragContext);
  const {setActive: setActiveDraggable} = dragContext;
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)
  const handleDragStart = useCallback(() => {
    setDragStatus(DragStatus.ACTIVE)

    setActiveDraggable(draggableRef)
    console.log('set active')
  },[id])
  const handleDragMove = useCallback((event: MouseEvent) => {
    if (dragStatus !== DragStatus.ACTIVE){
      return
    }
    console.log(event)
    if (event.pageX && event.pageY)
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
    setActiveDraggable(undefined)

    setNewX(e.pageX)
    setNewY(e.pageY)
    setDragStatus(DragStatus.INACTIVE)
  }, [id])
  return <Draggable
    ref={(instance) => draggableRef.current = instance!}
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

  const activeElement = useRef<HTMLDivElement>();

  const setActiveElement = useCallback((ref: DragRef | undefined) => {
    activeElement.current = ref?.current
  },[])

  const dispatchDragPosition: DragEventHandler<HTMLDivElement> = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!activeElement.current){
      return;
    }
    console.log(activeElement)
    activeElement.current?.dispatchEvent?.(forgeDragEvent(event))
    event.preventDefault();
  },[activeElement])

  return <Canvas onDragOver={dispatchDragPosition}>
    <button onClick={addElement}>Add</button>
    <DragProvider activeElementRef={activeElement} setActiveElement={setActiveElement}>
      <Elements elements={elements}/>
    </DragProvider>
  </Canvas>
}

function forgeDragEvent(event: React.DragEvent<HTMLDivElement>) {
  return new MouseEvent('drag', event as unknown as MouseEventInit)
}

type DragRef = MutableRefObject<HTMLDivElement|undefined>
interface ProviderValue {
  active: DragRef,
  setActive: (el: DragRef | undefined) => void
}
const DragRefProvider = createContext<ProviderValue | undefined>(undefined)
interface DragProviderProps{
  activeElementRef: DragRef,
  setActiveElement: (el: DragRef | undefined) => void
}
const DragProvider = (props: PropsWithChildren<DragProviderProps>) => {
  const providerValue = useMemo(() => ({
    active: props.activeElementRef,
    setActive: props.setActiveElement
  }),[props.activeElementRef,props.setActiveElement])
  return <DragRefProvider.Provider value={providerValue}>{props.children}</DragRefProvider.Provider>
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
