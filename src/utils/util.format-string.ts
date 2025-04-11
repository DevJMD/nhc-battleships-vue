/**
 * Format a string with placeholders.
 *
 * @param {string} str
 * @param args
 * @returns {string}
 */
const formatString = (str: string, ...args: any[]): string => {
    if (!str) {
        return str;
    }

    return str.replace(/%s/g, () => {
        const arg = args.shift();
        return typeof arg === 'string' ? arg : '';
    });
};

export default formatString;
