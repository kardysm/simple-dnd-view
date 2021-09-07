import {createContext} from "react";
import {DragRef} from "../helperTypes";

export interface ProviderValue {
  active: DragRef,
  setActive: (el: DragRef | undefined) => void
}

export const DragContext = createContext<ProviderValue | undefined>(undefined)
