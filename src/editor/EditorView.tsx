import React, {
  PropsWithChildren,
  useCallback, useRef,
  useState
} from "react"
import styled from "styled-components";
import {generateId, Id} from "../utils";
import {ReactDragEvent} from "./components/helpers";
import {useDragContext} from "./components/DragContext";
import {DragCanvas} from "./components/DragCanvas";

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

const isNativeDrag = (event: ReactDragEvent) => event.isTrusted

const useDrag = (position: Coordinates, setPosition: (newPos: Coordinates) => void) => {
  const [dragOffset, setDragOffset] = useState<Coordinates>({
    x: 0,
    y: 0
  })
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)

  const draggableRef = useRef<HTMLDivElement>()
  const lastMeaningfulEvent = useRef<ReactDragEvent>()

  const {setActive: setActiveDraggable} = useDragContext();

  const handleDragStart = useCallback((e: ReactDragEvent) => {
    setActiveDraggable(draggableRef)
    requestAnimationFrame(() => setDragStatus(DragStatus.ACTIVE))

    setDragOffset({
      x: e.pageX - position.x,
      y: e.pageY - position.y
    })
  },[position, setActiveDraggable])

  const handleDragMove = useCallback((event: ReactDragEvent) => {
    if (isNativeDrag(event)){
      return
    }
    lastMeaningfulEvent.current = event;

  },[])

  const handleDragEnd = useCallback((e: any) => {
    const persistPosition = () => {
      //catch last drag event - to overcome Firefox issue, see: forgeDragEvent
      const dragEvent = lastMeaningfulEvent.current

      setPosition({
        x: (dragEvent ?? e).pageX - dragOffset.x,
        y: (dragEvent ?? e).pageY - dragOffset.y
      })
    }

    persistPosition();
    setDragStatus(DragStatus.INACTIVE)
  }, [dragOffset.x, dragOffset.y, setPosition])

  return {
    dragStatus,
    draggableRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}

const Draggable = (props: PropsWithChildren<Omit<ElementData,'id'>>) => {
  const {initialX,initialY,children} = props
  const [position, setPosition] = useState<Coordinates>({
    x: initialX,
    y: initialY
  })

  const {
    draggableRef,
    dragStatus,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useDrag(position,setPosition)

  return <DraggableDiv
    ref={(instance) => draggableRef.current = instance!}
    draggable
    active={dragStatus === DragStatus.ACTIVE}
    x={position.x}
    y={position.y}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDrag={handleDragMove}
  >
    {children}
  </DraggableDiv>
}

const Element = (props: ElementProps) => {
  const {initialX,initialY, highlight, onClick} = props;

  return <Draggable initialX={initialX} initialY={initialY}>
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

const INITIAL_OFFSET = 40;

function createElement(elements: ElementData[]){
  const lastEl = elements[elements.length-1];
  return {
    id: generateId(),
    initialX: (lastEl?.initialX ?? 0)+ INITIAL_OFFSET,
    initialY: (lastEl?.initialY ?? 0)+ INITIAL_OFFSET
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




const DraggableDiv = styled.div<Coordinates & Active>`
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
