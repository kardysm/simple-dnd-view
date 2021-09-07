import {FocusContext, FocusContextValue} from "../contexts";
import {useContext} from "react";

export const useFocusContext = () => {
  const focusContext = useContext(FocusContext)

  existsDragRefProvider(focusContext);

  return focusContext;
}

function existsDragRefProvider(ctx: FocusContextValue | undefined): asserts ctx is FocusContextValue {
  if (!ctx){
    throw new Error('Provider FocusContext provider is not present')
  }
}
