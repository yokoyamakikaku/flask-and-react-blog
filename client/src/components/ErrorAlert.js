export default function ErrorAlert ({ error }) {
  if(!error) return null
  return (
    <div className="bg-red-200 p-2 border-red-100 text-red-500 rounded">
      {error.error || error.toString()}
    </div>
  )
}
