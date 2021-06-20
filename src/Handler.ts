import HandlerException from './Exceptions/HandlerException';
import { Variant, TailwindVariantCallback, TailwindPluginProps } from './interfaces';

export default class Handler {
    static handle(variant: Variant, props: TailwindPluginProps): Function {
        if (typeof variant.name !== 'string' || !variant.name.trim().length) {
            throw HandlerException.invalidVariantName(variant);
        }

        switch (variant.strategy) {
            case 'class':
                return Handler.handleClassStrategy(variant, props);
            case 'atRule':
                return Handler.handleAtRuleStrategy(variant, props);
            default:
                throw HandlerException.invalidVariantStrategy(variant);
        }
    }

    private static handleClassStrategy(variant: Variant, props: TailwindPluginProps): Function {
        if (typeof variant.parentClassName === 'undefined') {
            variant.parentClassName = variant.name;
        }

        if (typeof variant.parentClassName !== 'string' || !variant.parentClassName.trim().length) {
            throw HandlerException.invalidVariantParentClassName(variant);
        }

        return ({ modifySelectors, separator }: TailwindVariantCallback) => {
            modifySelectors(({ className }: { className: string }) => {
                return `.${props.e(variant.parentClassName)} .${props.e(`${variant.name}${separator}${className}`)}`;
            });
        };
    }

    private static handleAtRuleStrategy(variant: Variant, props: TailwindPluginProps): Function {
        if (!variant.atRule || typeof variant.atRule !== 'object' || !variant.atRule.name) {
            throw HandlerException.invalidVariantAtRule(variant);
        }

        return ({ container, separator }: TailwindVariantCallback) => {
            const atRule = props.postcss.atRule(variant.atRule);

            atRule.append(container.nodes);
            container.append(atRule);

            atRule.walkRules((rule) => {
                rule.selector = `.${props.e(`${variant.name}${separator}${rule.selector.slice(1)}`)}`;
            });
        };
    }
}
