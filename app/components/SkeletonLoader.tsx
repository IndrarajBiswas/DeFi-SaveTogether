interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'stat' | 'button'
  count?: number
}

export default function SkeletonLoader({ type = 'text', count = 1 }: SkeletonLoaderProps) {
  const getClassName = () => {
    switch (type) {
      case 'title':
        return 'skeleton skeleton-title'
      case 'card':
        return 'skeleton skeleton-card'
      case 'stat':
        return 'skeleton skeleton-stat'
      case 'button':
        return 'skeleton skeleton-button'
      default:
        return 'skeleton skeleton-text'
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={getClassName()} />
      ))}
    </>
  )
}
