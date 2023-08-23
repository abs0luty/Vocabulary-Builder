import { Outlet } from 'react-router-dom'

const Flashcards = () => {
  return (
    <div className='flex flex-col gap-7'>
      <h1 className='text-3xl font-bold text-center'>Flashcards</h1>
      <Outlet />
    </div>
  )
}

export default Flashcards
