import React, {PropsWithChildren, useState} from "react";
import {DragStatus, ElementData, useDrag} from "../../hooks";
import {Active, Coordinates} from "../../helperTypes";
import styled from "styled-components";

export const Draggable = (props: PropsWithChildren<Omit<ElementData,'id'>>) => {
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

const DraggableDiv = styled.div<Coordinates & Active>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  opacity: ${props => props.active ? '0' : 'unset'};
  & figure {
    margin: 0;
  }
`
