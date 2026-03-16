import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import logo from "../../assets/img/flogo.png"

const footerData = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Reservations", href: "/reservations" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie" },
  ],
  socials: [
    { icon: <FaFacebookF size={16} />, href: "https://facebook.com" },
    { icon: <FaInstagram size={16} />, href: "https://instagram.com" },
    { icon: <FaTwitter size={16} />, href: "https://twitter.com" },
    { icon: <FaLinkedinIn size={16} />, href: "https://linkedin.com" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#f1f8f1] pt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Savory Nest Logo"
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
            <p className="description">
              At our food delivery service, we are passionate about making your
              dining experience convenient and enjoyable.
            </p>
          </div>

          {/* Explore Links - Mapping */}
          <div className="lg:pl-8">
            <h3 className="nameText">Explore</h3>
            <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
              {footerData.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#4c6b4c] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal - Mapping */}
          <div className="grid grid-cols-2 gap-4 lg:block">
            <div className="mb-10">
              <h3 className="nameText">Resources</h3>
              <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
                {footerData.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#4c6b4c]">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="nameText">Legal</h3>
              <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
                {footerData.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#4c6b4c]">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Us & Socials - Mapping */}
          <div>
            <h3 className="nameText">Contact Us</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-[#2d402d] font-semibold">
                <IoCallOutline className="text-xl" />
                <span>+1-555-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-[#2d402d] font-semibold">
                <IoMailOutline className="text-xl" />
                <span>support@Savorynest.com</span>
              </div>

              {/* Social Icons Mapping */}
              <div className="flex gap-3 pt-4">
                {footerData.socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#a3b18a] text-white flex items-center justify-center hover:bg-[#2d402d] transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-[#1b2b1b] py-5 text-center">
        <p className="text-white/90 text-[13px] tracking-widest font-light">
          © 2026 Savorynest. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;