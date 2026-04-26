'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight, BarChart3, Users, Target, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const VideoCarousel = ({ videos, currentSlide, onSlideChange, isPlaying, onPlayPause }) => {
    const videoRefs = useRef([]);

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === currentSlide && isPlaying) {
                    video.currentTime = 0;
                    video.play().catch(console.log);
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }, [currentSlide, isPlaying]);

    useEffect(() => {
        const currentVideo = videoRefs.current[currentSlide];
        if (currentVideo) {
            if (isPlaying) {
                currentVideo.play().catch(console.log);
            } else {
                currentVideo.pause();
            }
        }
    }, [isPlaying]);

    const handleVideoEnded = () => {
        // Advance to the next slide when current video ends
        onSlideChange((currentSlide + 1) % videos.length);
    };

    return (
        <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-xl">
            <div
                className="flex transition-transform duration-1000 ease-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {videos.map((video, index) => (
                    <div key={index} className="min-w-full h-full relative bg-gray-900">
                        <video
                            ref={el => videoRefs.current[index] = el}
                            className="w-full h-full object-cover"
                            // Removed `loop` so the video ends naturally and triggers onEnded
                            muted
                            playsInline
                            preload="metadata"
                            onEnded={index === currentSlide ? handleVideoEnded : undefined}
                        >
                            <source src={`/videos/${video.src}`} type="video/mp4" />
                        </video>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
                            {/* <p className="text-base text-gray-200 opacity-90">{video.subtitle}</p> */}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onSlideChange((currentSlide - 1 + videos.length) % videos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200"
            >
                <ChevronLeft size={20} />
            </button>

            <button
                onClick={() => onSlideChange((currentSlide + 1) % videos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200"
            >
                <ChevronRight size={20} />
            </button>

            <button
                onClick={onPlayPause}
                className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200"
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div className="absolute bottom-4 left-4 flex gap-2">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onSlideChange(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

const LAMAHeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const videos = [
        {
            src: "clip1.mp4",
            title: "Locally Led Action",
            subtitle: "Communities leading their own climate adaptation strategies"
        },
        {
            src: "clip2.mp4",
            title: "Video shows solar panels and water harvesting tanks",
            subtitle: "Inclusive dialogue for equitable climate solutions"
        },
        {
            src: "clip3.mp4",
            title: "A video showing azolla farm ",
            subtitle: "Bottom-up indicators that capture local resilience"
        },
        // {
        //     src: "video10.mp4",
        //     title: "People primarily use iron sheets for housing due to a combination of affordability, durability, and weather resistance, making them a practical and accessible material, especially in developing regions impacted by climate change. ",
        //     subtitle: "Bridging community needs with national adaptation plans"
        // }
    ];


    return (
        <section className="min-h-screen bg-white relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

                    <div className="space-y-8">

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-700 text-sm font-medium">IDRC-Funded Programme</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.15]">
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Locally Led Adaptation
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Metrics for Africa Platform
                                </span>
                                <span className="text-gray-800"> (LAMA)</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-lg">
                                <em>Aims to co-develop indicators that capture the effectiveness and inclusiveness of adaptation strategies at the community level.</em>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/about" className="group">
                                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3">
                                    Learn More
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                            </Link>

                            <Link href="/dashboard/sitedashboard" className="group">
                                <button className="bg-white border-2 border-green-500 hover:bg-green-50 text-green-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                                    <BarChart3 className="w-5 h-5" />
                                    View Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="h-[500px] lg:h-[600px]">
                        <VideoCarousel
                            videos={videos}
                            currentSlide={currentSlide}
                            onSlideChange={setCurrentSlide}
                            isPlaying={isPlaying}
                            onPlayPause={() => setIsPlaying(!isPlaying)}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-gray-100">
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 bg-green-100 rounded-xl">
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Community-Driven</h3>
                        <p className="text-gray-600">Amplifying voices of vulnerable communities across Africa</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 bg-green-100 rounded-xl">
                            <Target className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Inclusive Metrics</h3>
                        <p className="text-gray-600">Bottom-up indicators that capture local resilience needs</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 bg-green-100 rounded-xl">
                            <Globe className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Global Impact</h3>
                        <p className="text-gray-600">Linking local adaptation to national and international frameworks</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LAMAHeroSection;