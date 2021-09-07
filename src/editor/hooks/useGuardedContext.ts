import {Context, useContext} from "react";

export const useGuardedContext = <T>(context: Context<T>) => {
  const contextValue = useContext(context)

  existsProvider(contextValue, context);

  return contextValue;
}

function existsProvider<T>(ctxValue: T | undefined, context:Context<T>): asserts ctxValue is T extends undefined ? never : T {
  if (!ctxValue){
    throw new Error(`Provider ${context.displayName} is not present`)
  }
}
