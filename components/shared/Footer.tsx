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
import footerbg from "@/assets/img/footerbg.png";

const footerData = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Reservations", href: "/reservation" },
    { name: "Events", href: "/event" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/#faq-section" },
    { name: "About Us", href: "/about-us" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/legal/privacyPolicy" },
    { name: "Terms of Service", href: "/legal/termsOfService" },
    { name: "Cookie Policy", href: "/legal/cookiePolicy" },
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
    <footer className="w-full pt-16 bg-cover bg-center bg-no-repeat"
    style={{
          backgroundImage: `linear-gradient(rgba(228, 245, 220, 0.9), rgba(228, 245, 220, 0.9)), url(${footerbg.src})`,
        }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
   
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 text-center md:text-left">
          
          
          <div className="col-span-2 lg:col-span-1 space-y-6 flex flex-col items-center md:items-start">
            <Image src={logo} alt="Logo" className="h-14 w-auto object-contain" priority />
            <p className="description">
              Passionate about making your dining experience enjoyable.
            </p>
            <Link href={'/apply-rider'}><button className="blockBtn">Apply to be a Rider</button></Link>
          </div>

          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="nameText">Explore</h3>
            <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
              {footerData.explore.map((link) => (
                <li key={link.name}><Link href={link.href} className="hover:text-[#4c6b4c]">{link.name}</Link></li>
              ))}
            </ul>
          </div>

        
          <div className="flex flex-col items-center md:items-start">
            <h3 className="nameText">Resources</h3>
            <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
              {footerData.resources.map((link) => (
                <li key={link.name}><Link href={link.href} className="hover:text-[#4c6b4c]">{link.name}</Link></li>
              ))}
            </ul>
          </div>

         
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
            <h3 className="nameText">Legal</h3>
            <ul className="space-y-3 text-[#2d402d] font-semibold text-[15px]">
              {footerData.legal.map((link) => (
                <li key={link.name}><Link href={link.href} className="hover:text-[#4c6b4c]">{link.name}</Link></li>
              ))}
            </ul>
          </div>

        
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
            <h3 className="nameText">Contact Us</h3>
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 text-[#2d402d] font-semibold">
                <IoCallOutline className="text-xl" />
                <span>+1-555-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-[#2d402d] font-semibold">
                <IoMailOutline className="text-xl" />
                <span className="text-sm">support@Savorynest.com</span>
              </div>
              <div className="flex gap-3 pt-2">
                {footerData.socials.map((social, index) => (
                  <a key={index} href={social.href} className="w-8 h-8 rounded-full bg-[#a3b18a] text-white flex items-center justify-center hover:bg-[#2d402d] transition-all">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full bg-[#1b2b1b] py-5 text-center">
        <p className="text-white/90 text-[13px] tracking-widest font-light">
          © 2026 Savorynest. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;