import Svg, { G, Rect, Circle, Line, Ellipse } from "react-native-svg";

type ArtistIconProps = {
  width?: number;
  height?: number;
};

const ArtistIcon = ({ width = 56, height = 56 }: ArtistIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <G>
      <Rect x="8" y="12" width="24" height="32" rx="4" stroke="#E6B800" strokeWidth="2" fill="#FFF9E6" />
      <Circle cx="20" cy="24" r="6" fill="#E6B800" />
      <Rect x="14" y="34" width="12" height="2" rx="1" fill="#333" />
      <Rect x="36" y="28" width="20" height="16" rx="2" stroke="#333" strokeWidth="2" fill="none" />
      <Line x1="36" y1="32" x2="56" y2="32" stroke="#333" strokeWidth="1" />
      <Line x1="41" y1="28" x2="41" y2="44" stroke="#333" strokeWidth="1" />
      <Line x1="46" y1="28" x2="46" y2="44" stroke="#333" strokeWidth="1" />
      <Line x1="51" y1="28" x2="51" y2="44" stroke="#333" strokeWidth="1" />
      <Ellipse cx="48" cy="8" rx="4" ry="5" fill="#E6B800" />
      <Line x1="52" y1="13" x2="52" y2="22" stroke="#E6B800" strokeWidth="1.5" />
      <Ellipse cx="56" cy="6" rx="3" ry="4" fill="#333" />
      <Line x1="59" y1="10" x2="59" y2="18" stroke="#333" strokeWidth="1.5" />
    </G>
  </Svg>
);

export default ArtistIcon;
