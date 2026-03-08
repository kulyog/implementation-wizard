// /src/components/layout/Tooltip.jsx
// Hover tooltip wrapper component. Uses CSS group-hover, no third-party library.

/**
 * @param {{
 *   children: React.ReactNode,
 *   text: string,
 *   position?: 'top' | 'bottom',
 * }} props
 */
export default function Tooltip({ children, text, position = 'top' }) {
  if (!text) return children

  const isTop = position !== 'bottom'

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`
          absolute z-50 hidden group-hover:block
          px-2 py-1 rounded
          bg-gray-800 text-white text-xs
          min-w-40 max-w-60 whitespace-normal leading-snug
          pointer-events-none
          ${isTop
            ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
            : 'top-full left-1/2 -translate-x-1/2 mt-1.5'
          }
        `}
      >
        {text}
        {/* Arrow */}
        <span
          className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${isTop
              ? 'top-full border-t-gray-800'
              : 'bottom-full border-b-gray-800'
            }
          `}
        />
      </div>
    </div>
  )
}
