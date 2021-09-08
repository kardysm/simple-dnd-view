import {ElementData} from "../../hooks";
import {Draggable} from "../Draggable";
import styled from "styled-components";

export interface ElementProps extends ElementData{
  onClick: () => void
  highlight?: boolean
}

export const Element = (props: ElementProps) => {
  const {initialX,initialY, highlight, onClick} = props;

  return <Draggable initialX={initialX} initialY={initialY}>
    <figure onClick={onClick}>
      <ElementView highlight={highlight}/>
    </figure>
  </Draggable>
}

const ElementView = styled.div<{ highlight?: boolean }>`
  width: 46px;
  height: 46px;
  background: cornflowerblue;
  border: 4px ${props => props.highlight ? `red solid` : `#000 dashed`};
  overflow: hidden;
`
