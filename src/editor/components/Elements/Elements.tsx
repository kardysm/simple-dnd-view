import {ElementData, useFocus} from "../../hooks";
import {Element} from "../Element";

export const Elements = (props: {elements: ElementData[]}) => {
  const {elements} = props;

  const {setFocus, focusedElement} = useFocus()
  return <>{
    elements.map(({id,initialX,initialY}, index) => <Element
      onClick={() => setFocus(id)}
      highlight={focusedElement === id}
      key={id}
      id={id}
      initialX={initialX}
      initialY={initialY}
    />)
  }</>
}
