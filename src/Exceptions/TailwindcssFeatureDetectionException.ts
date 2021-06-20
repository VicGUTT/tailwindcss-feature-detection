export default class TailwindcssFeatureDetectionException extends Error {
    protected static thow(message: string): TailwindcssFeatureDetectionException {
        return new TailwindcssFeatureDetectionException(`[TailwindCSS FeatureDetection plugin]: ${message}`);
    }
}
