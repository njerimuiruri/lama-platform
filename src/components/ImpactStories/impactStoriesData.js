import { CloudRain, Sprout, Leaf } from "lucide-react"

/* ─────────────────────────────────────────────
   Helpers: YouTube ID / thumbnail from any
   youtu.be or youtube.com URL
───────────────────────────────────────────── */
export const getYouTubeId = (url) => {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
    )
    return match ? match[1] : null
}

export const getThumbnailUrl = (url) => {
    const id = getYouTubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

/* ── Featured video ── */
export const featuredImpact = {
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
export const communityVideos = [
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
export const additionalVideos = []
