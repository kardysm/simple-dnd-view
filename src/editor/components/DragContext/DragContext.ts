import {createContext} from "react";
import {DragRef} from "../helpers";

export interface ProviderValue {
  active: DragRef,
  setActive: (el: DragRef | undefined) => void
}

export const DragContext = createContext<ProviderValue | undefined>(undefined)
