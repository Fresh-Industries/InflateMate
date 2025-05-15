// themeConfig.ts
import merge from 'lodash/merge';
import { ThemeDefinition } from './types';
import { baseTheme } from './baseTheme';
import { modernOverrides } from './Themes/Modern';
import { retroOverrides } from './Themes/Retro';
import { playfulOverrides } from './Themes/Playful';


export const themeConfig: { [key: string]: ThemeDefinition } = {
  modern: merge({}, baseTheme, modernOverrides) as ThemeDefinition,
  retro: merge({}, baseTheme, retroOverrides) as ThemeDefinition,
  playful: merge({}, baseTheme, playfulOverrides) as ThemeDefinition,
};
