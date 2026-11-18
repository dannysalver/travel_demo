import { alpha } from '@mui/material/styles';

function hexToChannel(color) {
  const hex = color.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;
  const value = parseInt(full, 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

export function withAlpha(color, opacity) {
  if (typeof color !== 'string') return color;
  const match = color.match(/^var\((--[^)]+)\)$/);
  if (match) return `rgb(var(${match[1]}Channel) / ${opacity})`;
  return alpha(color, opacity);
}

export function extendPaletteWithChannels(palette) {
  return Object.fromEntries(
    Object.entries(palette).map(([key, value]) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return [key, value];
      const channels = Object.fromEntries(
        Object.entries(value)
          .filter(([, color]) => typeof color === 'string' && color.startsWith('#'))
          .map(([shade, color]) => [`${shade}Channel`, hexToChannel(color)])
      );
      return [key, { ...value, ...channels }];
    })
  );
}
