import {ReactDragEvent} from "../helperTypes";

// Firefox drag event deos not contain pageX/Y data,
// and it is sourced as mouse click here

export function forgeDragEvent(event: ReactDragEvent) {
  return new MouseEvent('drag', event as unknown as MouseEventInit)
}
