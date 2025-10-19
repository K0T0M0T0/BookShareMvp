import React from "react";
import defaultProfile from "../assets/defaultProfile.png"; // your default avatar

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: number; // optional for dynamic sizing
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "User profile",
  className,
  size = 48,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultProfile;
  };

  return (
    <img
      src={src || defaultProfile}
      alt={alt}
      onError={handleError}
      className={className}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        backgroundColor: "#ddd",
        userSelect: "none",
      }}
      draggable={false}
    />
  );
};

export default ProfileImage;
