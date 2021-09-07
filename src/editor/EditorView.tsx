import React, {
  useCallback, useState
} from "react"
import {Id} from "../utils";
import {DragCanvas} from "./components/DragCanvas";
import {ElementData, useElements} from "./hooks";
import {Element} from './components/Element'

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

