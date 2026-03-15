"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin } from "lucide-react"

// Fix for default markers in react-leaflet - updated approach
const DefaultIcon = L.Icon.Default
if (DefaultIcon.prototype._getIconUrl) {
  delete DefaultIcon.prototype._getIconUrl
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export default function ClimateMap({ projects }) {
  // Filter projects that have valid coordinates
  const validProjects = projects.filter(
    (project) =>
      project.Longitude &&
      project.Latitude &&
      project.Longitude.trim() !== "" &&
      project.Latitude.trim() !== "" &&
      !isNaN(Number.parseFloat(project.Longitude)) &&
      !isNaN(Number.parseFloat(project.Latitude)) &&
      Number.parseFloat(project.Latitude) !== 0 &&
      Number.parseFloat(project.Longitude) !== 0,
  )

  // Calculate center based on valid projects or use default
  const defaultCenter = [5.433168, 34.560376] // South Sudan

  const center =
    validProjects.length > 0
      ? [
        validProjects.reduce((sum, p) => sum + Number.parseFloat(p.Latitude), 0) / validProjects.length,
        validProjects.reduce((sum, p) => sum + Number.parseFloat(p.Longitude), 0) / validProjects.length,
      ]
      : defaultCenter

  const zoom = validProjects.length > 0 ? 6 : 3

  if (validProjects.length === 0) {
    return (
      <div className="h-[500px] w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-4">
        <MapPin className="h-12 w-12 text-gray-300" />
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">No project locations available</p>
          <p className="text-gray-400 text-sm mt-1">The filtered projects don&apos;t have valid coordinate data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProjects.map((project, index) => (
          <Marker key={index} position={[Number.parseFloat(project.Latitude), Number.parseFloat(project.Longitude)]}>
            <Popup className="custom-popup">
              <div className="min-w-[250px] p-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                  {project["Adaptation Interventions"]}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Thematic Area:</span>
                    <span className="text-gray-900">{project["Thematic Area(s)"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Country:</span>
                    <span className="text-gray-900">{project.Country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Region:</span>
                    <span className="text-gray-900">{project.Region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Funder:</span>
                    <span className="text-gray-900">{project.Funders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${project["Implementation Status"] === "Under Implementation"
                        ? "text-green-600"
                        : "text-yellow-600"
                        }`}
                    >
                      {project["Implementation Status"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Period:</span>
                    <span className="text-gray-900">{project.Period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">${project["Project Amount ($ Million)"]}M</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
