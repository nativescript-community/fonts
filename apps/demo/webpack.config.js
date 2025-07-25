const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
const { addFontsConfigFontAwesome, addFontsConfigMDIFont, FontAwesomeFontType, addFontsConfigCustom } = require('@nativescript-community/fonts');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('typescript');

  webpack.chainWebpack((config) => {
    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));
  });

  addFontsConfigFontAwesome({ fontTypes: [FontAwesomeFontType.solid, FontAwesomeFontType.brands, FontAwesomeFontType.regular], stripCharactersFromFont: true });
  addFontsConfigMDIFont({
    stripCharactersFromFont: true,
  });
  addFontsConfigCustom({ pathToFont: '../../tools/assets/fonts/Monoton-Regular.ttf', extraCharacters: 'trash-can', stripCharactersFromFont: true });
  addFontsConfigCustom({
    pathToFont: '../../tools/assets/fonts/icofont.ttf',
    tokenPrefix: 'icofont-',
    tokenValues: {
      trash: 'ee09',
    },
    stripCharactersFromFont: true,
  });
  addFontsConfigCustom({ pathToFont: '../../tools/assets/fonts/dripicons-v2.ttf', tokenPrefix: 'drip-', tokenScss: '../../tools/assets/fonts/dripicons.scss', stripCharactersFromFont: true });
  addFontsConfigCustom({ pathToFont: '../../tools/assets/fonts/icomoon/icomoon.ttf', tokenPrefix: 'icon-', tokenScss: '../../tools/assets/fonts/icomoon/variables.scss', tokenScssPrefix: '$icon-', stripCharactersFromFont: true });
  return webpack.resolveConfig();
};
