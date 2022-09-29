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

  addFontsConfigFontAwesome({ fontTypes: [FontAwesomeFontType.solid, FontAwesomeFontType.brands, FontAwesomeFontType.regular] });
  addFontsConfigMDIFont();
  addFontsConfigCustom({ pathToFont: 'fonts/Monoton-Regular.ttf', extraCharacters: 'trash-can' });
  addFontsConfigCustom({
    pathToFont: 'fonts/icofont.ttf',
    tokenPrefix: 'icofont-',
    tokenValues: {
      trash: 'ee09',
    },
  });
  addFontsConfigCustom({ pathToFont: 'fonts/dripicons-v2.ttf', tokenPrefix: 'drip-', tokenScss: 'fonts/dripicons.scss' });
  return webpack.resolveConfig();
};
