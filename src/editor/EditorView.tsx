import React, {
  createContext,
  DragEventHandler,
  MutableRefObject, PropsWithChildren,
  useCallback, useContext,
  useMemo,
  useRef,
  useState
} from "react"
import styled from "styled-components";
import {generateId, Id} from "../utils";

type Coordinate = number;

interface ElementProps extends ElementData{
  onClick: () => void
  highlight?: boolean
}
interface ElementData {
  id: Id,
  initialX: Coordinate,
  initialY: Coordinate
}

interface Coordinates {
  x: Coordinate,
  y: Coordinate
}

interface Active {
  active?: boolean
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
const isNativeDrag = (event: DragEvent) => event.isTrusted

const Element = (props: ElementProps) => {
  const {id,initialX,initialY, highlight, onClick} = props;

  const [position, setPosition] = useState<Coordinates>({
    x: initialX,
    y: initialY
  })

  const [dragOffset, setDragOffset] = useState<Coordinates>({
    x: 0,
    y: 0
  })

  const draggableRef = useRef<HTMLDivElement>()
  const lastMeaningfulEvent = useRef<DragEvent>()
  const dragContext = useContext(DragRefProvider)
  existsDragRefProvider(dragContext);
  const {setActive: setActiveDraggable} = dragContext;
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setActiveDraggable(draggableRef)
    requestAnimationFrame(() => setDragStatus(DragStatus.ACTIVE))

    setDragOffset({
      x: e.pageX - position.x,
      y: e.pageY - position.y
    })
  },[position, setActiveDraggable])

  const handleDragMove = useCallback((event: DragEvent) => {
    if (isNativeDrag(event)){
      return
    }
    lastMeaningfulEvent.current = event;

  },[])
  const handleDragEnd = useCallback((e: any) => {
    const persistPosition = () => {
      const dragEvent = lastMeaningfulEvent.current
      console.log(e, dragEvent)

      setPosition({
      x: (dragEvent ?? e).pageX - dragOffset.x,
        y: (dragEvent ?? e).pageY - dragOffset.y
    })
    }

    persistPosition();

    setDragStatus(DragStatus.INACTIVE)
  }, [dragOffset])

  return <Draggable
    ref={(instance) => draggableRef.current = instance!}
    draggable
    active={dragStatus === DragStatus.ACTIVE}
    key={id} x={position.x} y={position.y} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrag={handleDragMove as any}>
    <figure>
      <ElementView highlight={highlight} onClick={onClick}/>
    </figure>
  </Draggable>
}

const Elements = (props: {elements: ElementData[]}) => {
  const {elements} = props;

  const [focusedElement, setFocusedElement] = useState<Id | null>(null)

  const setFocus = useCallback((id: Id) => {
    if (focusedElement === id){
      return setFocusedElement(null)
    }
    return setFocusedElement(id)
  },[focusedElement])


  return <>{
    elements.map(({id,initialX,initialY}, index) => <Element
      onClick={() => setFocus(id)}
      highlight={focusedElement === id}
      key={id}
      id={id}
      initialX={initialX}
      initialY={initialY}
    />)
  }</>

}

function createElement(elements: ElementData[]){
  const lastEl = elements[elements.length-1];
  return {
    id: generateId(),
    initialX: (lastEl?.initialX ?? 0)+ 40,
    initialY: (lastEl?.initialY ?? 0)+ 40
  }
}

const useElements = () => {
  const [elements,setElements] = useState<ElementData[]>([])
  const addElement = useCallback(() => {
    const nextElement = createElement(elements)
    setElements([...elements, nextElement])
  },[elements, setElements]);

  return {elements, addElement}
}
export const EditorView = () => {
  const {elements, addElement} = useElements();

  return <DragCanvas>
      <button onClick={addElement}>Add</button>
      <Elements elements={elements}/>
  </DragCanvas>
}

const useRefWithSetter = () => {
  const ref = useRef<HTMLDivElement>();
  const setRef = useCallback((refToSet: DragRef | undefined) => {
    ref.current = refToSet?.current
  },[])

  return {ref, setRef}
}
const DragCanvas = (props: PropsWithChildren<{}>) => {
  const {ref: activeElement, setRef: setActiveElement} = useRefWithSetter()

  const dispatchDragPosition: DragEventHandler<HTMLDivElement> = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      if (!activeElement.current){
        return;
      }

      activeElement.current?.dispatchEvent?.(forgeDragEvent(event))
      event.preventDefault();
    },[activeElement])

  return <Canvas onDragOver={dispatchDragPosition}>
    <DragProvider activeElementRef={activeElement} setActiveElement={setActiveElement}>
      {props.children}
    </DragProvider>
  </Canvas>
}

// Firefox drag event deos not contain pageX/Y data,
// and it is sourced as mouse click here
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

  return <DragRefProvider.Provider value={providerValue}>{
    props.children
  }</DragRefProvider.Provider>
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

const Draggable = styled.div<Coordinates & Active>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  opacity: ${props => props.active ? '0' : 'unset'};
  & figure {
    margin: 0;
  }
`

const ElementView = styled.div<{ highlight?: boolean }>`
  width: 46px;
  height: 46px;
  background: cornflowerblue;
  border: 4px ${props => props.highlight ? `red solid` : `#000 dashed`};
  overflow: hidden;
`
