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
  console.log(JSON.stringify(env));
  addFontsConfigFontAwesome({ fontTypes: [FontAwesomeFontType.solid, FontAwesomeFontType.brands, FontAwesomeFontType.regular], stripCharactersFromFont: true });
  addFontsConfigMDIFont({
    stripCharactersFromFont: true,
  });
  addFontsConfigCustom({ pathToFont: 'fonts/Monoton-Regular.ttf', extraCharacters: 'trash-can', stripCharactersFromFont: true });
  addFontsConfigCustom({
    pathToFont: 'fonts/icofont.ttf',
    tokenPrefix: 'icofont-',
    tokenValues: {
      trash: 'ee09',
    },
    stripCharactersFromFont: true,
  });
  addFontsConfigCustom({ pathToFont: 'fonts/dripicons-v2.ttf', tokenPrefix: 'drip-', tokenScss: 'fonts/dripicons.scss', stripCharactersFromFont: true });
  return webpack.resolveConfig();
};
