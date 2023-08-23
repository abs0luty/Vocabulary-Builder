import { useDispatch, useSelector } from 'react-redux'
import {
  updateFlashcardsMode,
  updateFlashcardsWordArray,
} from '../reducers/flashcardsReducer'
import { Link } from 'react-router-dom'

const FlashcardsMode = () => {
  const { mode } = useSelector((state) => state.flashcards)
  const { words } = useSelector((state) => state.journal)
  const dispatch = useDispatch()

  const buttonStyleClassName = (buttonMode) => {
    const baseStyle =
      'border-2 text-gray-600 rounded-xl py-2 px-4 w-full flex justify-center items-center hover:font-semibold'
    const colorStyle = () => {
      switch (buttonMode) {
        case 'wordToMeaning':
          return (
            'border-amber-100 hover:bg-amber-100' +
            (mode === 'wordToMeaning' ? ' bg-amber-100 font-semibold' : '')
          )
        case 'meaningToWord':
          return (
            'border-sky-100 hover:bg-sky-100' +
            (mode === 'meaningToWord' ? ' bg-sky-100 font-semibold' : '')
          )
        case 'mixed':
          return (
            'border-rose-100 hover:bg-rose-100' +
            (mode === 'mixed' ? ' bg-rose-100 font-semibold' : '')
          )
        default:
          return ''
      }
    }
    return baseStyle + ' ' + colorStyle()
  }

  const handleModeClick = (e) => {
    e.stopPropagation()
    dispatch(updateFlashcardsMode(e.target.name))
  }

  const shuffleArray = (array) => {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
  }

  const initWordArray = () => {
    const wordArray = words.map((word) => ({
      word: word.word,
      definition: word.definition,
      images: word.images,
    }))
    shuffleArray(wordArray)
    dispatch(updateFlashcardsWordArray(wordArray))
  }

  const handleStart = (e) => {
    if (mode === '') {
      e.preventDefault()
      window.alert('Please select a mode')
    } else {
      initWordArray()
    }
  }

  return (
    <div className='flex flex-col gap-5 text-center'>
      <h2 className='text-lg font-bold'>Please select a mode:</h2>
      <div className='flex flex-col gap-4'>
        <button
          name='wordToMeaning'
          onClick={handleModeClick}
          className={buttonStyleClassName('wordToMeaning')}>
          Show Word, Guess Meaning
        </button>
        <button
          name='meaningToWord'
          onClick={handleModeClick}
          className={buttonStyleClassName('meaningToWord')}>
          Show Meaning, Guess Word
        </button>
        <button
          name='mixed'
          onClick={handleModeClick}
          className={buttonStyleClassName('mixed')}>
          Mixed Mode
        </button>
      </div>
      <Link
        to={mode === '' ? '' : 'card'}
        onClick={handleStart}>
        <button className='mt-7 w-full text-lg rounded-lg px-3 py-2 font-semibold text-white bg-indigo-400 hover:bg-indigo-500'>
          Start
        </button>
      </Link>
    </div>
  )
}

export default FlashcardsMode
