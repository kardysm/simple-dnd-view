import {ElementData, useGuardedContext} from "../../hooks";
import React, {useCallback, useState} from "react";
import {Id} from "../../../utils";
import {Element} from "../Element";
import {FocusContext} from "../../contexts";

const useFocus = () => {
  const {focused, setFocused} = useGuardedContext(FocusContext)

  const setFocus = useCallback((id: Id) => {
    if (focused === id){
      return setFocused(null)
    }
    return setFocused(id)
  },[focused, setFocused])

  return {
    focusedElement: focused,
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
