import { Variant } from './interfaces';

const defaults: Variant[] = [
    /** Browser detection
     *
     * "As of the time writing this article (Jun 30, 2020), all of the techniques used are working.
     * Browsers might behave differently in the future."
     *
     * "These techniques are solely derived from my experience,
     * if you know of any reliable ways of detecting browsers then please share them"
     * 
     * -> I personally consider the following checks to be used as "last resort".
     *
     * @see https://medium.com/weekly-webtips/here-is-how-you-detect-the-browser-in-use-in-both-javascript-and-css-bcb5a6458379
     * @see https://github.com/yousifalraheem/browser-detector
    ------------------------------------------------*/

    /**
     * Probably best to use the "class" strategy and the
     * "Conditional comments" (<!--[if IE]>...<![endif]-->) hack and/or JS.
     *
     * @see https://en.wikipedia.org/wiki/Conditional_comment
     */
    {
        name: 'ie',
        strategy: 'atRule',
        atRule: {
            name: 'media',
            params: 'all and (-ms-high-contrast: none), (-ms-high-contrast: active)',
        },
    },

    /**
     * The "new Edge" browser would fall under the "Chromium"
     * detection below.
     */
    {
        name: 'old-edge',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(-ms-ime-align: auto)',
        },
    },

    /**
     * @see https://twitter.com/samselikoff/status/1383087997445406724/photo/1
     * @see https://gist.github.com/samselikoff/b3c5126ee4f4e69e60b0af0aa5bfb2e7
     */
    {
        name: 'firefox',
        strategy: 'atRule',
        atRule: {
            name: '-moz-document',
            params: 'url-prefix()',
        },
    },

    /**
     * The "new IE" ? 🤔
     */
    {
        name: 'safari',
        strategy: 'atRule',
        atRule: {
            name: 'media',
            params: 'not all and (min-resolution: 0.001dpcm)',
        },
    },

    /**
     * All Chromium based browsers, not differentiating any of them.
     */
    {
        name: 'chromium',
        strategy: 'atRule',
        atRule: {
            name: 'media',
            params: 'screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm)',
        },
    },

    /** General browser support type
     *
     * Script example:
     * <!DOCTYPE html>
     *    <html>
     *    <body>
     *        <script>
     *            (async () => {
     *                const modern = await (async () => {
     *                    const { data } = (await (await fetch('https://raw.githubusercontent.com/Fyrd/caniuse/main/data.json')).json());
     *
     *                    return Object.values(data)
     *                        .filter(value => (
     *                            value.categories.join('').includes('CSS')
     *                            && !value.categories.join('').includes('JS')
     *                            && !value.categories.join('').includes('HTML')
     *                            && (value.usage_perc_y >= 80)
     *                            && (value.usage_perc_y < 90)
     *                        ));
     *                })();
     *
     *                console.log(
     *                    JSON.stringify(modern.map(item => item.title))
     *                );
     *            })();
     *        </script>
     *    </body>
     *    </html>
    ------------------------------------------------*/

    /**
     * Are considered "modern" browsers that support features
     * with ~80% global caniuse.com full support without completely
     * discarding one or more major browsers.
     * ie.: Does not check for a feature that has ~80% global support but with, say, "Firefox" at 0% support.
     */
    {
        name: 'modern',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: `
                (display: revert)
                and (font-size: min(1em, 2em))
                and (font-size: max(1em, 2em))
                and (font-size: clamp(1em, 2em, 3em))
            `,
            /*
                Not included because they exclude one or more major browsers
                    - (resize: horizontal) --> (excludes Safari on IOS)
                    - (background-attachment: fixed) --> (excludes Safari)
                    - (backdrop-filter: blur(2px)) --> (excludes Firefox and is only ~71% unprefixed)
            */
        },
    },

    /**
     * Are considered "Cutting egde" browsers that support features
     * with ~70% global caniuse.com full support even if completely
     * discarding one or more major browsers.
     */
    {
        name: 'egde',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: `
                (contain: content)
                and (height: fit-content)
                and (content-visibility: hidden)
                and (contain-intrinsic-size: 1000px)
                and (aspect-ratio: 1 / 1)
            `,
            /*
                Included even if they exclude one or more major browsers
                    - (contain: content) --> (excludes Safari & Safari on IOS)
                    - (height: fit-content) --> (excludes Firefox)
                    - (content-visibility: hidden) --> (excludes Firefox & Safari & Safari on IOS)
                    - (contain-intrinsic-size: 1000px) --> (excludes Firefox & Safari & Safari on IOS)
                    - (aspect-ratio: 1 / 1) --> (excludes Safari & Safari on IOS) --> (at 65.93% global support)
            */
        },
    },

    /* Specific feature support
    ------------------------------------------------*/

    /**
     * Requires JS to remove the class on page load.
     *
     * @example
     * <html class="no-js">
     *     <head>
     *         <script>
     *             document.querySelector('html').classList.remove('no-js');
     *         </script>
     *     </head>
     */
    {
        name: 'nojs',
        strategy: 'class',
        parentClassName: 'no-js',
    },

    /**
     * Requires JS.
     *
     * @see https://ishadeed.com/article/flexbox-gap
     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/flexgap.js
     */
    {
        name: 'flexgap',
        strategy: 'class',
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/var()
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/--*
     */
    {
        name: 'var',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(color: var(--primary))',
        },
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid
     */
    {
        name: 'grid',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(display: grid) and (gap: 1em)',
        },
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
     */
    {
        name: 'object-fit',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(object-fit: cover)',
        },
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()
     */
    {
        name: 'clamp',
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(font-size: clamp(1em, 2em, 3em))',
        },
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
     */
    {
        name: 'aspect', // Inspired by Tailwind's official aspect-ratio plugin
        strategy: 'atRule',
        atRule: {
            name: 'supports',
            params: '(aspect-ratio: 1 / 1)',
        },
    },

    // /**
    //  * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
    //  */
    // {
    //     name: 'line-clamp',
    //     strategy: 'atRule',
    //     atRule: {
    //         name: 'supports',
    //         params: '(line-clamp: 5)',
    //     },
    // },
];

export default defaults;
