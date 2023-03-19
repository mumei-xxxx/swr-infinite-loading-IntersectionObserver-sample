import { type FC, Fragment } from 'react'

import { Loading } from '@/features/inifiniteLoading/components/Loading'
import { usePokemonListSWRInfinite } from '@/features/inifiniteLoading/customHooks/usePokemonListSWRInfinite'

/**
 * @description ポケモンのデータを表示する。
 */
export const PokemonList: FC = () => {
  const { pokemonsDataArr, isLoading, error, isReachingEnd } =
    usePokemonListSWRInfinite()

  if (error != null) {
    return <>Error: {error}</>
  }

  if (isLoading || pokemonsDataArr.length === 0) {
    return <>loading……（ロード中）</>
  }

  return (
    <Fragment>
      <dl>
        {pokemonsDataArr.map((pokemons) => {
          return pokemons.map((pokemon) => (
            <div key={pokemon.id}>
              <dt lang="ja">{pokemon.ja}</dt>
              <dd>
                {pokemon.en} <span>#{pokemon.id}</span>
              </dd>
            </div>
          ))
        })}
      </dl>
      {!isReachingEnd && <Loading />}
      {isReachingEnd && (
        <p style={{ margin: '10px 0 10px' }}>
          All data loading is complete.
          （すべてのデータの読み込みが完了しました。）
        </p>
      )}
    </Fragment>
  )
}
