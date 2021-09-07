import React, {DragEventHandler, PropsWithChildren, useCallback, useRef} from "react";
import styled from "styled-components";
import {forgeDragEvent} from "../../../utils";
import {DragProvider} from "../DragProvider";
import {DragRef, ReactDragEvent} from "../../helperTypes";

export const DragCanvas = (props: PropsWithChildren<{}>) => {
  const {ref: activeElement, setRef: setActiveElement} = useRefWithSetter()

  const dispatchDragPosition: DragEventHandler<HTMLDivElement> = useCallback((event: ReactDragEvent) => {
    if (!activeElement.current){
      return;
    }

    activeElement.current?.dispatchEvent?.(forgeDragEvent(event))
    event.preventDefault();
  },[activeElement])

  return <CanvasDiv onDragOver={dispatchDragPosition}>
    <DragProvider activeElementRef={activeElement} setActiveElement={setActiveElement}>
      {props.children}
    </DragProvider>
  </CanvasDiv>
}

const useRefWithSetter = () => {
  const ref = useRef<HTMLDivElement>();
  const setRef = useCallback((refToSet: DragRef | undefined) => {
    ref.current = refToSet?.current
  },[])

  return {ref, setRef}
}

const CanvasDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 200px;
  min-height: 200px;
`
