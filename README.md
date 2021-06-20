# An easy way to add feature detection to your [TailwindCSS](https://tailwindcss.com) project

This plugin allows you to easily add CSS feature detection to your project either by making use of the [`@supports` at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) or by adding a class to your HTML.
Here's a quick example:

```js
// tailwind.config.js

module.exports = {
    theme: {
        // ...
    },
    variants: {
        extend: {
            grid: ['has-grid-support'],
            gridTemplateColumns: ['has-grid-support'],
            display: ['ie-😱'],
        },
    },
    plugins: [
        require('@vicgutt/tailwindcss-feature-detection')([
            {
                name: 'ie-😱',
                strategy: 'class',
            },
            {
                name: 'has-grid-support',
                strategy: 'atRule',
                atRule: {
                    name: 'supports',
                    params: '(display: grid) and (gap: 1em)',
                },
            },
        ]),
    ],
};
```

```html
<html class="ie-😱">
    ...

    <section class="flex has-grid-support:grid has-grid-support:grid-cols-3 ie-😱:hidden">
        ...
    </section>
</html>
```

**Output**

```css
/* Well actually it'll be resolved into ".ie-\1F631 .ie-\1F631\:hidden" but let's pretend 👀 */
.ie-\😱 .ie-\😱\:hidden {
    display: none;
}

@supports (display: grid) and (gap: 1em) {
    .has-grid-support\:grid {
        display: grid
    }
    .has-grid-support\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr))
    }
}
```

## Installation

Install the plugin via NPM _(or yarn)_:

``` bash
# Using npm
npm i @vicgutt/tailwindcss-feature-detection

# Using Yarn
yarn add @vicgutt/tailwindcss-feature-detection
```

Then add the plugin to your tailwind.config.js file:

``` js
// tailwind.config.js

module.exports = {
    plugins: [
        require('@vicgutt/tailwindcss-feature-detection')([]),
    ],
};
```

## Configuring the variants

The plugin expects an array of variants to be passed in. Each variant is an object that can have the follwing properties:

| Property             | Required                             | Type                 | Description |
| -------------------- | ------------------------------------ | -------------------- | ----------- |
| name                 | true                                 | string               | The Tailwind variant name.  
| strategy             | true                                 | 'class' \| 'atRule'  | The "strategy" to use when registering the variant. Should it require a class on the HTML or make use of feature queries.
| atRule               | true if strategy === 'atRule'        | postcss's "[AtRuleProps](https://postcss.org/api/#atruleprops)" \| undefined | Configuring the at-rule.
| parentClassName      | false even when strategy === 'class' | string \| undefined  | Specifying the class that will be set in the HTML code. If it is not defined, the variant's name will be used.
| enabled              | false                                | boolean \| undefined | Whether or not this variant should be skipped.

And postcss's "AtRuleProps" object can have the follwing properties:

| Property     | Required      | Type                            | Description |
| ------------ | ------------- | ------------------------------- | ----------- |
| name         | true          | string                          | Name of the at-rule.
| params       | false         | string \| number \| undefined   | Parameters following the name of the at-rule.
| raws         | false         | [AtRuleRaws](https://postcss.org/api/#atruleraws) \| undefined         | Information used to generate byte-to-byte equal node string as it was in the origin input.

## Provided defaults

A set of default variants are conveniently provided. To know what those defaults are, please take a look at the [src/defaults.ts](https://github.com/VicGUTT/tailwindcss-feature-detection/blob/main/src/defaults.ts) file.

Then in your tailwind.config.js file:

``` js
// tailwind.config.js

module.exports = {
    plugins: [
        require('@vicgutt/tailwindcss-feature-detection')(require('@vicgutt/tailwindcss-feature-detection/defaults')),
    ],
};
```

<!-- ## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently. -->

## Contributing

If you're interested in contributing to the project, please read our [contributing docs](https://github.com/VicGUTT/tailwindcss-feature-detection/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
