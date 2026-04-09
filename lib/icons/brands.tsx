import { SiApplemusic, SiSoundcloud, SiSpotify, SiTidal, SiYoutubemusic } from "react-icons/si";

type IconProps = {
  className?: string;
};

export const SpotifyIcon = ({ className }: IconProps) => (
  <SiSpotify className={`text-[#1DB954] ${className ?? ""}`} />
);

export const AppleMusicIcon = ({ className }: IconProps) => (
  <SiApplemusic className={`text-[#fa233b] ${className ?? ""}`} />
);

export const SoundCloudIcon = ({ className }: IconProps) => (
  <SiSoundcloud className={`text-orange-500 ${className ?? ""}`} />
);

export const TidalIcon = ({ className }: IconProps) => (
  <SiTidal className={`${className ?? ""}`} />
);

export const YouTubeMusicIcon = ({ className }: IconProps) => (
  <SiYoutubemusic className={`text-red-600 ${className ?? ""}`} />
);

export const DeezerIcon = ({ className }: IconProps) => (
  <span className={`font-semibold tracking-wide text-white ${className ?? ""}`}>D</span>
);

export const AudiusIcon = ({ className }: IconProps) => (
  <span className={`font-semibold tracking-wide text-white ${className ?? ""}`}>A</span>
);

export const AmazonMusicIcon = ({ className }: IconProps) => (
  <span className={`font-semibold tracking-wide text-sky-500 ${className ?? ""}`}>a</span>
);
