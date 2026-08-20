import Svg, { Ellipse } from 'react-native-svg';

import { Palette } from '@/constants/theme';

type CairnMarkProps = {
  size?: number;
};

/**
 * Four stacked stones, ochre top stone standing in for the seed —
 * the wordmark glyph used throughout the SeedCairn design draft.
 */
export function CairnMark({ size = 22 }: CairnMarkProps) {
  const width = size;
  const height = (size * 26) / 22;

  return (
    <Svg width={width} height={height} viewBox="0 0 22 26" fill="none">
      <Ellipse cx={11} cy={22.2} rx={9} ry={2.6} fill={Palette.borderStrong} />
      <Ellipse cx={11} cy={16.6} rx={7} ry={2.4} fill={Palette.borderStrong} />
      <Ellipse cx={11} cy={11.4} rx={5.2} ry={2.2} fill={Palette.borderStrong} />
      <Ellipse cx={11} cy={6.6} rx={3.4} ry={2} fill={Palette.ochre} />
    </Svg>
  );
}
