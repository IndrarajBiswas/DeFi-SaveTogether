interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '1rem',
      }}
    >
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
      <p style={{ margin: 0, fontWeight: 600, color: 'var(--gray-700)' }}>{message}</p>
    </div>
  )
}
