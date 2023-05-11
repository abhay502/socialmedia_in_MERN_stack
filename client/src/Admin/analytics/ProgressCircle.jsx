import { CircularProgress, useTheme } from "@mui/material";

const ProgressCircle = ({ progress = 0.75, size = 40 }) => {
  const { palette } = useTheme();

  return (
    <CircularProgress
      variant="determinate"
      value={progress * 100}
      size={size}
      sx={{
        color: palette.primary.main,
      }}
    />
  );
}; 

export default ProgressCircle;
