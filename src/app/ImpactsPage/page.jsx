"use client"
import { useState } from "react"
import { Play, Eye, Clock, MapPin, ChevronDown, X, CloudRain, Droplets, Sprout, Leaf } from "lucide-react"

/* ─────────────────────────────────────────────
   Helper: extract YouTube video ID from any
   youtu.be or youtube.com URL
───────────────────────────────────────────── */
const getYouTubeId = (url) => {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
    )
    return match ? match[1] : null
}

const getEmbedUrl = (url) => {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url
}

const getThumbnailUrl = (url) => {
    const id = getYouTubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

/* ─────────────────────────────────────────────
   VIDEO MODAL — YouTube iframe
───────────────────────────────────────────── */
const VideoModal = ({ video, onClose }) => (
    <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative bg-black rounded-t-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow"
                >
                    <X className="w-5 h-5 text-black" />
                </button>
                <iframe
                    src={getEmbedUrl(video.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                />
            </div>

            <div className="p-6">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {video.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{video.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm border-t pt-4">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-600" />{video.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />{video.duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />{video.views} views
                    </div>
                </div>
            </div>
        </div>
    </div>
)

/* ─────────────────────────────────────────────
   VIDEO CARD — YouTube thumbnail + click to open
───────────────────────────────────────────── */
const VideoCard = ({ video, onClick }) => {
    const Icon = video.icon
    const thumbnail = getThumbnailUrl(video.videoUrl)

    return (
        <div
            className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            onClick={onClick}
        >
            {/* Thumbnail */}
            <div className="relative h-52 bg-gray-900 overflow-hidden">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="w-10 h-10 text-gray-500" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {video.category}
                    </span>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-green-600 ml-0.5" fill="currentColor" />
                    </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />{video.duration}
                </div>
            </div>

            {/* Card body */}
            <div className="p-5">
                {Icon && (
                    <div className="inline-flex p-2 bg-green-50 rounded-lg mb-3">
                        <Icon className="w-4 h-4 text-green-600" />
                    </div>
                )}
                <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-green-600 transition-colors">
                    {video.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3">
                    {video.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 border-t pt-3">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-green-500" />{video.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />{video.views} views
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   FEATURED VIDEO — YouTube thumbnail + iframe modal
───────────────────────────────────────────── */
const FeaturedVideoPreview = ({ video, onPlay }) => {
    const thumbnail = getThumbnailUrl(video.videoUrl)

    return (
        <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-900 h-80">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={onPlay}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
                    >
                        <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white text-sm">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{video.duration}</span>
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{video.views} views</span>
                </div>
            </div>
            <div className="absolute -top-4 left-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                    {video.category}
                </span>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ImpactsPage = () => {
    const [showMoreVideos, setShowMoreVideos] = useState(false)
    const [playingVideo, setPlayingVideo] = useState(null)

    /* ── Featured video ── */
    const featuredImpact = {
        title: "Chief's Call to Action: Building Climate Resilience in Nyakach",
        description:
            "A community chief in Nyakach takes a bold stand — rallying local leaders, households, and youth to unite around climate resilience. From mobilising resources to championing locally led adaptation, this is a powerful call to action that puts community leadership at the heart of climate response.",
        location: "Nyakach, Kisumu County",
        duration: "3:42",
        views: "1.2K",
        category: "Community Leadership",
        videoUrl: "https://youtu.be/GKLoHlussZ8",
        highlights: [
            "Chief leads community mobilisation",
            "Locally driven climate action plans",
            "Youth and elders united",
            "Resilience built from the ground up",
        ],
    }

    /* ── Community videos ── */
    const communityVideos = [
        {
            id: 1,
            title: "Solar-Powered Water Pumping: A Game-Changer for Rural Homes",
            description:
                "Discover how solar-powered water pumping is transforming daily life in rural communities. Families no longer walk miles for water — clean, reliable supply is now at their doorstep, powered by the sun and driven by community ingenuity.",
            location: "Nyakach, Kisumu County",
            duration: "4:10",
            views: "980",
            category: "Clean Energy",
            icon: CloudRain,
            videoUrl: "https://youtu.be/Y7cFeFWqRN4",
        },
        {
            id: 2,
            title: "Fast-Growing Azolla: The Farming Hack Producing Bulk Feed in Days",
            description:
                "Meet Azolla — the fast-growing aquatic fern that is revolutionising livestock feeding across rural Kenya. Farmers are producing bulk, protein-rich animal feed within days, cutting costs and boosting productivity in a simple, climate-smart solution.",
            location: "Kisumu County",
            duration: "3:55",
            views: "1.1K",
            category: "Adaptive Agriculture",
            icon: Sprout,
            videoUrl: "https://youtu.be/w71w7FBV5C4",
        },
        {
            id: 3,
            title: "Planting 100 Trees a Month: Community Chief Leads Climate Action Initiative",
            description:
                "One chief, one mission — 100 trees planted every month. This inspiring story follows a community chief who has made tree planting a cornerstone of local climate action, mobilising households and schools to restore landscapes and fight back against deforestation.",
            location: "Nyakach, Kisumu County",
            duration: "5:20",
            views: "1.4K",
            category: "Local Champions",
            icon: Leaf,
            videoUrl: "https://youtu.be/l_IOUtxsGtU",
        },
    ]

    /* ── Additional videos shown after "Show More" — add more YouTube URLs here ── */
    const additionalVideos = []

    const displayedVideos = showMoreVideos
        ? [...communityVideos, ...additionalVideos]
        : communityVideos

    return (
        <div className="min-h-screen bg-white">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10">

                {/* ── Hero banner ── */}
                <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-8">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-green-700 text-sm font-medium">Impact Stories</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                Real{" "}
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Impact Stories
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
                                Witness the transformative power of locally led adaptation across Africa — through the authentic voices
                                of communities shaping their own climate future.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Featured video ── */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Preview */}
                                <FeaturedVideoPreview
                                    video={featuredImpact}
                                    onPlay={() => setPlayingVideo(featuredImpact)}
                                />

                                {/* Info */}
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm">
                                        <MapPin className="w-4 h-4 text-green-600" />{featuredImpact.location}
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{featuredImpact.title}</h2>
                                    <p className="text-lg text-gray-700 leading-relaxed mb-8">{featuredImpact.description}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {featuredImpact.highlights.map((h, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Community Videos Grid ── */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-12">
                                <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-green-700 text-sm font-medium">Community Voices</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">More Impact Stories</h2>
                                <p className="text-lg text-gray-600 max-w-2xl">
                                    Real voices from Nandi, Sangorota, and communities across Africa — defining and driving their own
                                    climate resilience.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                {displayedVideos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        onClick={() => setPlayingVideo(video)}
                                    />
                                ))}
                            </div>

                            {/* Show more / less — only shown when additionalVideos has entries */}
                            {additionalVideos.length > 0 && (
                                <div className="flex justify-center">
                                    {!showMoreVideos ? (
                                        <button
                                            onClick={() => setShowMoreVideos(true)}
                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            Show More Videos <ChevronDown className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowMoreVideos(false)}
                                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                                        >
                                            Show Less <ChevronDown className="w-5 h-5 rotate-180" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal */}
            {playingVideo && (
                <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
            )}
        </div>
    )
}

export default ImpactsPage