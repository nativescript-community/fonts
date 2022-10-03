import * as webpack from '@nativescript/webpack';
import * as Fontmin from 'fontmin';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import * as symbolsParser from 'scss-symbols-parser';

/***
 * Configure FontAwesome fonts.
 */
export function addFontsConfigFontAwesome(options: FontAwesomFontOptions) {
  // Check if required is passed.

  if (!options || !options.fontTypes || !Array.isArray(options.fontTypes) || options.fontTypes.length === 0) {
    throw new Error('You must pass the font types to use, e.g. [FontAwesomeFontType.solid]');
  }
  // which fonts to use in the font-awesome bundle.
  const pathsToFonts = pathsToFontAwesomeFonts(options);

  const icons = getFontAwesomeStyleIconsByModule('@fortawesome/fontawesome-free/scss/_variables.scss', '$fa-var-');

  addFontsConfig(icons, options?.tokenPrefix ? options.tokenPrefix : 'fa-', pathsToFonts, options?.stripCharactersFromFont);
}

/***
 * Configure Material Design font.
 */
export function addFontsConfigMDIFont(options: FontOptions) {
  const pathToFont = path.relative(webpack.Utils.project.getProjectFilePath('node_modules'), require.resolve('@mdi/font/fonts/materialdesignicons-webfont.ttf'));
  const icons = getMDIStyleIcons('@mdi/font/scss/_variables.scss', '$mdi-icons');

  addFontsConfig(icons, options?.tokenPrefix ? options.tokenPrefix : 'mdi-', [pathToFont], options?.stripCharactersFromFont);
}

/***
 * Configure a font.
 */
export function addFontsConfigCustom(options: FontOptions) {
  if (!existsSync(options?.pathToFont)) {
    throw new Error('Font file does not exist:' + options?.pathToFont);
  }
  let icons;
  if (options.tokenScss) {
    icons = getFontAwesomeStyleIcons(options.tokenScss, options.tokenScssPrefix ? options.tokenScssPrefix : '$');
  }
  const pathToFont = path.relative(webpack.Utils.project.getProjectFilePath('node_modules'), options?.pathToFont);
  addFontsConfig(options.tokenValues ?? icons, options.tokenPrefix, [pathToFont], options?.stripCharactersFromFont, options?.extraCharacters);
}

export interface FontOptions {
  tokenValues?: object;
  tokenPrefix?: string;
  pathToFont?: string;
  extraCharacters?: string;
  tokenScss?: string;
  tokenScssPrefix?: string;
  stripCharactersFromFont?: boolean;
}

export interface FontAwesomFontOptions extends FontOptions {
  fontTypes: FontAwesomeFontType[];
}

export enum FontAwesomeFontType {
  brands = '@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf',
  regular = '@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf',
  solid = '@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
}

function fixedFromCharCode(codePt) {
  if (codePt > 0xffff) {
    codePt -= 0x10000;
    return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
  } else {
    return String.fromCharCode(codePt);
  }
}

function processFont(glyphs, content) {
  return new Promise((resolvePromise, reject) => {
    new Fontmin()
      .src(content)
      .use(Fontmin.glyph({ text: glyphs }))
      .run(function (err, files) {
        if (err) {
          reject(err);
        } else {
          resolvePromise(files[0].contents);
        }
      });
  });
}
function getFontAwesomeStyleIconsByModule(modulePath: string, variablesPrefix: string) {
  const variablesPath = require.resolve(modulePath);
  return getFontAwesomeStyleIcons(variablesPath, variablesPrefix);
}

function getFontAwesomeStyleIcons(variablesPath: string, variablesPrefix: string) {
  const fontAwesomeSymbols = symbolsParser.parseSymbols(readFileSync(variablesPath).toString());

  return fontAwesomeSymbols.variables.reduce(function (acc, value) {
    acc[value.name.replace(variablesPrefix, '')] = value.value.slice(1);
    return acc;
  }, {});
}

function getMDIStyleIcons(variablesScss: string, variableName: string): object {
  const result: object = {};
  const variablesPath = require.resolve(variablesScss);
  const fontAwesomeSymbols = symbolsParser.parseSymbols(readFileSync(variablesPath).toString());
  const variable = fontAwesomeSymbols.variables.find((value) => value.name === variableName);
  if (variable) {
    const v = variable.value.split(',\n');

    for (const value of v) {
      const entry = value.trimStart().split(' ');
      result[entry[0].replace('"', '').replace('"', '')] = entry[1]; // fix this
    }
  }

  return result;
}

function addFontsConfig(iconsFromScss: object, inAppPrefix: string, fontLocation: string[], forceStripFromFont: boolean, extraCharaters = '') {
  // custom font pass in list of characters and skip the parsing/replacing
  // material font usage ?

  webpack.Utils.log.info('path to fonts', fontLocation);

  webpack.chainWebpack((config) => {
    const iconsUsedInApp = [];
    if (iconsFromScss) {
      config.module
        .rule('process font' + inAppPrefix)
        .before('bundle')
        .test(/\.(ts|js|xml|html)$/)
        .exclude.add(/node_modules/)
        .end()
        .use('string-replace-loader')
        .loader('string-replace-loader')
        .options({
          search: inAppPrefix + '([a-z-]+)',
          replace: (match, p1) => {
            if (iconsFromScss[p1]) {
              const unicodeHex = iconsFromScss[p1];
              const numericValue = parseInt(unicodeHex, 16);
              const character = fixedFromCharCode(numericValue);
              iconsUsedInApp.push(character);
              return character;
            }
            return match;
          },
          flags: 'g',
        });
    }
    iconsUsedInApp.push(...extraCharaters);
    for (const fontPath of fontLocation) {
      config.plugin('CopyWebpackPlugin').tap((args) => {
        args[0].patterns.push({
          from: fontPath,
          to: 'fonts',
          transform: {
            transformer: (content) => {
              if (forceStripFromFont) {
                return processFont(iconsUsedInApp.join(''), content);
              } else {
                return content;
              }
            },
          },
          // the context of the "from" rule, in this case node_modules
          // we used the getProjectFilePath util here, but this could have been
          // a path.resolve(__dirname, 'node_modules') too.
          context: webpack.Utils.project.getProjectFilePath('node_modules'),
        });

        // should always return all the arguments that should be passed to the plugin constructor
        // in some cases you may want to remove an argument - you can do that by returning an array
        // with that argument removed from it.
        return args;
      });
    }
  });
}

function pathsToFontAwesomeFonts(options: FontAwesomFontOptions) {
  const paths: string[] = [];
  for (let i = 0; i < options.fontTypes.length; ++i) {
    const fontType = options.fontTypes[i];
    paths.push(path.relative(webpack.Utils.project.getProjectFilePath('node_modules'), require.resolve(fontType)));
  }
  return paths;
}
