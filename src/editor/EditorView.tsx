import React from "react"
import {DragCanvas} from "./components/DragCanvas";
import {useElements} from "./hooks";
import {Elements} from "./components/Elements";



export const EditorView = () => {
  const {elements, addElement} = useElements();

  return <DragCanvas>
      <button onClick={addElement}>Add</button>
      <Elements elements={elements}/>
  </DragCanvas>
}

