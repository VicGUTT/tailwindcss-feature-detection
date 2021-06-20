import { Variant } from '../interfaces';
import TailwindcssFeatureDetectionException from './TailwindcssFeatureDetectionException';

export default class HandlerException extends TailwindcssFeatureDetectionException {
    static invalidVariantName(variant: Variant): HandlerException {
        const _variant = JSON.stringify(variant);

        return HandlerException.thow(
            `The provided variant \`${_variant}\` does not have a valid name. Please ensure a name is correctly set.`
        );
    }

    static invalidVariantStrategy(variant: Variant): HandlerException {
        const _variant = JSON.stringify(variant);

        return HandlerException.thow(
            `The provided variant \`${_variant}\` does not have a valid strategy. Please ensure the strategy is either \`class\` or \`atRule\`.`
        );
    }

    static invalidVariantParentClassName(variant: Variant): HandlerException {
        const _variant = JSON.stringify(variant);

        return HandlerException.thow(
            `The provided variant \`${_variant}\` does not have a valid "parentClassName" property. Please ensure a value is correctly set when the variant strategy is set to \`class\`.`
        );
    }

    static invalidVariantAtRule(variant: Variant): HandlerException {
        const _variant = JSON.stringify(variant);

        return HandlerException.thow(
            `The provided variant \`${_variant}\` does not have a valid "atRule" property. Please ensure a value is correctly set when the variant strategy is set to \`atRule\`.`
        );
    }
}
