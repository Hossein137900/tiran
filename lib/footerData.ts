import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from "react-icons/fa";

interface ContactInfoItem {
  label: string;
  value: string;
  icon: React.ComponentType;
  isLink?: boolean;
  href?: string;
}
export const socialLinks = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Twitter", href: "#", icon: FaTwitter },
  { name: "LinkedIn", href: "#", icon: FaLinkedin },
  { name: "Telegram", href: "#", icon: FaTelegram },
];

export const quickLinks = [
  { name: "صفحه اصلی", href: "/" },
  { name: "محصولات", href: "/store" },
  { name: "درباره ما", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
  { name: "بلاگ", href: "/blogs" },
];

export const contactInfo: ContactInfoItem[] = [
  {
    label: "شماره تماس",
    value: "۰۲۱-۱۲۳۴۵۶۷۸",
    icon: FaPhone,
    isLink: true,
    href: "tel:+982112345678",
  },
  {
    label: "ایمیل",
    value: "info@msl-chandeliers.com",
    icon: FaEnvelope,
    isLink: true,
    href: "mailto:info@msl-chandeliers.com",
  },
  {
    label: "آدرس",
    value: "تهران، خیابان ولیعصر، پاساژ نور",
    icon: FaMapMarkerAlt,
    isLink: false,
  },
];
