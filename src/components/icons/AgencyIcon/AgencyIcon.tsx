import Svg, { G, Rect, Line, Path, Circle, Ellipse } from "react-native-svg";

type AgencyIconProps = {
  width?: number;
  height?: number;
};

const AgencyIcon = ({ width = 56, height = 56 }: AgencyIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <G>
      <Rect x="10" y="20" width="28" height="34" rx="2" stroke="#2E7D32" strokeWidth="2" fill="#E8F5E9" />
      <Line x1="10" y1="28" x2="38" y2="28" stroke="#2E7D32" strokeWidth="1" />
      <Line x1="10" y1="36" x2="38" y2="36" stroke="#2E7D32" strokeWidth="1" />
      <Line x1="10" y1="44" x2="38" y2="44" stroke="#2E7D32" strokeWidth="1" />
      <Rect x="16" y="32" width="6" height="6" fill="#2E7D32" />
      <Rect x="26" y="32" width="6" height="6" fill="#2E7D32" />
      <Rect x="16" y="40" width="6" height="6" fill="#2E7D32" />
      <Rect x="26" y="40" width="6" height="6" fill="#2E7D32" />
      <Rect x="36" y="12" width="18" height="24" rx="2" stroke="#333" strokeWidth="2" fill="#fff" />
      <Rect x="36" y="12" width="18" height="6" rx="2" fill="#E8F5E9" />
      <Line x1="42" y1="24" x2="52" y2="24" stroke="#2E7D32" strokeWidth="1" />
      <Path d="M40 24 L41.5 25.5 L44 23" stroke="#2E7D32" strokeWidth="1.5" fill="none" />
      <Line x1="42" y1="30" x2="52" y2="30" stroke="#999" strokeWidth="1" />
      <Circle cx="41" cy="30" r="1" stroke="#999" fill="none" />
      <Ellipse cx="52" cy="4" rx="3" ry="4" fill="#2E7D32" />
      <Line x1="55" y1="8" x2="55" y2="14" stroke="#2E7D32" strokeWidth="1" />
    </G>
  </Svg>
);

export default AgencyIcon;
