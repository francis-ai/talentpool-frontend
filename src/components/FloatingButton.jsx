import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const socialLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/talentpoolafricahq",
    color: "bg-blue-600",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    url: "https://www.instagram.com/talentpoolafrica?igsh=aDFzbGU2N3AzOHp6",
    color: "bg-pink-500",
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com/@talentpoolafrica?_t=ZS-90W8nXulvrb&_r=1", // replace with your actual TikTok handle
    color: "bg-black",
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp />,
    url: "https://wa.me/2347067870861", // your WhatsApp link
    color: "bg-green-500",
  },
];

const FloatingSocialButtons = ({ position = "left" }) => {
  return (
    <div
      className={`fixed top-1/3 z-50 flex flex-col ${
        position === "left" ? "left-0" : "right-0"
      }`}
    >
      {socialLinks.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group flex items-center text-white shadow-md transition-all duration-300
            ${item.color}
            ${position === "left" ? "pl-4 pr-2" : "pr-4 pl-2 flex-row-reverse"}
            w-12 hover:w-36 h-12 overflow-hidden
          `}
          style={{
            transformOrigin: position === "left" ? "left center" : "right center",
          }}
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          <span
            className={`ml-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300`}
          >
            {item.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default FloatingSocialButtons;
