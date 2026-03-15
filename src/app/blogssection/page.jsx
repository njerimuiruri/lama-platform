"use client"

import { useState } from "react"

const images = [
    {
        id: 1,
        title: "Mountain Landscape",
        thumbnail: "/images/lreb.jpg",
        full: "/images/lreb.jpg",
        category: "Landscapes",
    },
    {
        id: 2,
        title: "Forest Path",
        thumbnail: "/images/lreb4.jpg",
        full: "/images/lreb4.jpg",
        category: "Nature",
    },
    {
        id: 3,
        title: "Ocean Sunrise",
        thumbnail: "/images/lreb3.jpg",
        full: "/images/lreb3.jpg",
        category: "Seascapes",
    },
    {
        id: 4,
        title: "Ocean Sunrise",
        thumbnail: "/images/lreb1.jpg",
        full: "/images/lreb1.jpg",
        category: "Seascapes",
    },
    {
        id: 5,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd1.jpg",
        full: "/images/fgd1.jpg",
        category: "Seascapes",
    },
    {
        id: 6,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd2.jpg",
        full: "/images/fgd2.jpg",
        category: "Seascapes",
    },
    {
        id: 7,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd3.jpg",
        full: "/images/fgd3.jpg",
        category: "Seascapes",
    },
    {
        id: 8,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd4.jpg",
        full: "/images/fgd4.jpg",
        category: "Seascapes",
    },
    {
        id: 9,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd5.jpg",
        full: "/images/fgd5.jpg",
        category: "Seascapes",
    },
    {
        id: 10,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd6.jpg",
        full: "/images/fgd6.jpg",
        category: "Seascapes",
    },
    {
        id: 11,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd7.jpg",
        full: "/images/fgd7.jpg",
        category: "Seascapes",
    },
    {
        id: 12,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd8.jpg",
        full: "/images/fgd8.jpg",
        category: "Seascapes",
    },
    {
        id: 13,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd9.jpg",
        full: "/images/fgd9.jpg",
        category: "Seascapes",
    },
    {
        id: 14,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd10.jpg",
        full: "/images/fgd10.jpg",
        category: "Seascapes",
    },
    {
        id: 15,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd11.jpg",
        full: "/images/fgd11.jpg",
        category: "Seascapes",
    },
    {
        id: 16,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd12.jpg",
        full: "/images/fgd12.jpg",
        category: "Seascapes",
    },
    {
        id: 17,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd13.jpg",
        full: "/images/fgd13.jpg",
        category: "Seascapes",
    },
    {
        id: 18,
        title: "Ocean Sunrise",
        thumbnail: "/images/fgd13.jpg",
        full: "/images/fgd13.jpg",
        category: "Seascapes",
    },

]

export default function Home() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const imagesPerPage = 6

    // Calculate pagination
    const totalPages = Math.ceil(images.length / imagesPerPage)
    const startIndex = (currentPage - 1) * imagesPerPage
    const endIndex = startIndex + imagesPerPage
    const currentImages = images.slice(startIndex, endIndex)

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <main style={{ backgroundColor: "#eefdf5", minHeight: "100vh", padding: "40px 20px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#0d9c5a", marginBottom: "10px" }}>Image Gallery</h1>
                <p style={{ fontSize: "18px", color: "#333", marginBottom: "30px" }}>
                    Explore our beautiful collection of images
                </p>
            </div>

            {/* Featured Images Grid */}
            <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "30px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
                    {currentImages.map((image) => (
                        <div
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            style={{
                                cursor: "pointer",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)"
                                e.currentTarget.style.boxShadow = "0 8px 15px rgba(13, 156, 90, 0.2)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)"
                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <img
                                src={image.thumbnail || "/placeholder.svg"}
                                alt={image.title}
                                style={{ width: "100%", height: "250px", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Controls */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "15px" }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{
                            backgroundColor: currentPage === 1 ? "#ccc" : "#0d9c5a",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        Previous
                    </button>

                    <span style={{ fontSize: "16px", color: "#333", fontWeight: "600" }}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{
                            backgroundColor: currentPage === totalPages ? "#ccc" : "#0d9c5a",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* See More Button */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <a href="/gallery">
                    <button
                        style={{
                            backgroundColor: "#0d9c5a",
                            color: "#fff",
                            border: "none",
                            padding: "14px 40px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 12px rgba(13, 156, 90, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#0a7a47"
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(13, 156, 90, 0.4)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#0d9c5a"
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 156, 90, 0.3)"
                        }}
                    >
                        See More
                    </button>
                </a>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "20px",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            maxWidth: "700px",
                            width: "100%",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                            maxHeight: "90vh",
                            overflow: "auto",
                        }}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            style={{
                                float: "right",
                                backgroundColor: "#eefdf5",
                                color: "#0d9c5a",
                                border: "none",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                fontSize: "20px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImage.full || "/placeholder.svg"}
                            alt={selectedImage.title}
                            style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
                        />
                    </div>
                </div>
            )}
        </main>
    )
}