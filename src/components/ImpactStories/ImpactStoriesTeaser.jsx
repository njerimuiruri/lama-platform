import Link from "next/link";
import { ArrowRight, Clock, MapPin, Play } from "lucide-react";
import {
    featuredImpact,
    communityVideos,
    getThumbnailUrl,
} from "./impactStoriesData";

/* Compact home-page preview of the full /impact-stories page */
export default function ImpactStoriesTeaser() {
    const featuredThumb = getThumbnailUrl(featuredImpact.videoUrl);

    return (
        <section className="py-12 sm:py-14 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
                            Impact Stories
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Voices from the communities
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Short films on how communities are leading their own climate adaptation.
                        </p>
                    </div>
                    <Link
                        href="/impact-stories"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 self-start sm:self-auto"
                    >
                        View all stories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Featured story */}
                    <Link
                        href="/impact-stories"
                        className="group lg:col-span-3 relative block overflow-hidden rounded-2xl bg-gray-900 aspect-video"
                    >
                        {featuredThumb && (
                            <img
                                src={featuredThumb}
                                alt={featuredImpact.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-500"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                                {featuredImpact.category}
                            </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 ml-0.5" fill="currentColor" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-white font-bold text-lg sm:text-xl leading-snug line-clamp-2">
                                    {featuredImpact.title}
                                </h3>
                                <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />{featuredImpact.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />{featuredImpact.duration}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* More stories */}
                    <div className="lg:col-span-2 flex flex-col divide-y divide-gray-100 rounded-2xl border border-gray-100">
                        {communityVideos.map((video) => {
                            const thumb = getThumbnailUrl(video.videoUrl);
                            return (
                                <Link
                                    key={video.id}
                                    href="/impact-stories"
                                    className="group flex items-center gap-4 p-4 flex-1 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                                >
                                    <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {thumb && (
                                            <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                            <Play className="w-5 h-5 text-white" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-green-600 mb-1">{video.category}</p>
                                        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{video.duration}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
