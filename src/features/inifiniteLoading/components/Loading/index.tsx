import { type FC, useEffect, useRef } from 'react'

import { useIsIntersecting } from '@/features/inifiniteLoading/customHooks/useIsIntersecting'
import { usePokemonListSWRInfinite } from '@/features/inifiniteLoading/customHooks/usePokemonListSWRInfinite'

/**
 * @description
 * Loading component.
 * viewport と交差したとき、ポケモンAPIを実行するtriggerとなる。
 */
export const Loading: FC = () => {
  const observedRef = useRef<HTMLParagraphElement | null>(null)
  const { loadMorePage, isReachingEnd } = usePokemonListSWRInfinite()

  // トリガーが表示されているか監視
  const isIntersection: boolean =
    useIsIntersecting<HTMLParagraphElement>(observedRef)

  useEffect(() => {
    // トリガーが表示されたらデータを取得
    if (isIntersection && !isReachingEnd) {
      loadMorePage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersection, isReachingEnd])

  return <p ref={observedRef}>Loading...</p>
}
