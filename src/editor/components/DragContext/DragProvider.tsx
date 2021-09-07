import React, {PropsWithChildren, useMemo} from "react";
import {DragContext} from "./DragContext";
import {DragRef} from "../helpers";

interface DragProviderProps{
  activeElementRef: DragRef,
  setActiveElement: (el: DragRef | undefined) => void
}

export const DragProvider = (props: PropsWithChildren<DragProviderProps>) => {
  const providerValue = useMemo(() => ({
    active: props.activeElementRef,
    setActive: props.setActiveElement
  }),[props.activeElementRef,props.setActiveElement])

  return <DragContext.Provider value={providerValue}>{
    props.children
  }</DragContext.Provider>
}
