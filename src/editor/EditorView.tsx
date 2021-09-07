import React from "react"
import {DragCanvas} from "./components/DragCanvas";
import {useElements} from "./hooks";
import {Elements} from "./components/Elements";
import {FocusProvider} from "./components/FocusProvider";
import {Nav} from "./components/Nav";

export const EditorView = () => {
  const {elements, addElement, removeElement} = useElements();

  return <DragCanvas>
    <FocusProvider>
      <Nav addElement={addElement} removeElement={removeElement}/>
      <Elements elements={elements}/>
    </FocusProvider>
  </DragCanvas>
}

