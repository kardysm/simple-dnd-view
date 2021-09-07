import {useCallback, useRef, useState} from "react";
import {Coordinates, ReactDragEvent} from "../helperTypes";
import {useGuardedContext} from "./useGuardedContext";
import {DragContext} from "../contexts";

export enum DragStatus {
  INACTIVE,
  ACTIVE
}

export const useDrag = (position: Coordinates, setPosition: (newPos: Coordinates) => void) => {
  const [dragOffset, setDragOffset] = useState<Coordinates>({
    x: 0,
    y: 0
  })
  const [dragStatus, setDragStatus] = useState<DragStatus>(DragStatus.INACTIVE)

  const draggableRef = useRef<HTMLDivElement>()
  const lastMeaningfulEvent = useRef<ReactDragEvent>()

  const {setActive: setActiveDraggable} = useGuardedContext(DragContext);

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

const isNativeDrag = (event: ReactDragEvent) => event.isTrusted
