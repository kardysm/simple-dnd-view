import React from "react"
import {DragCanvas} from "./components/DragCanvas";
import {useElements} from "./hooks";
import {Elements} from "./components/Elements";
import {FocusProvider} from "./components/FocusProvider";

export const EditorView = () => {
  const {elements, addElement} = useElements();

  return <DragCanvas>
    <FocusProvider>
      <button onClick={addElement}>Add</button>
      <button onClick={removeActiveElement}>Remove</button>
      <Elements elements={elements}/>
    </FocusProvider>
  </DragCanvas>
}

