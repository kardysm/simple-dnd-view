import React, {MutableRefObject} from "react";

export type DragRef = MutableRefObject<HTMLDivElement|undefined>

export type ReactDragEvent = React.DragEvent<HTMLDivElement>;

export interface Coordinates {
  x: Coordinate,
  y: Coordinate
}

export type Coordinate = number;
