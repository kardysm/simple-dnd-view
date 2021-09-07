import {DragContext, ProviderValue} from "../contexts";
import {useContext} from "react";

export const useDragContext = () => {
  const dragContext = useContext(DragContext)

  existsDragRefProvider(dragContext);

  return dragContext;

}

function existsDragRefProvider(ctx: ProviderValue | undefined): asserts ctx is ProviderValue {
  if (!ctx){
    throw new Error('Provider DragRefProvider provider is not present')
  }
}
