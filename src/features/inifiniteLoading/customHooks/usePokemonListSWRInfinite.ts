import { request } from 'graphql-request'
import useSWRInfinite from 'swr/infinite'

import {
  convertRawResultToPokemon,
  type Pokemon
} from '@/features/inifiniteLoading/useCases/formattedPokemonListQuery'

/**
 * @typedef API のレスポンス
 */
export interface QueryResult {
  species: ReadonlyArray<{
    readonly name: string
    readonly id: number
    readonly pokemon_v2_pokemonspeciesnames: ReadonlyArray<{
      language_id: 9 | 11
      name: string
    }>
  }>
}

/**
 * @description GraphQL のクエリ
 */
const query = `
  query ($offset: Int!, $limit: Int!) {
    species: pokemon_v2_pokemonspecies(
      where: {}
      order_by: { id: asc }
      offset: $offset
      limit: $limit
    ) {
      name
      id
      pokemon_v2_pokemonspeciesnames(where: { language_id: { _in: [9, 11] } }) {
        language_id
        name
      }
    }
  }
`

/**
 * @typedef GraphQL のクエリの変数の型
 */
interface PokemonGraphqlVariables {
  offset: number
  limit: number
}

/**
 * @typedef getKey の返り値の型
 */
type ApiKeyType = [string, PokemonGraphqlVariables]

/**
 * @description 1ページあたりに取得するポケモンデータの件数
 */
const MAX_NUMBER_OF_ENTRY_BY_QUERY = 50

/**
 * @description useSWRInfinite の引数の getKey
 */
const getKey = (
  pageIndex: number,
  previousPageData: Pokemon[] | null
): ApiKeyType | null => {
  if (previousPageData !== null && previousPageData.length === 0) {
    return null
  }

  const pageStartPoint = pageIndex * MAX_NUMBER_OF_ENTRY_BY_QUERY

  return [
    query,
    {
      offset: pageStartPoint,
      limit: MAX_NUMBER_OF_ENTRY_BY_QUERY
    }
  ]
}

/**
 * @description useSWRInfinite の引数の fetcher
 */
const fetcher = async (
  query: string,
  { offset: offsetVal, limit: limitVal }: PokemonGraphqlVariables
): Promise<Pokemon[]> => {
  const response = await request<QueryResult>(
    'https://beta.pokeapi.co/graphql/v1beta',
    query,
    {
      offset: offsetVal,
      limit: limitVal
    }
  )

  return convertRawResultToPokemon(response)
}

/**
 * @typedef usePokemonListSWRInfinite の戻り値の型
 */
interface UsePokemonListSWRInfiniteReturnType {
  pokemonsDataArr: Array<readonly Pokemon[]>
  error: Error | undefined
  isLoading: boolean
  loadMorePage: () => void
  isReachingEnd: boolean
}

/**
 * @description
 * useSWRInfinite でポケモンデータを取得する
 * ページサイズをインクリメントする関数を返す
 * など。
 */
export const usePokemonListSWRInfinite =
  (): UsePokemonListSWRInfiniteReturnType => {
    const { data, error, isLoading, size, setSize } = useSWRInfinite<
      Pokemon[],
      Error
    >(
      getKey,
      async ([query, pokemonGraphqlVariables]: ApiKeyType) =>
        await fetcher(query, pokemonGraphqlVariables),
      { revalidateFirstPage: false }
    )

    // すべてのデータを取得したら、true
    const isReachingEnd: boolean =
      data !== undefined &&
      data[data.length - 1]?.length < MAX_NUMBER_OF_ENTRY_BY_QUERY

    const emptyData: Array<readonly Pokemon[]> = []

    const pokemonsDataArr: Array<readonly Pokemon[]> =
      typeof data === 'undefined' ? emptyData : data

    // ページを増やす => 最新のページを読み込むtrigger
    const loadMorePage = (): void => {
      void setSize(size + 1)
    }

    return {
      pokemonsDataArr,
      error,
      isLoading,
      loadMorePage,
      isReachingEnd
    }
  }
