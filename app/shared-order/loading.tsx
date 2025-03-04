export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Загрузка...</p>
        </div>
      </div>
    )
  }