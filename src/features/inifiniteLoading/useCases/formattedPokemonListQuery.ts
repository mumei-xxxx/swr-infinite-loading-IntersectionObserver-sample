import { type QueryResult } from '@/features/inifiniteLoading/customHooks/usePokemonListSWRInfinite'

/**
 * @typedef response 整形後の型
 */
export interface Pokemon {
  id: number
  en: string
  ja: string
}

/**
 * @description response を整形
 */
export function convertRawResultToPokemon(response: QueryResult): Pokemon[] {
  return response.species.map((species) => {
    const en =
      species.pokemon_v2_pokemonspeciesnames.find((n) => n.language_id === 9)
        ?.name ?? ''
    const ja =
      species.pokemon_v2_pokemonspeciesnames.find((n) => n.language_id === 11)
        ?.name ?? ''
    return {
      id: species.id,
      en,
      ja
    }
  })
}
