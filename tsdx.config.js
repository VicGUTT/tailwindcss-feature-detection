const fs   = require('fs');
const path = require('path');

module.exports = {
    rollup(config) {
        hackAroundTsdxLimitations();

        return config;
    },
};

function hackAroundTsdxLimitations() {
    const interval = setInterval(() => {
        if (!fs.existsSync(`${__dirname}/dist`)) {
            return;
        }

        clearInterval(interval);

        fs.writeFileSync(
            path.resolve(`${__dirname}/dist/defaults.js`),
            fs
                .readFileSync(path.resolve(`${__dirname}/src/defaults.ts`), 'utf8')
                .replace("import { Variant } from './interfaces';", '')
                .replace("const defaults: Variant[] =", 'module.exports =')
                .replace("export default defaults;", '')
                .trim()
        );
    }, 300);
}