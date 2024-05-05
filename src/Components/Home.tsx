import { useMemo } from 'react'
import usePlaylistInput from '../Hooks/usePlaylistInput'

function Home() {
  const detail = useMemo(() => {
    return window.location.pathname.split('/')[1]
  }, [window.location])

  const [search, setSearch] = usePlaylistInput(detail)

  return (
    <div className='flex flex-col w-full items-center mt-16'>
      <span>ToolsForPlaylists</span>
      <input className='w-1/3' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
  )
}

export default Home
