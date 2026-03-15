"use client";
import { useState } from "react";
import { ImageIcon, Video } from "lucide-react";
import LamaNavbar from "@/components/Navbar/navbar";
import LamaFooter from "@/components/Footer/footer";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { pictures, videos } from "../../../data/gallery/gallery-data";
import Lightbox from "@/components/Gallery/lightbox";

const GalleryPage = () => {
  const [activeSection, setActiveSection] = useState("pictures");
  const [currentPicturePage, setCurrentPicturePage] = useState(1);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState("image");

  const itemsPerPage = 12;

  const totalPicturePages = Math.ceil(pictures.length / itemsPerPage);
  const totalVideoPages = Math.ceil(videos.length / itemsPerPage);

  const getCurrentPictures = () => {
    const startIndex = (currentPicturePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pictures.slice(startIndex, endIndex);
  };

  const getCurrentVideos = () => {
    const startIndex = (currentVideoPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return videos.slice(startIndex, endIndex);
  };

  const handlePicturePageChange = (page) => {
    setCurrentPicturePage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleVideoPageChange = (page) => {
    setCurrentVideoPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const renderPaginationItems = (currentPage, totalPages, onPageChange) => {
    const items = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const openLightbox = (index, type) => {
    setLightboxIndex(index);
    setLightboxType(type);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const items = lightboxType === "image" ? pictures : videos;
    if (direction === "prev" && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (direction === "next" && lightboxIndex < items.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <>
      <LamaNavbar />
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10">
          <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 text-sm font-medium">
                    Media Gallery
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                  Our{" "}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Gallery
                  </span>{" "}
                  Collection
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore our comprehensive collection of photos and videos
                  showcasing our work and achievements
                </p>
              </div>
            </div>
          </section>

          <section className="py-8 bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setActiveSection("pictures")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeSection === "pictures"
                      ? "bg-green-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200"
                      }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Pictures ({pictures.length})</span>
                  </Button>
                  <Button
                    onClick={() => setActiveSection("videos")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeSection === "videos"
                      ? "bg-green-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200"
                      }`}
                  >
                    <Video className="w-5 h-5" />
                    <span>Videos ({videos.length})</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {activeSection === "pictures" && (
            <section className="py-12">
              <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCurrentPictures().map((picture) => {
                      const actualIndex = pictures.findIndex(
                        (p) => p.id === picture.id
                      );
                      return (
                        <div
                          key={picture.id}
                          onClick={() => openLightbox(actualIndex, "image")}
                          className="group relative overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={picture.url || "/placeholder.svg"}
                              alt={picture.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              {/* <h3 className="font-semibold text-lg mb-1">
                                {picture.title}
                              </h3> */}
                              {/* <p className="text-sm text-gray-200">
                                {picture.description}
                              </p> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPicturePages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                handlePicturePageChange(
                                  Math.max(1, currentPicturePage - 1)
                                )
                              }
                              className={
                                currentPicturePage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {renderPaginationItems(
                            currentPicturePage,
                            totalPicturePages,
                            handlePicturePageChange
                          )}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                handlePicturePageChange(
                                  Math.min(
                                    totalPicturePages,
                                    currentPicturePage + 1
                                  )
                                )
                              }
                              className={
                                currentPicturePage === totalPicturePages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === "videos" && (
            <section className="py-12">
              <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCurrentVideos().map((video) => {
                      const actualIndex = videos.findIndex(
                        (v) => v.id === video.id
                      );
                      return (
                        <div
                          key={video.id}
                          onClick={() => openLightbox(actualIndex, "video")}
                          className="group relative overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-green-600 border-b-8 border-b-transparent ml-1"></div>
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="font-semibold text-lg mb-1">
                                {video.title}
                              </h3>
                              <p className="text-sm text-gray-200">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalVideoPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                handleVideoPageChange(
                                  Math.max(1, currentVideoPage - 1)
                                )
                              }
                              className={
                                currentVideoPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {renderPaginationItems(
                            currentVideoPage,
                            totalVideoPages,
                            handleVideoPageChange
                          )}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                handleVideoPageChange(
                                  Math.min(
                                    totalVideoPages,
                                    currentVideoPage + 1
                                  )
                                )
                              }
                              className={
                                currentVideoPage === totalVideoPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <LamaFooter />

      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        items={lightboxType === "image" ? pictures : videos}
        currentIndex={lightboxIndex}
        onNavigate={navigateLightbox}
        type={lightboxType}
      />
    </>
  );
};

export default GalleryPage;
