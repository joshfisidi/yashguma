import { SiSpotify, SiApplemusic, SiYoutube, SiSoundcloud } from "react-icons/si";

type IconProps = {
  className?: string;
};

export const SpotifyIcon = ({ className }: IconProps) => (
  <SiSpotify className={`text-[#1DB954] ${className ?? ""}`} />
);

export const AppleMusicIcon = ({ className }: IconProps) => (
  <SiApplemusic className={`text-black dark:text-white ${className ?? ""}`} />
);

export const YouTubeIcon = ({ className }: IconProps) => (
  <SiYoutube className={`text-red-600 ${className ?? ""}`} />
);

export const SoundCloudIcon = ({ className }: IconProps) => (
  <SiSoundcloud className={`text-orange-500 ${className ?? ""}`} />
);
