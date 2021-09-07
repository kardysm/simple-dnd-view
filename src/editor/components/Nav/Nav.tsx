import {Id} from "../../../utils";
import {useGuardedContext} from "../../hooks";
import {FocusContext} from "../../contexts";
import React from "react";

interface NavProps {
  removeElement: (id:Id) => void
  addElement: () => void
}

export const Nav = (props: NavProps)  => {
  const {removeElement,addElement} = props

  const {focused} = useGuardedContext(FocusContext);

  return <>
    <button onClick={addElement}>Add</button>
    {!!focused && <button onClick={() => removeElement(focused)}>Remove</button>}
  </>
}
