import Svg, { Circle, Ellipse, G } from 'react-native-svg';

import { Palette } from '@/constants/theme';

type RecoveryRingProps = {
  size?: number;
  /** Opacity for each of the 5 stones, index 0 = top, then clockwise. */
  stoneOpacities: readonly [number, number, number, number, number];
  seedColor: string;
};

const STONES = [
  { cx: 79.98, cy: 26.56, rotate: 0 },
  { cx: 130.8, cy: 63.54, rotate: 72 },
  { cx: 111.35, cy: 123.22, rotate: 144 },
  { cx: 48.55, cy: 123.29, rotate: -144 },
  { cx: 29.14, cy: 63.5, rotate: -72 },
] as const;

/** The logo mark, reused as the recovery hub's collection progress display. */
export function RecoveryRing({ size = 182, stoneOpacities, seedColor }: RecoveryRingProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <Circle cx={80} cy={80} r={80} fill={Palette.action} />
      <Circle cx={80} cy={80} r={77.8} fill="#000000" />
      <Circle cx={80} cy={80} r={73.9} fill={Palette.stoneDark} />
      <G fill={Palette.borderStrong}>
        {STONES.map((stone, i) => (
          <Ellipse
            key={i}
            cx={stone.cx}
            cy={stone.cy}
            rx={43.24}
            ry={16.52}
            opacity={stoneOpacities[i]}
            transform={stone.rotate ? `rotate(${stone.rotate} ${stone.cx} ${stone.cy})` : undefined}
          />
        ))}
      </G>
      <Circle cx={80} cy={80} r={16.52} fill={seedColor} />
    </Svg>
  );
}
