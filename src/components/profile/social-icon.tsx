import {
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Twitch,
  Globe,
  MessageCircle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  twitch: Twitch,
  discord: MessageCircle,
  tiktok: Globe,
};

export function SocialIcon({
  platform,
  className = "h-5 w-5",
}: {
  platform: string;
  className?: string;
}) {
  const Icon = iconMap[platform.toLowerCase()] || Globe;
  return <Icon className={className} />;
}
