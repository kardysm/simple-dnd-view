import {fireEvent, render} from '@testing-library/react'
import { EditorView } from './EditorView';

describe('EditorView',()=>{
  it('should add one element on "add" button click', async function () {
    //arrange
    const {getByRole, getAllByRole} = render(<EditorView/>)

    //assert
    const addButton = getByRole('button', {name: 'Add'})

    //act
    fireEvent.click(addButton)

    //assert
    expect(getAllByRole('figure').length).toBe(1)
  });

  it('should remove active element on "remove" button click', function () {
    //arrange
    const {getByRole} = render(<EditorView/>)

    //assert
    const addButton = getByRole('button', {name: 'Add'})

    //act
    fireEvent.click(addButton)

    //arrange
    const element = getByRole('figure');

    //act
    fireEvent.click(element)
    fireEvent.click(getByRole('button',{name: 'Remove'}))

    expect(element).not.toBeInTheDocument()
  });

  it('should add 5 elements', function () {
    //arrange
    const {getByRole, getAllByRole} = render(<EditorView/>)

    //assert
    const addButton = getByRole('button', {name: 'Add'})

    //act
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    //assert
    expect(getAllByRole('figure').length).toBe(5)
  });

})
