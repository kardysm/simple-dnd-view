import {fireEvent, render} from '@testing-library/react'
import { EditorView } from './EditorView';

describe('EditorView',()=>{
  it('should add element on "add" button click', async function () {
    //arrange
    const {getByRole, findAllByRole} = render(<EditorView/>)

    //assert
    const addButton = getByRole('button', {name: 'Add'})

    //act
    fireEvent.click(addButton)

    //assert
    const elements = await findAllByRole('figure')
    expect(elements.length).toBe(1)
  });

  it.skip('should remove highlighted element on "remove" button click', function () {

  });

  it.skip('should add 5 elements', async function () {
    //arrange
    const {getByRole, findAllByRole} = render(<EditorView/>)

    //assert
    const addButton = getByRole('button', {name: 'Add'})

    //act
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    //assert
    const elements = await findAllByRole('figure')
    expect(elements.length).toBe(5)
  });


})
