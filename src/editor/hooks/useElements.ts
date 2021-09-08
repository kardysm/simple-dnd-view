import {useCallback, useState} from "react";
import {generateId, Id} from "../utils";
import {Coordinate} from "../helperTypes";

export interface ElementData {
  id: Id,
  initialX: Coordinate,
  initialY: Coordinate
}

export const useElements = () => {
  const [elements,setElements] = useState<ElementData[]>([])

  const addElement = useCallback(() => {
    const nextElement = createElement(elements)
    setElements([...elements, nextElement])
  },[elements, setElements]);

  const removeElement = useCallback((id: Id) => {
    const result = elements.filter(element => element.id !== id)

    setElements(result);
  },[elements])

  return {elements, addElement, removeElement}
}

const INITIAL_OFFSET = 40;

function createElement(elements: ElementData[]){
  const lastEl = elements[elements.length-1];
  return {
    id: generateId(),
    initialX: (lastEl?.initialX ?? 0)+ INITIAL_OFFSET,
    initialY: (lastEl?.initialY ?? 0)+ INITIAL_OFFSET
  }
}
