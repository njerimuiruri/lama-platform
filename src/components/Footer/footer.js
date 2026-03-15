"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Target,
  Database,
  Calendar,
  Camera,
  Home,
  Info,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
} from "lucide-react";

const LamaFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Gallery", href: "/gallery" },
  ];

  const resources = [
    {
      name: "Interventions Database",
      href: "/resources/interventions-database",
    },
    { name: "Tools & Frameworks", href: "/resources/tools-frameworks" },
    { name: "Advisory Outputs", href: "/resources/advisory-outputs" },
    { name: "Impact Stories", href: "/dashboard/impact-stories" },
  ];

  const community = [
    { name: "Stakeholder Directory", href: "/stakeholders/directory" },
    { name: "LAMA Diaries & Blogs", href: "/stakeholders/diaries-blogs" },
    { name: "Collaboration Space", href: "/stakeholders/collaboration" },
    { name: "Webinars", href: "/activities/webinars" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image
                  src="/images/LAMA-logo.png"
                  alt="LAMA Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900">LAMA</span>
                <span className="text-xs text-gray-500">Platform</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Empowering communities through data-driven insights and
              collaborative solutions. Join us in building a sustainable future
              together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-green-700 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    href={resource.href}
                    className="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200 flex items-center group"
                  >
                    <span>{resource.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-2 mb-6">
              {community.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200 flex items-center group"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Contact</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>info@lama-platform.org</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+254746130873</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Bishop Road, 1St Ngong Ave, Upperhill, Nairobi. P.O Box 53358
                  <br />
                  P.O Box 53358 - 00200.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} LAMA Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-green-700 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-600 hover:text-green-700 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-600 hover:text-green-700 transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup (Optional) */}
      <div className="bg-[#e7f2e6] border-t border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-green-900 mb-1">
                Stay Updated
              </h4>
              <p className="text-sm text-green-700">
                Get the latest updates on LAMA initiatives and resources.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 text-sm border border-green-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-r-md hover:bg-green-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LamaFooter;
