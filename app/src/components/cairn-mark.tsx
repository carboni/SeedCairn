import Svg, { Ellipse } from 'react-native-svg';

import { Palette } from '@/constants/theme';

type CairnMarkProps = {
  size?: number;
};

/**
 * Four stacked stones, ochre top stone standing in for the seed — the
 * wordmark glyph used throughout the SeedCairn design draft. Geometry is
 * ported exactly from the design project's mark-transparent.svg (a
 * 1024x1024 source, cropped here to its content bounding box).
 */
export function CairnMark({ size = 22 }: CairnMarkProps) {
  const width = size;
  const height = (size * 621.4) / 511.2;

  return (
    <Svg width={width} height={height} viewBox="0 0 511.2 621.4" fill="none">
      <Ellipse cx={255.6} cy={545.5} rx={255.6} ry={75.9} fill={Palette.borderStrong} />
      <Ellipse cx={255.6} cy={369.8} rx={195.7} ry={65.5} fill={Palette.borderStrong} />
      <Ellipse cx={255.6} cy={210.1} rx={139.8} ry={55.9} fill={Palette.borderStrong} />
      <Ellipse cx={255.6} cy={46.3} rx={83.9} ry={46.3} fill={Palette.ochre} />
    </Svg>
  );
}
