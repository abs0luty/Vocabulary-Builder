import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Word from '../components/Word'
import { getWordData } from '../services/wordAPI'
import Filter from '../components/Filter'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateWordData,
  updateIsLoading,
} from '../reducers/wordMeaningsReducer'

const WordMeanings = () => {
  const { word } = useParams()
  const dispatch = useDispatch()
  const { wordData, isLoading, partOfSpeechFilter } = useSelector(
    (state) => state.wordMeanings
  )

  let displayedMeanings

  if (partOfSpeechFilter !== '') {
    if (partOfSpeechFilter === 'other') {
      displayedMeanings = wordData?.filter(
        (result) =>
          result.partOfSpeech !== 'noun' &&
          result.partOfSpeech !== 'verb' &&
          result.partOfSpeech !== 'adjective' &&
          result.partOfSpeech !== 'adverb'
      )
    } else {
      displayedMeanings = wordData?.filter(
        (result) => result.partOfSpeech === partOfSpeechFilter
      )
      console.log('displayedMeanings', displayedMeanings)
    }
  } else {
    displayedMeanings = wordData
  }

  console.log('word inside WordMeanings', word)
  console.log('wordData', wordData)

  useEffect(() => {
    async function fetchData() {
      dispatch(updateIsLoading(true))
      let returnedWordData = await getWordData(word)
      console.log('returnedWordData', returnedWordData)
      dispatch(updateWordData(returnedWordData))
      dispatch(updateIsLoading(false))
    }
    fetchData()
  }, [word])

  let wordDataElement
  if (isLoading || !wordData) {
    wordDataElement = <div>Loading...</div>
  } else if (displayedMeanings && displayedMeanings.length > 0) {
    wordDataElement = displayedMeanings.map((result, i) => (
      <Word
        key={result.word + i}
        wordData={result}
        page='search'
      />
    ))
  } else if (partOfSpeechFilter === '') {
    wordDataElement = (
      <Word
        key={wordData?.word || 'no word'}
        wordData={wordData}
      />
    )
  }

  return (
    <div className='search--word-meanings flex flex-col gap-5 px-2'>
      <nav className='flex items-center flex-wrap md:justify-between gap-3'>
        <Filter page='search' />
      </nav>
      {wordDataElement}
    </div>
  )
}

export default WordMeanings
