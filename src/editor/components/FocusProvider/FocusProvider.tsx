import React, {PropsWithChildren, useMemo, useState} from "react";
import {FocusContext} from "../../contexts";
import {Id} from "../../../utils";

export const FocusProvider = (props: PropsWithChildren<{ }>) => {
  const [focused, setFocused] = useState<Id | null>(null)

  const providerValue = useMemo(() => ({
    focused,
    setFocused
  }),[focused])

  return <FocusContext.Provider value={providerValue}>{
    props.children
  }</FocusContext.Provider>
}

