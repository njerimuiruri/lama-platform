"use client"
import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const Lightbox = ({ isOpen, onClose, items, currentIndex, onNavigate, type = "image" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        onNavigate("prev")
      } else if (e.key === "ArrowRight") {
        onNavigate("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !items[currentIndex]) return null

  const currentItem = items[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white border-none"
        size="icon"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <Button
          onClick={() => onNavigate("prev")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white border-none"
          size="icon"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {currentIndex < items.length - 1 && (
        <Button
          onClick={() => onNavigate("next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white border-none"
          size="icon"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="max-w-7xl max-h-[85vh] w-full flex items-center justify-center">
          {type === "image" ? (
            <img
              src={currentItem.url || "/placeholder.svg"}
              alt={currentItem.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
          ) : (
            <div className="w-full max-w-5xl aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${currentItem.youtubeId}?autoplay=1`}
                title={currentItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="mt-6 text-center max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-2">{currentItem.title}</h2>
          <p className="text-gray-300 mb-2">{currentItem.description}</p>
          <p className="text-gray-400 text-sm">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  )
}

export default Lightbox
