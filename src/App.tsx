import './App.css'

import { PokemonList } from '@/features/inifiniteLoading/components/PokemonList'

/**
 * @description ルート component.
 */
const App = (): JSX.Element => {
  return (
    <div className="App">
      <h1>An infinite-scrolling list of Pokemons </h1>
      <PokemonList />
    </div>
  )
}

// eslint-disable-next-line import/no-default-export
export default App
