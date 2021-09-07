import {createContext} from "react";
import {DragRef} from "../components/helpers";

export interface ProviderValue {
  active: DragRef,
  setActive: (el: DragRef | undefined) => void
}

export const DragContext = createContext<ProviderValue | undefined>(undefined)
