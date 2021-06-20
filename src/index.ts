// @ts-ignore
import tailwindPlugin from 'tailwindcss/plugin';
import Handler from './Handler';
import { TailwindPluginProps, Variant } from './interfaces';

module.exports = tailwindPlugin.withOptions(function(variants: Variant[] = []) {
    if (!variants || !Array.isArray(variants) || !variants.length) {
        return () => {};
    }

    return function(props: TailwindPluginProps) {
        variants.forEach((variant) => {
            if (variant.enabled === false) {
                return;
            }

            props.addVariant(variant.name, Handler.handle(variant, props));
        });
    };
});
