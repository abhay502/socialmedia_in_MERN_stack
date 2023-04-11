import { Box, Skeleton } from "@mui/material";
import { IMG_URL } from "Constants";
import { useState } from "react";

const UserImage = ({ image, size = "60px" }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <Box width={size} height={size} sx={{ position: "relative" }}>
      {loading && (
        <Skeleton
          variant="circular"
          width={size}
          height={size}
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      <img  //This error msg showing bcoz no alt prop for img tag
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          cursor: "pointer",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        width={size}
        height={size}
        src={IMG_URL+image}
        onLoad={handleLoad}
      />
    </Box>
  );
};

export default UserImage;
