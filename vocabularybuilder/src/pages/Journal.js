import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Word from '../components/Word'
import SearchField from '../components/SearchField'
import Filter from '../components/Filter'
import WordForm from '../components/WordForm'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateWords,
  updateJournalSearchValue,
  updateSortValue,
} from '../reducers/journalReducer'

const Journal = () => {
  const dispatch = useDispatch()
  const { words, searchValue, sortValue, partOfSpeechFilter, showForm } =
    useSelector((state) => state.journal)

  const sortOptions = {
    updated: (a, b) => b.lastUpdated.localeCompare(a.lastUpdated),
    created: (a, b) => b.created.localeCompare(a.created),
    alphabetical: (a, b) => a.word.localeCompare(b.word),
    length: (a, b) => a.word.length - b.word.length,
    partOfSpeech: (a, b) => a.partOfSpeech.localeCompare(b.partOfSpeech),
  }

  useEffect(() => {
    try {
      dispatch(updateWords(JSON.parse(localStorage.getItem('journal'))))
    } catch {
      dispatch(updateWords([]))
    }
  }, [])

  const getFilteredAndSortedWords = () => {
    let filteredAndSortedWords = [...words]
    if (searchValue !== '') {
      filteredAndSortedWords = filteredAndSortedWords
        .filter((word) =>
          word.word.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort(sortOptions[sortValue])
    } else {
      filteredAndSortedWords = filteredAndSortedWords.sort(
        sortOptions[sortValue]
      )
    }

    if (partOfSpeechFilter) {
      if (partOfSpeechFilter === 'other') {
        filteredAndSortedWords = filteredAndSortedWords.filter(
          (word) =>
            word.partOfSpeech !== 'noun' &&
            word.partOfSpeech !== 'verb' &&
            word.partOfSpeech !== 'adjective' &&
            word.partOfSpeech !== 'adverb'
        )
      } else {
        filteredAndSortedWords = filteredAndSortedWords.filter(
          (word) => word.partOfSpeech === partOfSpeechFilter
        )
      }
    }

    return filteredAndSortedWords
  }

  const displayedWords = getFilteredAndSortedWords()

  return (
    <>
      <div className='journal flex flex-col gap-4'>
        <div className='journal--search'>
          <SearchField
            searchValue={searchValue}
            setSearchValue={updateJournalSearchValue}
            placeholder='Search journal'
            handleInputChange={(e) =>
              dispatch(updateJournalSearchValue(e.target.value))
            }
          />
        </div>
        <div className='journal--control flex flex-col gap-3 md:flex-row md:justify-between'>
          <nav>
            <Filter page='journal' />
          </nav>

          <select
            className='journal--sort border-indigo-100 border-2 rounded-xl py-1 px-3 text-sm font-semibold'
            onChange={(e) => dispatch(updateSortValue(e.target.value))}
            value={sortValue}>
            <option disabled>Sort by</option>
            <option value='updated'>Recently updated</option>
            <option value='alphabetical'>Alphabetical</option>
            <option value='length'>Length</option>
            <option value='partOfSpeech'>Part of speech</option>
            <option value='created'>Recently created</option>
          </select>
        </div>
        <div className='journal--words flex flex-col gap-3'>
          {displayedWords?.length > 0 ? (
            displayedWords.map((word) => (
              <Word
                key={word.id}
                wordData={word}
                page='journal'
              />
            ))
          ) : (
            <>
              <p>No words in journal</p>
              <NavLink to='../search'>Search for some new words!</NavLink>
            </>
          )}
        </div>
      </div>
      {showForm && <WordForm page='journal' />}
    </>
  )
}

export default Journal
