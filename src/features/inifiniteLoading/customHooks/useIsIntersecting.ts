import { useEffect, useState } from 'react'

/**
 * @description 要素に監視対象のDOMを取る。
 * 監視対象のDOMが画面に表示されると、true を返す。
 */
export const useIsIntersecting = <RefElement extends HTMLElement>(
  ref: React.MutableRefObject<RefElement | null>
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (ref.current == null) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: '0px 0px 100px 0px'
      }
    )

    let observerRefCurrent: RefElement | null = null

    // 監視を開始
    observer.observe(ref.current)
    observerRefCurrent = ref.current

    return () => {
      // 要素の監視を終了する
      observer.unobserve(observerRefCurrent as RefElement)
    }
  })

  return isIntersecting
}
