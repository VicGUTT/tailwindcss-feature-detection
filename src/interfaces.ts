import { AtRuleProps, Container, Postcss } from 'postcss';

export interface Variant {
    name: string;
    strategy: 'class' | 'atRule';
    atRule?: AtRuleProps; // (if strategy === 'atRule')
    parentClassName?: string; // (if strategy === 'class')
    enabled?: boolean;
}

export interface TailwindPluginProps {
    addUtilities: Function; // for registering new utility styles
    addComponents: Function; // for registering new component styles
    addBase: Function; // for registering new base styles
    addVariant: Function; // for registering custom variants
    e: Function; // for escaping strings meant to be used in class names
    prefix: Function; // for manually applying the user’s configured prefix to parts of a selector
    theme: Function; // for looking up values in the user’s theme configuration
    variants: Function; // for looking up values in the user’s variants configuration
    config: Function; // for looking up values in the user’s Tailwind configuration
    postcss: Postcss; // for doing low-level manipulation with PostCSS directly
}

export interface TailwindVariantCallback {
    container: Container;
    modifySelectors: Function;
    separator: string;
}
