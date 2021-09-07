import React, {
  useCallback, useState
} from "react"
import styled from "styled-components";
import {Id} from "../utils";
import {DragCanvas} from "./components/DragCanvas";
import {ElementData, useElements} from "./hooks";
import {Draggable} from "./components/Draggable";

interface ElementProps extends ElementData{
  onClick: () => void
  highlight?: boolean
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

const ElementView = styled.div<{ highlight?: boolean }>`
  width: 46px;
  height: 46px;
  background: cornflowerblue;
  border: 4px ${props => props.highlight ? `red solid` : `#000 dashed`};
  overflow: hidden;
`
