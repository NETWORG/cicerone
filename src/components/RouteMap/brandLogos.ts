import bmwLogo from '../../assets/car-logos/bmw.png';
import renaultLogo from '../../assets/car-logos/renault.png';
import vwLogo from '../../assets/car-logos/vw.png';
import skodaLogo from '../../assets/car-logos/skoda.png';

/** Shared between the map markers and the tracker table so both render the
 *  same brand badge for a crew. */
export const BRAND_LOGOS: Record<string, string> = {
  bmw: bmwLogo,
  renault: renaultLogo,
  vw: vwLogo,
  skoda: skodaLogo,
};
