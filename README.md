## Using font icons with NativeScript

### The Problem

You can use icon fonts with NativeScript by combining a class with a unicode reference in the view:

* CSS
```css
.fa {
  font-family: FontAwesome;
}
```

* view
```xml
<Label class="fa" text="\uf293"></Label>
```

This works but keeping up with unicodes is not fun.

### The Solution

With this plugin, you can instead reference the `fonticon` by the specific classname:

```xml
<Label class="fas" text="fa-bluetooth"></Label> 
```

## Install

```
npm install @nativescript-community/fonts --save-dev
```

### Usage

The plugin performs two pieces of processing on your project when enabled at build time:

* It will scan your code for the relevant character tokens, replacing them with the actual character.
* It will parse your font file and remove all unused characters, which depending on your particular usage will greatly reduce the size of the font.

This processing is configured in your `webpack.config.js` and occurs at build time.

### FontAwesome

[FontAwesome](https://fontawesome.com/docs/web/setup/packages) is distributed as a npm package so we can make use of that to add it to our project.

* Install as a dev dependency

```
npm i @fortawesome/fontawesome-free --save-dev
```

* Create classes in `app.css/scss` global file, for each font you wise to use:

    ```css
    .fas {
    font-family: 'Font Awesome 6 Free', 'fa-solid-900';
    font-weight: 900;
    }

    .far {
    font-family: 'Font Awesome 6 Free', 'fa-regular-400';
    font-weight: 400;
    }

    .fab {
    font-family: 'Font Awesome 6 Brands', 'fa-brands-400';
    font-weight: 400;
    }
    ```

* Use the icon name in the text and set the class for the font, for example:

    ```xml
    <Label class="fas" text="trash-can"></Label> 
    ``` 

* Configure in your `webpack.config.js`

  Import the required function/enum:
    ```js
    const { addFontsConfigFontAwesome, FontAwesomeFontType } = require('@nativescript-community/fonts');

    ```
  Configure the fonts that you are using:
  ```js
  addFontsConfigFontAwesome({ 
    fontTypes: [FontAwesomeFontType.solid, FontAwesomeFontType.brands, FontAwesomeFontType.regular], stripCharactersFromFont: true });
  
  ```

### Material Design Fonts

[Material Design Fonts](https://materialdesignicons.com) are also available as a npm package.

* Install as a dev dependency

    ```
    npm i @mdi/font --save-dev
    ```

* Create classes in `app.css/scss` global file, for the font:

    ```css
    .mdi {
    font-family: 'Material Design Icons', 'materialdesignicons-webfont';
    font-weight: 400;
    }
    ```

* Use the icon name in the text and set the class for the font, for example:

    ```xml
    <Label class="mdi" text="trash-can"></Label> 
    ``` 

* Configure in your `webpack.config.js`

  Import the required function/enum:
    ```js
    const { addFontsConfigMDIFont } = require('@nativescript-community/fonts');

    ```
  Configure the fonts that you are using:
  ```js
   addFontsConfigMDIFont({
    stripCharactersFromFont: true,
    });  
  ```

### Other fonts

You can also use any other fonts:

An example where we explicitly define the tokens for the font [icofont](https://icofont.com/).

* Download the font and place it in your project e.g. `fonts\icofont.ttf`
* Add the css
    ```css
    .icoFont {
        font-family: 'IcoFont', 'icofont';
        font-weight: 400;
    }
    ```
* Configure in your `webpack.config.js`

  Import the required function/enum:
    ```js
    const { addFontsConfigCustom } = require('@nativescript-community/fonts');


    ```
  Configure the fonts that you are using:
  ```js
      addFontsConfigCustom({
        pathToFont: 'fonts/icofont.ttf',
        tokenPrefix: 'icofont-',   // text text before the icon name in your source code
        tokenValues: {
        trash: 'ee09', // token name, character code
        },
        stripCharactersFromFont: true,
    });
  ```

   
* Use the font:
    ```xml
      <Label text="icofont-trash" class="icoFont"/>
    ```

An example where we are not using icons but want to optimize the font size,  [Google Monoton](https://fonts.google.com/specimen/Monoton).

* Download the font and place it in your project e.g. `fonts\Monoton-Regular.ttf`
* Add the css
    ```css
    .monoton {
    font-family: 'Monoton', 'Monoton-Regular';
    font-weight: 400;
    }
    ```
* Configure in your `webpack.config.js`

  Import the required function/enum:
    ```js
    const { addFontsConfigCustom } = require('@nativescript-community/fonts');


    ```
  Configure the fonts that you are using:
  ```js
    addFontsConfigCustom({ pathToFont: 'fonts/Monoton-Regular.ttf', extraCharacters: 'trash-can', stripCharactersFromFont: true });
  ```

    We are not using this font for icons, so here we simply wish to optimize the font, and we pass in the few characters that we use this font for.
* Use the font:
    ```xml
    <Label text="trash-can" class="monoton"/>
    ```


An example where we define the tokens for the font in an scss file, [dripicons](http://demo.amitjakhu.com/dripicons/).

* Download the font and place it in your project e.g. `fonts\dripicons-v2.ttf`
* Add a scss file e.g. `fonts\dripicons.scss` with the contents:
    ```scss
    $trash-can: \e053;
    ```
* Add the css
    ```css
    .drip {
    font-family: 'dripicons-v2', 'dripicons-v2';
    font-weight: 400;
    }
    ```
* Configure in your `webpack.config.js`

  Import the required function/enum:
    ```js
    const { addFontsConfigCustom } = require('@nativescript-community/fonts');


    ```
  Configure the fonts that you are using:
  ```js
  
    addFontsConfigCustom({ 
        pathToFont: 'fonts/dripicons-v2.ttf', 
        tokenPrefix: 'drip-', 
        tokenScss: 'fonts/dripicons.scss', 
        stripCharactersFromFont: true }
    );

  ```

   
* Use the font:
    ```xml
        <Label text="drip-trash-can" class="drip"/>

    ```

## Usage Notes

In the examples above `stripCharactersFromFont` is set to `true`.  This ensures tha the unused characters are stripped from the fonts.

For a better development experience you want to set this to false during development, one option is to set it to the value `env.production` which should be true on release builds.



## Credits

Idea came from [farfromrefug](https://github.com/farfromrefug)'s [post here](https://discord.com/channels/603595811204366337/606457523574407178/904382834570068058).


# License

[MIT](/LICENSE)
