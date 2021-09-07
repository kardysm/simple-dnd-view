import React, {PropsWithChildren, useMemo} from "react";
import {DragContext} from "../../contexts";
import {DragRef} from "../../helperTypes";

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

