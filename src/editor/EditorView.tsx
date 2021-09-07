import React, {
  PropsWithChildren,
  useCallback, useState
} from "react"
import styled from "styled-components";
import {Id} from "../utils";
import {DragCanvas} from "./components/DragCanvas";
import {Coordinates} from "./helperTypes";
import {DragStatus, ElementData, useDrag, useElements} from "./hooks";

interface ElementProps extends ElementData{
  onClick: () => void
  highlight?: boolean
}


interface Active {
  active?: boolean
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
