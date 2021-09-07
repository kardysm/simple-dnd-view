import {ElementData} from "../../hooks";
import React, {useCallback, useState} from "react";
import {Id} from "../../../utils";
import {Element} from "../Element";

const useFocus = () => {
  const [focusedElement, setFocusedElement] = useState<Id | null>(null)

  const setFocus = useCallback((id: Id) => {
    if (focusedElement === id){
      return setFocusedElement(null)
    }
    return setFocusedElement(id)
  },[focusedElement])

  return {
    focusedElement,
    setFocus
  }
}
export const Elements = (props: {elements: ElementData[]}) => {
  const {elements} = props;

  const {setFocus, focusedElement} = useFocus()
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
