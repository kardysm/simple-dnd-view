import {createContext} from "react";
import {DragRef} from "../helperTypes";

export interface DragContextValue {
  active: DragRef,
  setActive: (el: DragRef | undefined) => void
}

export const DragContext = createContext<DragContextValue | undefined>(undefined)
