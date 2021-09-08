import {createContext} from "react";
import {Id} from "../utils";

export interface FocusContextValue {
  focused: Id | null,
  setFocused: (id: Id | null) => void
}
export const FocusContext = createContext<FocusContextValue | undefined>(undefined)
