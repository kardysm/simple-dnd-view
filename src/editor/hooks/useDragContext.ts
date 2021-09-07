import {DragContext, DragContextValue} from "../contexts";
import {useContext} from "react";

export const useDragContext = () => {
  const dragContext = useContext(DragContext)

  existsDragRefProvider(dragContext);

  return dragContext;

}

function existsDragRefProvider(ctx: DragContextValue | undefined): asserts ctx is DragContextValue {
  if (!ctx){
    throw new Error('Provider DragContext provider is not present')
  }
}
