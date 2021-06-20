// @ts-ignore
import cssMatcher from 'jest-matcher-css';
import { Variant } from '../src/interfaces';
import defaults from '../src/defaults';
import generateCss from '../src/utils/generateCss';

const plugin = require('../src');

const toCss = async (variants: Variant[] = [], configuredVariants: string[] = []) => {
    return await generateCss(
        plugin(variants),
        {
            // @ts-ignore
            theme: { screens: false, appearance: { DEFAULT: '1px' } },
            // @ts-ignore
            variants: { appearance: configuredVariants },
            // @ts-ignore
            corePlugins: ['appearance'],
        },
        { base: false, components: false, utilities: true }
    );
};

expect.extend({
    toMatchCss: cssMatcher,
});

describe('index', () => {
    it('is a TailwindCSS plugin function', () => {
        expect(typeof plugin === 'function').toEqual(true);
        expect(typeof plugin().handler === 'function').toEqual(true);
    });

    it('validates the required properties', async () => {
        expect.assertions(2);

        try {
            // @ts-ignore
            await toCss([{ name: ' ' }]);
        } catch (error) {
            expect(error.message.includes('does not have a valid name')).toEqual(true);
        }

        try {
            // @ts-ignore
            await toCss([{ name: 'yolo' }], ['yolo']);
        } catch (error) {
            expect(error.message.includes('does not have a valid strategy')).toEqual(true);
        }
    });

    it('skips disabled variants', async () => {
        expect.assertions(1);

        try {
            await toCss(
                [
                    {
                        name: 'yolo',
                        strategy: 'class',
                    },
                    {
                        name: 'yolo2',
                        strategy: 'class',
                        enabled: false,
                    },
                    {
                        name: 'yolo3',
                        strategy: 'class',
                    },
                ],
                ['yolo', 'yolo2', 'yolo3']
            );
        } catch (error) {
            expect(
                error.message.includes(
                    'Your config mentions the "yolo2" variant, but "yolo2" doesn\'t appear to be a variant'
                )
            ).toEqual(true);
        }
    });

    test('[Strategy: class]: it works', async () => {
        let actual = await toCss(
            [
                {
                    name: 'yolo',
                    strategy: 'class',
                    parentClassName: 'hey',
                },
            ],
            ['yolo']
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none { appearance: none }
            .hey .yolo\\:appearance-none { appearance: none }
        `);

        actual = await toCss(
            [
                {
                    name: 'yo|lo',
                    strategy: 'class',
                    parentClassName: 'hey',
                },
            ],
            ['yo|lo']
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none { appearance: none }
            .hey .yo\\|lo\\:appearance-none { appearance: none }
        `);
    });

    test('[Strategy: class]: if not specified the `parentClassName` takes the `name` value', async () => {
        const actual = await toCss(
            [
                {
                    name: 'yolo',
                    strategy: 'class',
                },
            ],
            ['yolo']
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none { appearance: none }
            .yolo .yolo\\:appearance-none { appearance: none }
        `);
    });

    test('[Strategy: class]: it throws an exception if `parentClassName` is defined but not a filled string', async () => {
        const parentClassNames = ['', ' ', 0, 1, true, null, ['hey'], {}, () => {}];

        expect.assertions(parentClassNames.length);

        parentClassNames.forEach(async (parentClassName) => {
            try {
                await toCss(
                    [
                        {
                            name: 'yolo',
                            strategy: 'class',
                            // @ts-ignore
                            parentClassName,
                        },
                    ],
                    ['yolo']
                );
            } catch (error) {
                expect(error.message.includes('does not have a valid "parentClassName" property')).toEqual(true);
            }
        });
    });

    test('[Strategy: atRule]: it works', async () => {
        let actual = await toCss(
            [
                {
                    name: 'sup',
                    strategy: 'atRule',
                    atRule: {
                        name: 'supports',
                        params: '(flex-wrap: wrap) and (gap: 1em) and (color: var(--primary))',
                    },
                },
            ],
            ['sup']
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none { appearance: none }
            @supports (flex-wrap: wrap) and (gap: 1em) and (color: var(--primary)) {
                .sup\\:appearance-none { appearance: none }
            }
        `);

        actual = await toCss(
            [
                {
                    name: 's.u.p',
                    strategy: 'atRule',
                    atRule: {
                        name: 'supports',
                        params: '(abc: xzy) or (123: 456)',
                    },
                },
            ],
            ['s.u.p']
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none { appearance: none }
            @supports (abc: xzy) or (123: 456) {
                .s\\.u\\.p\\:appearance-none { appearance: none }
            }
        `);
    });

    test('[Strategy: atRule]: it throws an exception if `atRule` is not defined', async () => {
        expect.assertions(1);

        try {
            await toCss(
                [
                    {
                        name: 'yolo',
                        strategy: 'atRule',
                    },
                ],
                ['yolo']
            );
        } catch (error) {
            expect(error.message.includes('does not have a valid "atRule" property')).toEqual(true);
        }
    });

    test('[Default variants]: it works', async () => {
        const actual = await toCss(
            defaults,
            defaults.map((variant) => variant.name)
        );

        // @ts-ignore
        expect(actual).toMatchCss(`
            .appearance-none {
                appearance: none
            }

            @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
                .ie\\:appearance-none {
                    appearance: none
                }
            }

            @supports (-ms-ime-align: auto) {
                .old-edge\\:appearance-none {
                    appearance: none
                }
            }

            @-moz-document url-prefix() {
                .firefox\\:appearance-none {
                    appearance: none
                }
            }

            @media not all and (min-resolution: 0.001dpcm) {
                .safari\\:appearance-none {
                    appearance: none
                }
            }

            @media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
                .chromium\\:appearance-none {
                    appearance: none
                }
            }

            @supports
                (display: revert)
                and (font-size: min(1em, 2em))
                and (font-size: max(1em, 2em))
                and (font-size: clamp(1em, 2em, 3em))
            {
                .modern\\:appearance-none {
                    appearance: none
                }
            }

            @supports
                (contain: content)
                and (height: fit-content)
                and (content-visibility: hidden)
                and (contain-intrinsic-size: 1000px)
                and (aspect-ratio: 1 / 1)
            {
                .egde\\:appearance-none {
                    appearance: none
                }
            }

            .no-js .nojs\\:appearance-none {
                    appearance: none
            }

            .flexgap .flexgap\\:appearance-none {
                    appearance: none
            }

            @supports (color: var(--primary)) {
                .var\\:appearance-none {
                    appearance: none
                }
            }

            @supports (display: grid) and (gap: 1em) {
                .grid\\:appearance-none {
                    appearance: none
                }
            }

            @supports (object-fit: cover) {
                .object-fit\\:appearance-none {
                    appearance: none
                }
            }

            @supports (font-size: clamp(1em, 2em, 3em)) {
                .clamp\\:appearance-none {
                    appearance: none
                }
            }

            @supports (aspect-ratio: 1 / 1) {
                .aspect\\:appearance-none {
                    appearance: none
                }
            }
        `);
    });
});
