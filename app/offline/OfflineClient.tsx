"use client";

export default function OfflineClient() {
  return (
    <div className="min-h-screen bg-[#050505]
      flex items-center justify-center text-center px-6">
      <div>
        <div className="text-6xl mb-6">📡</div>
        <h1 className="font-['Anton'] text-4xl text-white 
          uppercase mb-4">
          YOU'RE OFFLINE
        </h1>
        <p className="text-gray-500 mb-8">
          Check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 rounded-full font-black
            text-black text-sm uppercase cursor-pointer"
          style={{
            background:'linear-gradient(135deg,#ff7a00,#ffb300)'
          }}>
          Try Again
        </button>
      </div>
    </div>
  )
}
