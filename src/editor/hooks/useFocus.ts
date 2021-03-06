import {FocusContext} from "../contexts";
import {useCallback} from "react";
import {Id} from "../utils";
import {useGuardedContext} from "./useGuardedContext";

export const useFocus = () => {
  const {focused, setFocused} = useGuardedContext(FocusContext)

  const setFocus = useCallback((id: Id) => {
    if (focused === id){
      return setFocused(null)
    }
    return setFocused(id)
  },[focused, setFocused])

  return {
    focusedElement: focused,
    setFocus
  }
}
