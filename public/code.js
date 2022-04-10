'use strict';

const nearestValue = (goal, array) => {
    return array.reduce(function (prev, curr) {
        return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });
};
/**
 * convert pixel values to Tailwind attributes.
 * by default, Tailwind uses rem, while Figma uses px.
 * Therefore, a conversion is necessary. Rem = Pixel / 16.abs
 * Then, find in the corresponding table the closest value.
 */
const pixelToTailwindValue = (value, conversionMap) => {
    return conversionMap[nearestValue(value / 16, Object.keys(conversionMap).map((d) => +d))];
};
const mapLetterSpacing = {
    "-0.05": "tighter",
    "-0.025": "tight",
    // 0: "normal",
    0.025: "wide",
    0.05: "wider",
    0.1: "widest",
};
const mapLineHeight = {
    0.75: "3",
    1: "none",
    1.25: "tight",
    1.375: "snug",
    1.5: "normal",
    1.625: "relaxed",
    2: "loose",
    1.75: "7",
    2.25: "9",
    2.5: "10",
};
const mapFontSize = {
    0.75: "xs",
    0.875: "sm",
    1: "base",
    1.125: "lg",
    1.25: "xl",
    1.5: "2xl",
    1.875: "3xl",
    2.25: "4xl",
    3: "5xl",
    3.75: "6xl",
    4.5: "7xl",
    6: "8xl",
    8: "9xl",
};
const mapBorderRadius = {
    // 0: "none",
    0.125: "-sm",
    0.25: "",
    0.375: "-md",
    0.5: "-lg",
    0.75: "-xl",
    1.0: "-2xl",
    1.5: "-3xl",
    10: "-full",
};
const mapWidthHeightSize = {
    // 0: "0",
    0.125: "0.5",
    0.25: "1",
    0.375: "1.5",
    0.5: "2",
    0.625: "2.5",
    0.75: "3",
    0.875: "3.5",
    1: "4",
    1.25: "5",
    1.5: "6",
    1.75: "7",
    2: "8",
    2.25: "9",
    2.5: "10",
    2.75: "11",
    3: "12",
    3.5: "14",
    4: "16",
    5: "20",
    6: "24",
    7: "28",
    8: "32",
    9: "36",
    10: "40",
    11: "44",
    12: "48",
    13: "52",
    14: "56",
    15: "60",
    16: "64",
    18: "72",
    20: "80",
    24: "96",
};
const opacityValues = [
    0,
    5,
    10,
    20,
    25,
    30,
    40,
    50,
    60,
    70,
    75,
    80,
    90,
    95,
];
const nearestOpacity = (nodeOpacity) => nearestValue(nodeOpacity * 100, opacityValues);
const pxToLetterSpacing = (value) => pixelToTailwindValue(value, mapLetterSpacing);
const pxToLineHeight = (value) => pixelToTailwindValue(value, mapLineHeight);
const pxToFontSize = (value) => pixelToTailwindValue(value, mapFontSize);
const pxToBorderRadius = (value) => pixelToTailwindValue(value, mapBorderRadius);
const pxToLayoutSize = (value) => pixelToTailwindValue(value, mapWidthHeightSize);

// https://github.com/dtao/nearest-color converted to ESM and Typescript
// It was sligtly modified to support Typescript better.
// It was also slighly simplified because many parts weren't being used.
/**
 * Defines an available color.
 *
 * @typedef {Object} ColorSpec
 * @property {string=} name A name for the color, e.g., 'red'
 * @property {string} source The hex-based color string, e.g., '#FF0'
 * @property {RGB} rgb The {@link RGB} color values
 */
/**
 * Describes a matched color.
 *
 * @typedef {Object} ColorMatch
 * @property {string} name The name of the matched color, e.g., 'red'
 * @property {string} value The hex-based color string, e.g., '#FF0'
 * @property {RGB} rgb The {@link RGB} color values.
 */
/**
 * Provides the RGB breakdown of a color.
 *
 * @typedef {Object} RGB
 * @property {number} r The red component, from 0 to 255
 * @property {number} g The green component, from 0 to 255
 * @property {number} b The blue component, from 0 to 255
 */
/**
 * Gets the nearest color, from the given list of {@link ColorSpec} objects
 * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
 *
 * Probably you wouldn't call this method directly. Instead you'd get a custom
 * color matcher by calling {@link nearestColor.from}.
 *
 * @public
 * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
 *     string representing one, e.g., '#FF0'
 * @param {Array.<ColorSpec>=} colors An optional list of available colors
 *     (defaults to {@link nearestColor.DEFAULT_COLORS})
 * @return {ColorMatch|string} If the colors in the provided list had names,
 *     then a {@link ColorMatch} object with the name and (hex) value of the
 *     nearest color from the list. Otherwise, simply the hex value.
 *
 * @example
 * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
 * nearestColor('#f11');                   // => '#f00'
 * nearestColor('#f88');                   // => '#f80'
 * nearestColor('#ffe');                   // => '#ff0'
 * nearestColor('#efe');                   // => '#ff0'
 * nearestColor('#abc');                   // => '#808'
 * nearestColor('red');                    // => '#f00'
 * nearestColor('foo');                    // => throws
 */
function nearestColor(needle, colors) {
    needle = parseColor(needle);
    let distanceSq, minDistanceSq = Infinity, rgb, value;
    for (let i = 0; i < colors.length; ++i) {
        rgb = colors[i].rgb;
        distanceSq =
            Math.pow(needle.r - rgb.r, 2) +
                Math.pow(needle.g - rgb.g, 2) +
                Math.pow(needle.b - rgb.b, 2);
        if (distanceSq < minDistanceSq) {
            minDistanceSq = distanceSq;
            value = colors[i];
        }
    }
    // @ts-ignore this is always not null
    return value.source;
}
/**
 * Given either an array or object of colors, returns an array of
 * {@link ColorSpec} objects (with {@link RGB} values).
 *
 * @private
 * @param {Array.<string>|Object} colors An array of hex-based color strings, or
 *     an object mapping color *names* to hex values.
 * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
 *     representing the same colors passed in.
 */
function mapColors(colors) {
    return colors.map((color) => createColorSpec(color));
}
/**
 * Provides a matcher to find the nearest color based on the provided list of
 * available colors.
 *
 * @public
 * @param {Array.<string>|Object} availableColors An array of hex-based color
 *     strings, or an object mapping color *names* to hex values.
 * @return {function(string):ColorMatch|string} A function with the same
 *     behavior as {@link nearestColor}, but with the list of colors
 *     predefined.
 *
 * @example
 * var colors = {
 *   'maroon': '#800',
 *   'light yellow': { r: 255, g: 255, b: 51 },
 *   'pale blue': '#def',
 *   'white': 'fff'
 * };
 *
 * var bgColors = [
 *   '#eee',
 *   '#444'
 * ];
 *
 * var invalidColors = {
 *   'invalid': 'foo'
 * };
 *
 * var getColor = nearestColor.from(colors);
 * var getBGColor = getColor.from(bgColors);
 * var getAnyColor = nearestColor.from(colors).or(bgColors);
 *
 * getColor('ffe');
 * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
 *
 * getColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getColor('#ff0');
 * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
 *
 * getBGColor('#fff'); // => '#eee'
 * getBGColor('#000'); // => '#444'
 *
 * getAnyColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getAnyColor('#888'); // => '#444'
 *
 * nearestColor.from(invalidColors); // => throws
 */
const nearestColorFrom = (availableColors) => {
    const colors = mapColors(availableColors);
    return (hex) => nearestColor(hex, colors);
};
/**
 * Parses a color from a string.
 *
 * @private
 * @param {RGB|string} source
 * @return {RGB}
 *
 * @example
 * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
 * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
 * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
 * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
 * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
 * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
 * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
 * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
 * parseColor('foo');                   // => throws
 */
function parseColor(source) {
    let red, green, blue;
    if (typeof source === "object") {
        return source;
    }
    let hexMatchArr = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
    if (hexMatchArr) {
        const hexMatch = hexMatchArr[1];
        if (hexMatch.length === 3) {
            hexMatchArr = [
                hexMatch.charAt(0) + hexMatch.charAt(0),
                hexMatch.charAt(1) + hexMatch.charAt(1),
                hexMatch.charAt(2) + hexMatch.charAt(2),
            ];
        }
        else {
            hexMatchArr = [
                hexMatch.substring(0, 2),
                hexMatch.substring(2, 4),
                hexMatch.substring(4, 6),
            ];
        }
        red = parseInt(hexMatchArr[0], 16);
        green = parseInt(hexMatchArr[1], 16);
        blue = parseInt(hexMatchArr[2], 16);
        return { r: red, g: green, b: blue };
    }
    throw Error('"' + source + '" is not a valid color');
}
//   export function createColorSpec(input: string | RGB, name: string): ColorSpec;
//   // it can actually return a ColorMatch, but let's ignore that for simplicity
//   // in this app, it is never going to return ColorMatch because the input is hex instead of red
//   export function from(
//     availableColors: Array<String> | Object
//   ): (attr: string) => string;
/**
 * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
 *
 * @private
 * @param {string|RGB} input
 * @param {string=} name
 * @return {ColorSpec}
 *
 * @example
 * createColorSpec('#800'); // => {
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 *
 * createColorSpec('#800', 'maroon'); // => {
 *   name: 'maroon',
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 */
function createColorSpec(input) {
    return {
        source: input,
        rgb: parseColor(input),
    };
}

/**
 * Retrieve the first visible color that is being used by the layer, in case there are more than one.
 */
const retrieveTopFill = (fills) => {
    if (fills && fills !== figma.mixed && fills.length > 0) {
        // on Figma, the top layer is always at the last position
        // reverse, then try to find the first layer that is visible, if any.
        return [...fills].reverse().find((d) => d.visible !== false);
    }
};

const rgbTo6hex = (color) => {
    const hex = ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.b * 255) | (1 << 8)).toString(16).slice(1);
    return hex;
};
const rgbTo8hex = (color, alpha) => {
    // when color is RGBA, alpha is set automatically
    // when color is RGB, alpha need to be set manually (default: 1.0)
    const hex = ((alpha * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.b * 255) | (1 << 8)).toString(16).slice(1);
    return hex;
};
const gradientAngle = (fill) => {
    // Thanks Gleb and Liam for helping!
    const decomposed = decomposeRelativeTransform(fill.gradientTransform[0], fill.gradientTransform[1]);
    return (decomposed.rotation * 180) / Math.PI;
};
// from https://math.stackexchange.com/a/2888105
const decomposeRelativeTransform = (t1, t2) => {
    const a = t1[0];
    const b = t1[1];
    const c = t1[2];
    const d = t2[0];
    const e = t2[1];
    const f = t2[2];
    const delta = a * d - b * c;
    const result = {
        translation: [e, f],
        rotation: 0,
        scale: [0, 0],
        skew: [0, 0],
    };
    // Apply the QR-like decomposition.
    if (a !== 0 || b !== 0) {
        const r = Math.sqrt(a * a + b * b);
        result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
        result.scale = [r, delta / r];
        result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
    }
    // these are not currently being used.
    // else if (c != 0 || d != 0) {
    //   const s = Math.sqrt(c * c + d * d);
    //   result.rotation =
    //     Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    //   result.scale = [delta / s, s];
    //   result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
    // } else {
    //   // a = b = c = d = 0
    // }
    return result;
};

// retrieve the SOLID color for tailwind
const tailwindColorFromFills = (fills, kind) => {
    // kind can be text, bg, border...
    // [when testing] fills can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        // don't set text color when color is black (default) and opacity is 100%
        return tailwindSolidColor(fill, kind);
    }
    return "";
};
const tailwindSolidColor = (fill, kind) => {
    var _a;
    // don't set text color when color is black (default) and opacity is 100%
    if (kind === "text" &&
        fill.color.r === 0.0 &&
        fill.color.g === 0.0 &&
        fill.color.b === 0.0 &&
        fill.opacity === 1.0) {
        return "";
    }
    const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
    // example: text-opacity-50
    // ignore the 100. If opacity was changed, let it be visible.
    const opacityProp = opacity !== 1.0 ? `${kind}-opacity-${nearestOpacity(opacity)} ` : "";
    // example: text-red-500
    const colorProp = `${kind}-${getTailwindFromFigmaRGB(fill.color)} `;
    // if fill isn't visible, it shouldn't be painted.
    return `${colorProp}${opacityProp}`;
};
/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
const tailwindGradientFromFills = (fills) => {
    // [when testing] node.effects can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "GRADIENT_LINEAR") {
        return tailwindGradient(fill);
    }
    return "";
};
const tailwindGradient = (fill) => {
    const direction = gradientDirection$2(gradientAngle(fill));
    if (fill.gradientStops.length === 1) {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        return `${direction} from-${fromColor} `;
    }
    else if (fill.gradientStops.length === 2) {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        const toColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);
        return `${direction} from-${fromColor} to-${toColor} `;
    }
    else {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        // middle (second color)
        const viaColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);
        // last
        const toColor = getTailwindFromFigmaRGB(fill.gradientStops[fill.gradientStops.length - 1].color);
        return `${direction} from-${fromColor} via-${viaColor} to-${toColor} `;
    }
};
const gradientDirection$2 = (angle) => {
    switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
        case 0:
            return "bg-gradient-to-r";
        case 45:
            return "bg-gradient-to-br";
        case 90:
            return "bg-gradient-to-b";
        case 135:
            return "bg-gradient-to-bl";
        case -45:
            return "bg-gradient-to-tr";
        case -90:
            return "bg-gradient-to-t";
        case -135:
            return "bg-gradient-to-tl";
        default:
            // 180 and -180
            return "bg-gradient-to-l";
    }
};
// Basic Tailwind Colors
const tailwindColors = {
    "#000000": "black",
    "#ffffff": "white",
    "#fdf2f8": "pink-50",
    "#fce7f3": "pink-100",
    "#fbcfe8": "pink-200",
    "#f9a8d4": "pink-300",
    "#f472b6": "pink-400",
    "#ec4899": "pink-500",
    "#db2777": "pink-600",
    "#be185d": "pink-700",
    "#9d174d": "pink-800",
    "#831843": "pink-900",
    "#f5f3ff": "purple-50",
    "#ede9fe": "purple-100",
    "#ddd6fe": "purple-200",
    "#c4b5fd": "purple-300",
    "#a78bfa": "purple-400",
    "#8b5cf6": "purple-500",
    "#7c3aed": "purple-600",
    "#6d28d9": "purple-700",
    "#5b21b6": "purple-800",
    "#4c1d95": "purple-900",
    "#eef2ff": "indigo-50",
    "#e0e7ff": "indigo-100",
    "#c7d2fe": "indigo-200",
    "#a5b4fc": "indigo-300",
    "#818cf8": "indigo-400",
    "#6366f1": "indigo-500",
    "#4f46e5": "indigo-600",
    "#4338ca": "indigo-700",
    "#3730a3": "indigo-800",
    "#312e81": "indigo-900",
    "#eff6ff": "blue-50",
    "#dbeafe": "blue-100",
    "#bfdbfe": "blue-200",
    "#93c5fd": "blue-300",
    "#60a5fa": "blue-400",
    "#3b82f6": "blue-500",
    "#2563eb": "blue-600",
    "#1d4ed8": "blue-700",
    "#1e40af": "blue-800",
    "#1e3a8a": "blue-900",
    "#ecfdf5": "green-50",
    "#d1fae5": "green-100",
    "#a7f3d0": "green-200",
    "#6ee7b7": "green-300",
    "#34d399": "green-400",
    "#10b981": "green-500",
    "#059669": "green-600",
    "#047857": "green-700",
    "#065f46": "green-800",
    "#064e3b": "green-900",
    "#fffbeb": "yellow-50",
    "#fef3c7": "yellow-100",
    "#fde68a": "yellow-200",
    "#fcd34d": "yellow-300",
    "#fbbf24": "yellow-400",
    "#f59e0b": "yellow-500",
    "#d97706": "yellow-600",
    "#b45309": "yellow-700",
    "#92400e": "yellow-800",
    "#78350f": "yellow-900",
    "#fef2f2": "red-50",
    "#fee2e2": "red-100",
    "#fecaca": "red-200",
    "#fca5a5": "red-300",
    "#f87171": "red-400",
    "#ef4444": "red-500",
    "#dc2626": "red-600",
    "#b91c1c": "red-700",
    "#991b1b": "red-800",
    "#7f1d1d": "red-900",
    "#f9fafb": "gray-50",
    "#f3f4f6": "gray-100",
    "#e5e7eb": "gray-200",
    "#d1d5db": "gray-300",
    "#9ca3af": "gray-400",
    "#6b7280": "gray-500",
    "#4b5563": "gray-600",
    "#374151": "gray-700",
    "#1f2937": "gray-800",
    "#111827": "gray-900",
};
const tailwindNearestColor = nearestColorFrom(Object.keys(tailwindColors));
// figma uses r,g,b in [0, 1], while nearestColor uses it in [0, 255]
const getTailwindFromFigmaRGB = (color) => {
    const colorMultiplied = {
        r: color.r * 255,
        g: color.g * 255,
        b: color.b * 255,
    };
    return tailwindColors[tailwindNearestColor(colorMultiplied)];
};

const commonLineHeight = (node) => {
    if (node.lineHeight !== figma.mixed &&
        node.lineHeight.unit !== "AUTO" &&
        Math.round(node.lineHeight.value) !== 0) {
        if (node.lineHeight.unit === "PIXELS") {
            return node.lineHeight.value;
        }
        else {
            if (node.fontSize !== figma.mixed) {
                // based on tests, using Inter font with varied sizes and weights, this works.
                // example: 24 * 20 / 100 = 4.8px, which is correct visually.
                return (node.fontSize * node.lineHeight.value) / 100;
            }
        }
    }
    return 0;
};
const commonLetterSpacing = (node) => {
    if (node.letterSpacing !== figma.mixed &&
        Math.round(node.letterSpacing.value) !== 0) {
        if (node.letterSpacing.unit === "PIXELS") {
            return node.letterSpacing.value;
        }
        else {
            if (node.fontSize !== figma.mixed) {
                // read [commonLineHeight] comment to understand what is going on here.
                return (node.fontSize * node.letterSpacing.value) / 100;
            }
        }
    }
    return 0;
};

/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
const tailwindShadow = (node) => {
    // [when testing] node.effects can be undefined
    if (node.effects && node.effects.length > 0) {
        const dropShadow = node.effects.filter((d) => d.type === "DROP_SHADOW" && d.visible !== false);
        let boxShadow = "";
        // simple shadow from tailwind
        if (dropShadow.length > 0) {
            boxShadow = "shadow ";
        }
        const innerShadow = node.effects.filter((d) => d.type === "INNER_SHADOW")
            .length > 0
            ? "shadow-inner "
            : "";
        return boxShadow + innerShadow;
        // todo customize the shadow
        // TODO layer blur, shadow-outline
    }
    return "";
};

/**
 * https://tailwindcss.com/docs/opacity/
 * default is [0, 25, 50, 75, 100], but '100' will be ignored:
 * if opacity was changed, let it be visible. Therefore, 98% => 75
 * node.opacity is between [0, 1]; output will be [0, 100]
 */
const tailwindOpacity = (node) => {
    // [when testing] node.opacity can be undefined
    if (node.opacity !== undefined && node.opacity !== 1) {
        return `opacity-${nearestOpacity(node.opacity)} `;
    }
    return "";
};
/**
 * https://tailwindcss.com/docs/visibility/
 * example: invisible
 */
const tailwindVisibility = (node) => {
    // [when testing] node.visible can be undefined
    // When something is invisible in Figma, it isn't gone. Groups can make use of it.
    // Therefore, instead of changing the visibility (which causes bugs in nested divs),
    // this plugin is going to ignore color and stroke
    if (node.visible !== undefined && !node.visible) {
        return "invisible ";
    }
    return "";
};
/**
 * https://tailwindcss.com/docs/rotate/
 * default is [-180, -90, -45, 0, 45, 90, 180], but '0' will be ignored:
 * if rotation was changed, let it be perceived. Therefore, 1 => 45
 */
const tailwindRotation = (node) => {
    // that's how you convert angles to clockwise radians: angle * -pi/180
    // using 3.14159 as Pi for enough precision and to avoid importing math lib.
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        const allowedValues = [
            -180,
            -90,
            -45,
            -12,
            -6,
            -3,
            -2,
            -1,
            1,
            2,
            3,
            6,
            12,
            45,
            90,
            180,
        ];
        let nearest = nearestValue(node.rotation, allowedValues);
        let minusIfNegative = "";
        if (nearest < 0) {
            minusIfNegative = "-";
            nearest = -nearest;
        }
        return `transform ${minusIfNegative}rotate-${nearest} `;
    }
    return "";
};

/**
 * https://tailwindcss.com/docs/border-width/
 * example: border-2
 */
const tailwindBorderWidth = (node) => {
    // [node.strokeWeight] can have a value even when there are no strokes
    // [when testing] node.effects can be undefined
    if (node.strokes && node.strokes.length > 0 && node.strokeWeight > 0) {
        const allowedValues = [1, 2, 4, 8];
        const nearest = nearestValue(node.strokeWeight, allowedValues);
        if (nearest === 1) {
            // special case
            return "border ";
        }
        else {
            return `border-${nearest} `;
        }
    }
    return "";
};
/**
 * https://tailwindcss.com/docs/border-radius/
 * example: rounded-sm
 * example: rounded-tr-lg
 */
const tailwindBorderRadius = (node) => {
    if (node.type === "ELLIPSE") {
        return "rounded-full ";
    }
    else if ((!("cornerRadius" in node) && !("topLeftRadius" in node)) ||
        (node.cornerRadius === figma.mixed && node.topLeftRadius === undefined) ||
        node.cornerRadius === 0) {
        // the second condition is used on tests. On Figma, topLeftRadius is never undefined.
        // ignore when 0, undefined or non existent
        return "";
    }
    let comp = "";
    if (node.cornerRadius !== figma.mixed) {
        if (node.cornerRadius >= node.height / 2) {
            // special case. If height is 90 and cornerRadius is 45, it is full.
            comp += "rounded-full ";
        }
        else {
            comp += `rounded${pxToBorderRadius(node.cornerRadius)} `;
        }
    }
    else {
        // todo optimize for tr/tl/br/bl instead of t/r/l/b
        if (node.topLeftRadius !== 0) {
            comp += `rounded-tl${pxToBorderRadius(node.topLeftRadius)} `;
        }
        if (node.topRightRadius !== 0) {
            comp += `rounded-tr${pxToBorderRadius(node.topRightRadius)} `;
        }
        if (node.bottomLeftRadius !== 0) {
            comp += `rounded-bl${pxToBorderRadius(node.bottomLeftRadius)} `;
        }
        if (node.bottomRightRadius !== 0) {
            comp += `rounded-br${pxToBorderRadius(node.bottomRightRadius)} `;
        }
    }
    return comp;
};

/**
 * In Figma, Groups have absolute position while Frames have relative.
 * This is a helper to retrieve the node.parent.x without worries.
 * Usually, after this is called, node.x - parentX is done to solve that scenario.
 *
 * Input is expected to be node.parent.
 */
const parentCoordinates = (node) => {
    const parentX = "layoutMode" in node ? 0 : node.x;
    const parentY = "layoutMode" in node ? 0 : node.y;
    return [parentX, parentY];
};

const commonPosition = (node) => {
    // if node is same size as height, position is not necessary
    var _a, _b, _c, _d;
    // detect if Frame's width is same as Child when Frame has Padding.
    // warning: this may return true even when false, if size is same, but position is different. However, it would be an unexpected layout.
    let hPadding = 0;
    let vPadding = 0;
    if (node.parent && "layoutMode" in node.parent) {
        hPadding = ((_a = node.parent.paddingLeft) !== null && _a !== void 0 ? _a : 0) + ((_b = node.parent.paddingRight) !== null && _b !== void 0 ? _b : 0);
        vPadding = ((_c = node.parent.paddingTop) !== null && _c !== void 0 ? _c : 0) + ((_d = node.parent.paddingBottom) !== null && _d !== void 0 ? _d : 0);
    }
    if (!node.parent ||
        (node.width === node.parent.width - hPadding &&
            node.height === node.parent.height - vPadding)) {
        return "";
    }
    // position is absolute, parent is relative
    // return "absolute inset-0 m-auto ";
    const [parentX, parentY] = parentCoordinates(node.parent);
    // if view is too small, anything will be detected; this is necessary to reduce the tolerance.
    let threshold = 8;
    if (node.width < 16 || node.height < 16) {
        threshold = 1;
    }
    // < 4 is a threshold. If === is used, there can be rounding errors (28.002 !== 28)
    const centerX = Math.abs(2 * (node.x - parentX) + node.width - node.parent.width) <
        threshold;
    const centerY = Math.abs(2 * (node.y - parentY) + node.height - node.parent.height) <
        threshold;
    const minX = node.x - parentX < threshold;
    const minY = node.y - parentY < threshold;
    const maxX = node.parent.width - (node.x - parentX + node.width) < threshold;
    const maxY = node.parent.height - (node.y - parentY + node.height) < threshold;
    // this needs to be on top, because Tailwind is incompatible with Center, so this will give preference.
    if (minX && minY) {
        // x left, y top
        return "TopStart";
    }
    else if (minX && maxY) {
        // x left, y bottom
        return "BottomStart";
    }
    else if (maxX && minY) {
        // x right, y top
        return "TopEnd";
    }
    else if (maxX && maxY) {
        // x right, y bottom
        return "BottomEnd";
    }
    if (centerX && centerY) {
        return "Center";
    }
    if (centerX) {
        if (minY) {
            // x center, y top
            return "TopCenter";
        }
        if (maxY) {
            // x center, y bottom
            return "BottomCenter";
        }
    }
    else if (centerY) {
        if (minX) {
            // x left, y center
            return "CenterStart";
        }
        if (maxX) {
            // x right, y center
            return "CenterEnd";
        }
    }
    return "Absolute";
};

const tailwindPosition = (node, parentId = "", hasFixedSize = false) => {
    // don't add position to the first (highest) node in the tree
    if (!node.parent || parentId === node.parent.id) {
        return "";
    }
    // Group
    if (node.parent.isRelative === true) {
        // position is absolute, needs to be relative
        return retrieveAbsolutePos$1(node, hasFixedSize);
    }
    return "";
};
const retrieveAbsolutePos$1 = (node, hasFixedSize) => {
    // everything related to Center requires a defined width and height. Therefore, we use hasFixedSize.
    switch (commonPosition(node)) {
        case "":
            return "";
        case "Absolute":
            return "absoluteManualLayout";
        case "TopCenter":
            if (hasFixedSize) {
                return "absolute inset-x-0 top-0 mx-auto ";
            }
            return "absoluteManualLayout";
        case "CenterStart":
            if (hasFixedSize) {
                return "absolute inset-y-0 left-0 my-auto ";
            }
            return "absoluteManualLayout";
        case "Center":
            if (hasFixedSize) {
                return "absolute m-auto inset-0 ";
            }
            return "absoluteManualLayout";
        case "CenterEnd":
            if (hasFixedSize) {
                return "absolute inset-y-0 right-0 my-auto ";
            }
            return "absoluteManualLayout";
        case "BottomCenter":
            if (hasFixedSize) {
                return "absolute inset-x-0 bottom-0 mx-auto ";
            }
            return "absoluteManualLayout";
        case "TopStart":
            return "absolute left-0 top-0 ";
        case "TopEnd":
            return "absolute right-0 top-0 ";
        case "BottomStart":
            return "absolute left-0 bottom-0 ";
        case "BottomEnd":
            return "absolute right-0 bottom-0 ";
    }
};

const nodeWidthHeight = (node, allowRelative) => {
    /// WIDTH AND HEIGHT
    var _a;
    // if parent is a page, width can't get past w-64, therefore let it be free
    // if (node.parent?.type === "PAGE" && node.width > 256) {
    //   return "";
    // }
    if (node.layoutAlign === "STRETCH" && node.layoutGrow === 1) {
        return {
            width: "full",
            height: "full",
        };
    }
    const [nodeWidth, nodeHeight] = getNodeSizeWithStrokes(node);
    let propWidth = nodeWidth;
    let propHeight = nodeHeight;
    if (node.parent && "layoutMode" in node.parent) {
        // Stretch means the opposite direction
        if (node.layoutAlign === "STRETCH") {
            switch (node.parent.layoutMode) {
                case "HORIZONTAL":
                    propHeight = "full";
                    break;
                case "VERTICAL":
                    propWidth = "full";
                    break;
            }
        }
        // Grow means the same direction
        if (node.layoutGrow === 1) {
            if (node.parent.layoutMode === "HORIZONTAL") {
                propWidth = "full";
            }
            else {
                propHeight = "full";
            }
        }
    }
    // avoid relative width when parent is relative (therefore, child is probably absolute, which doesn't work nice)
    // ignore for root layer
    // todo should this be kept this way? The issue is w-full which doesn't work well with absolute position.
    if (allowRelative && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.isRelative) !== true) {
        // don't calculate again if it was already calculated
        if (propWidth !== "full") {
            const rW = calculateResponsiveWH(node, nodeWidth, "x");
            if (rW) {
                propWidth = rW;
            }
        }
        if (propHeight !== "full") {
            const rH = calculateResponsiveWH(node, nodeHeight, "y");
            if (rH && node.parent) {
                propHeight = rH;
            }
        }
    }
    // when any child has a relative width and parent is HORIZONTAL,
    // parent must have a defined width, which wouldn't otherwise.
    // todo check if the performance impact of this is worth it.
    // const hasRelativeChildW =
    //   allowRelative &&
    //   "children" in node &&
    //   node.children.find((d) =>
    //     calculateResponsiveWH(d, getNodeSizeWithStrokes(d)[0], "x")
    //   ) !== undefined;
    // when the child has the same size as the parent, don't set the size of the parent (twice)
    if ("children" in node && node.children && node.children.length === 1) {
        const child = node.children[0];
        // detect if Frame's width is same as Child when Frame has Padding.
        let hPadding = 0;
        let vPadding = 0;
        if ("layoutMode" in node) {
            hPadding = node.paddingLeft + node.paddingRight;
            vPadding = node.paddingTop + node.paddingBottom;
        }
        // set them independently, in case w is equal but h isn't
        if (child.width === nodeWidth - hPadding) ;
        if (child.height === nodeHeight - vPadding) ;
    }
    if ("layoutMode" in node) {
        if ((node.layoutMode === "HORIZONTAL" &&
            node.counterAxisSizingMode === "AUTO") ||
            (node.layoutMode === "VERTICAL" && node.primaryAxisSizingMode === "AUTO")) {
            propHeight = null;
        }
        if ((node.layoutMode === "VERTICAL" &&
            node.counterAxisSizingMode === "AUTO") ||
            (node.layoutMode === "HORIZONTAL" &&
                node.primaryAxisSizingMode === "AUTO")) {
            propWidth = null;
        }
    }
    // On Tailwind, do not let the size be larger than 384.
    if (allowRelative) {
        if ((node.type !== "RECTANGLE" && nodeHeight > 384) ||
            childLargerThanMaxSize(node, "y")) {
            propHeight = null;
        }
        else if ((node.type !== "RECTANGLE" && nodeWidth > 384) ||
            childLargerThanMaxSize(node, "x")) {
            propWidth = null;
        }
    }
    if ("layoutMode" in node && node.layoutMode !== "NONE") {
        // there is an edge case: frame with no children, layoutMode !== NONE and counterAxis = AUTO, but:
        // in [altConversions] it is already solved: Frame without children becomes a Rectangle.
        switch (node.layoutMode) {
            case "HORIZONTAL":
                return {
                    width: node.primaryAxisSizingMode === "FIXED" ? propWidth : null,
                    height: node.counterAxisSizingMode === "FIXED" ? propHeight : null,
                };
            case "VERTICAL":
                return {
                    width: node.counterAxisSizingMode === "FIXED" ? propWidth : null,
                    height: node.primaryAxisSizingMode === "FIXED" ? propHeight : null,
                };
        }
    }
    else {
        return {
            width: propWidth,
            height: propHeight,
        };
    }
};
// makes the view size bigger when there is a stroke
const getNodeSizeWithStrokes = (node) => {
    let nodeHeight = node.height;
    let nodeWidth = node.width;
    // tailwind doesn't support OUTSIDE or CENTER, only INSIDE.
    // Therefore, to give the same feeling, the height and width will be slighly increased.
    // node.strokes.lenght is necessary because [strokeWeight] can exist even without strokes.
    if ("strokes" in node && node.strokes && node.strokes.length) {
        if (node.strokeAlign === "OUTSIDE") {
            nodeHeight += node.strokeWeight * 2;
            nodeWidth += node.strokeWeight * 2;
        }
        else if (node.strokeAlign === "CENTER") {
            nodeHeight += node.strokeWeight;
            nodeWidth += node.strokeWeight;
        }
    }
    if ("children" in node) {
        // if any children has an OUTSIDE or CENTER stroke and, with that stroke,
        // the child gets a size bigger than parent, adjust parent to be larger
        node.children.forEach((d) => {
            var _a;
            if ("strokeWeight" in d && ((_a = d.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                if (d.strokeAlign === "OUTSIDE") {
                    if (nodeWidth < d.width + d.strokeWeight * 2) {
                        nodeWidth += d.strokeWeight * 2;
                    }
                    if (nodeHeight < d.height + d.strokeWeight * 2) {
                        nodeHeight += d.strokeWeight * 2;
                    }
                }
                else if (d.strokeAlign === "CENTER") {
                    if (nodeWidth < d.width + d.strokeWeight) {
                        nodeWidth += d.strokeWeight;
                    }
                    if (nodeHeight < d.height + d.strokeWeight) {
                        nodeHeight += d.strokeWeight;
                    }
                }
            }
        });
    }
    return [nodeWidth, nodeHeight];
};
const childLargerThanMaxSize = (node, axis) => {
    if ("children" in node && node.children.length > 0) {
        const widthHeight = axis === "x" ? "width" : "height";
        const lastChild = node.children[node.children.length - 1];
        const maxLen = lastChild[axis] + lastChild[widthHeight] - node.children[0][axis];
        return maxLen > 384;
    }
    return false;
};
const calculateResponsiveWH = (node, nodeWidthHeight, axis) => {
    let returnValue = "";
    if (nodeWidthHeight > 384 || childLargerThanMaxSize(node, axis)) {
        returnValue = "full";
    }
    if (!node.parent) {
        return returnValue;
    }
    let parentWidthHeight;
    if ("layoutMode" in node.parent && node.parent.layoutMode !== "NONE") {
        if (axis === "x") {
            // subtract padding from the layout width, so it can be full when compared with parent.
            parentWidthHeight =
                node.parent.width - node.parent.paddingLeft - node.parent.paddingRight;
        }
        else {
            // subtract padding from the layout height, so it can be full when compared with parent.
            parentWidthHeight =
                node.parent.height - node.parent.paddingTop - node.parent.paddingBottom;
        }
    }
    else {
        parentWidthHeight = axis === "x" ? node.parent.width : node.parent.height;
    }
    // 0.01 of tolerance is enough for 5% of diff, i.e.: 804 / 400
    const dividedWidth = nodeWidthHeight / parentWidthHeight;
    const calculateResp = (div, str) => {
        if (Math.abs(dividedWidth - div) < 0.01) {
            returnValue = str;
            return true;
        }
        return false;
    };
    // they will try to set the value, and if false keep calculating
    const checkList = [
        [1, "full"],
        [1 / 2, "1/2"],
        [1 / 3, "1/3"],
        [2 / 3, "2/3"],
        [1 / 4, "1/4"],
        [3 / 4, "3/4"],
        [1 / 5, "1/5"],
        [1 / 6, "1/6"],
        [5 / 6, "5/6"],
    ];
    // exit the for when result is found.
    let resultFound = false;
    for (let i = 0; i < checkList.length && !resultFound; i++) {
        const [div, resp] = checkList[i];
        resultFound = calculateResp(div, resp);
    }
    // todo this was commented because it is almost never used. Should it be uncommented?
    // if (!resultFound && isWidthFull(node, nodeWidth, parentWidth)) {
    //   propWidth = "full";
    // }
    return returnValue;
};
// set the width to max if the view is near the corner
// export const isWidthFull = (
//   node: AltSceneNode,
//   nodeWidth: number,
//   parentWidth: number
// ): boolean => {
//   // check if initial and final positions are within a magic number (currently 32)
//   // this will only be reached when parent is FRAME, so node.parent.x is always 0.
//   const betweenValueMargins =
//     node.x <= magicMargin && parentWidth - (node.x + nodeWidth) <= magicMargin;
//   // check if total width is at least 80% of the parent. This number is also a magic number and has worked fine so far.
//   const betweenPercentMargins = nodeWidth / parentWidth >= 0.8;
//   if (betweenValueMargins && betweenPercentMargins) {
//     return true;
//   }
//   return false;
// };

// this is necessary to avoid a height of 4.999999523162842.
const numToAutoFixed = (num) => {
    return num.toFixed(2).replace(/\.00$/, "");
};

const formatWithJSX = (property, isJsx, value) => {
    // convert font-size to fontSize.
    const jsx_property = property
        .split("-")
        .map((d, i) => (i > 0 ? d.charAt(0).toUpperCase() + d.slice(1) : d))
        .join("");
    if (typeof value === "number") {
        if (isJsx) {
            return `${jsx_property}: ${numToAutoFixed(value)}, `;
        }
        else {
            return `${property}: ${numToAutoFixed(value)}px; `;
        }
    }
    else {
        if (isJsx) {
            return `${jsx_property}: '${value}', `;
        }
        else {
            return `${property}: ${value}; `;
        }
    }
};

const tailwindSizePartial = (node) => {
    const size = nodeWidthHeight(node, true);
    let w = "";
    if (typeof size.width === "number") {
        w += `w-${pxToLayoutSize(size.width)} `;
    }
    else if (typeof size.width === "string") {
        if (size.width === "full" &&
            node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "HORIZONTAL") {
            w += `flex-1 `;
        }
        else {
            w += `w-${size.width} `;
        }
    }
    let h = "";
    // console.log("sizeResults is ", sizeResult, node);
    if (typeof size.height === "number") {
        h = `h-${pxToLayoutSize(size.height)} `;
    }
    else if (typeof size.height === "string") {
        if (size.height === "full" &&
            node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "VERTICAL") {
            h += `flex-1 `;
        }
        else {
            h += `h-${size.height} `;
        }
    }
    return [w, h];
};
/**
 * https://www.w3schools.com/css/css_dimension.asp
 */
const htmlSizeForTailwind = (node, isJSX) => {
    return htmlSizePartialForTailwind(node, isJSX).join("");
};
const htmlSizePartialForTailwind = (node, isJSX) => {
    return [
        formatWithJSX("width", isJSX, node.width),
        formatWithJSX("height", isJSX, node.height),
    ];
};

/**
 * Add padding if necessary.
 * Padding is currently only valid for auto layout.
 * Padding can have values even when AutoLayout is off
 */
const commonPadding = (node) => {
    var _a, _b, _c, _d;
    if ("layoutMode" in node && node.layoutMode !== "NONE") {
        // round the numbers to avoid 5 being different than 5.00001
        // fix it if undefined (in tests)
        node.paddingLeft = Math.round((_a = node.paddingLeft) !== null && _a !== void 0 ? _a : 0);
        node.paddingRight = Math.round((_b = node.paddingRight) !== null && _b !== void 0 ? _b : 0);
        node.paddingTop = Math.round((_c = node.paddingTop) !== null && _c !== void 0 ? _c : 0);
        node.paddingBottom = Math.round((_d = node.paddingBottom) !== null && _d !== void 0 ? _d : 0);
        const arr = {
            horizontal: 0,
            vertical: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
        if (node.paddingLeft > 0 &&
            node.paddingLeft === node.paddingRight &&
            node.paddingLeft === node.paddingBottom &&
            node.paddingTop === node.paddingBottom) {
            return { all: node.paddingLeft };
        }
        else if (node.paddingLeft > 0 && node.paddingLeft === node.paddingRight) {
            // horizontal padding + vertical + individual paddings
            arr.horizontal = node.paddingLeft;
            if (node.paddingTop > 0 && node.paddingTop === node.paddingBottom) {
                arr.vertical = node.paddingTop;
            }
            else {
                if (node.paddingTop > 0) {
                    arr.top = node.paddingTop;
                }
                if (node.paddingBottom > 0) {
                    arr.bottom = node.paddingBottom;
                }
            }
        }
        else if (node.paddingTop > 0 && node.paddingTop === node.paddingBottom) {
            // vertical padding + individual paddings
            arr.vertical = node.paddingBottom;
            if (node.paddingLeft > 0) {
                arr.left = node.paddingLeft;
            }
            if (node.paddingRight > 0) {
                arr.right = node.paddingRight;
            }
        }
        else {
            // individual paddings
            if (node.paddingLeft > 0) {
                arr.left = node.paddingLeft;
            }
            if (node.paddingRight > 0) {
                arr.right = node.paddingRight;
            }
            if (node.paddingTop > 0) {
                arr.top = node.paddingTop;
            }
            if (node.paddingBottom > 0) {
                arr.bottom = node.paddingBottom;
            }
        }
        return arr;
    }
    return null;
};

/**
 * https://tailwindcss.com/docs/margin/
 * example: px-2 py-8
 */
const tailwindPadding = (node) => {
    const padding = commonPadding(node);
    if (!padding) {
        return "";
    }
    if ("all" in padding) {
        return `p-${pxToLayoutSize(padding.all)} `;
    }
    let comp = "";
    // horizontal and vertical, as the default AutoLayout
    if (padding.horizontal) {
        comp += `px-${pxToLayoutSize(padding.horizontal)} `;
    }
    if (padding.vertical) {
        comp += `py-${pxToLayoutSize(padding.vertical)} `;
    }
    // if left and right exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.left && padding.right) {
        const left = pxToLayoutSize(padding.left);
        const right = pxToLayoutSize(padding.right);
        if (left === right) {
            comp += `px-${left} `;
        }
        else {
            comp += `pl-${left} pr-${right} `;
        }
    }
    else if (padding.left) {
        comp += `pl-${pxToLayoutSize(padding.left)} `;
    }
    else if (padding.right) {
        comp += `pr-${pxToLayoutSize(padding.right)} `;
    }
    // if top and bottom exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.top && padding.bottom) {
        const top = pxToLayoutSize(padding.top);
        const bottom = pxToLayoutSize(padding.bottom);
        if (top === bottom) {
            comp += `py-${top} `;
        }
        else {
            comp += `pt-${top} pb-${bottom} `;
        }
    }
    else if (padding.top) {
        comp += `pt-${pxToLayoutSize(padding.top)} `;
    }
    else if (padding.bottom) {
        comp += `pb-${pxToLayoutSize(padding.bottom)} `;
    }
    return comp;
};

class TailwindDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        this.attributes = "";
        this.styleSeparator = "";
        this.name = "";
        this.hasFixedSize = false;
        this.isJSX = optIsJSX;
        this.styleSeparator = this.isJSX ? "," : ";";
        this.style = "";
        this.visible = node.visible;
        if (showLayerName) {
            this.name = node.name.replace(" ", "") + " ";
        }
    }
    blend(node) {
        this.attributes += tailwindVisibility(node);
        this.attributes += tailwindRotation(node);
        this.attributes += tailwindOpacity(node);
        return this;
    }
    border(node) {
        this.attributes += tailwindBorderWidth(node);
        this.attributes += tailwindBorderRadius(node);
        this.customColor(node.strokes, "border");
        return this;
    }
    position(node, parentId, isRelative = false) {
        const position = tailwindPosition(node, parentId, this.hasFixedSize);
        if (position === "absoluteManualLayout" && node.parent) {
            // tailwind can't deal with absolute layouts.
            const [parentX, parentY] = parentCoordinates(node.parent);
            const left = node.x - parentX;
            const top = node.y - parentY;
            this.style += formatWithJSX("left", this.isJSX, left);
            this.style += formatWithJSX("top", this.isJSX, top);
            if (!isRelative) {
                this.attributes += "absolute ";
            }
        }
        else {
            this.attributes += position;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-color/
     * example: text-blue-500
     * example: text-opacity-25
     * example: bg-blue-500
     */
    customColor(paint, kind) {
        // visible is true or undefinied (tests)
        if (this.visible !== false) {
            let gradient = "";
            if (kind === "bg") {
                gradient = tailwindGradientFromFills(paint);
            }
            if (gradient) {
                this.attributes += gradient;
            }
            else {
                this.attributes += tailwindColorFromFills(paint, kind);
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/box-shadow/
     * example: shadow
     */
    shadow(node) {
        this.attributes += tailwindShadow(node);
        return this;
    }
    // must be called before Position, because of the hasFixedSize attribute.
    widthHeight(node) {
        // if current element is relative (therefore, children are absolute)
        // or current element is one of the absoltue children and has a width or height > w/h-64
        var _a;
        if ("isRelative" in node && node.isRelative === true) {
            this.style += htmlSizeForTailwind(node, this.isJSX);
        }
        else if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.isRelative) === true ||
            node.width > 384 ||
            node.height > 384) {
            // to avoid mixing html and tailwind sizing too much, only use html sizing when absolutely necessary.
            // therefore, if only one attribute is larger than 256, only use the html size in there.
            const [tailwindWidth, tailwindHeight] = tailwindSizePartial(node);
            const [htmlWidth, htmlHeight] = htmlSizePartialForTailwind(node, this.isJSX);
            // when textAutoResize is NONE or WIDTH_AND_HEIGHT, it has a defined width.
            if (node.type !== "TEXT" || node.textAutoResize !== "WIDTH_AND_HEIGHT") {
                if (node.width > 384) {
                    this.style += htmlWidth;
                }
                else {
                    this.attributes += tailwindWidth;
                }
                this.hasFixedSize = htmlWidth !== "";
            }
            // when textAutoResize is NONE has a defined height.
            if (node.type !== "TEXT" || node.textAutoResize === "NONE") {
                if (node.width > 384) {
                    this.style += htmlHeight;
                }
                else {
                    this.attributes += tailwindHeight;
                }
                this.hasFixedSize = htmlHeight !== "";
            }
        }
        else {
            const partial = tailwindSizePartial(node);
            // Width
            if (node.type !== "TEXT" || node.textAutoResize !== "WIDTH_AND_HEIGHT") {
                this.attributes += partial[0];
            }
            // Height
            if (node.type !== "TEXT" || node.textAutoResize === "NONE") {
                this.attributes += partial[1];
            }
            this.hasFixedSize = partial[0] !== "" && partial[1] !== "";
        }
        return this;
    }
    autoLayoutPadding(node) {
        this.attributes += tailwindPadding(node);
        return this;
    }
    removeTrailingSpace() {
        if (this.attributes.length > 0 && this.attributes.slice(-1) === " ") {
            this.attributes = this.attributes.slice(0, -1);
        }
        if (this.style.length > 0 && this.style.slice(-1) === " ") {
            this.style = this.style.slice(0, -1);
        }
        return this;
    }
    build(additionalAttr = "") {
        this.attributes = this.name + additionalAttr + this.attributes;
        this.removeTrailingSpace();
        if (this.style) {
            if (this.isJSX) {
                this.style = ` style={{${this.style}}}`;
            }
            else {
                this.style = ` style="${this.style}"`;
            }
        }
        if (!this.attributes && !this.style) {
            return "";
        }
        const classOrClassName = this.isJSX ? "className" : "class";
        return ` ${classOrClassName}="${this.attributes}"${this.style}`;
    }
    reset() {
        this.attributes = "";
    }
}

class TailwindTextBuilder extends TailwindDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        super(node, showLayerName, optIsJSX);
    }
    // must be called before Position method
    textAutoSize(node) {
        if (node.textAutoResize === "NONE") {
            // going to be used for position
            this.hasFixedSize = true;
        }
        this.widthHeight(node);
        return this;
    }
    // todo fontFamily
    //  fontFamily(node: AltTextNode): this {
    //    return this;
    //  }
    /**
     * https://tailwindcss.com/docs/font-size/
     * example: text-md
     */
    fontSize(node) {
        // example: text-md
        if (node.fontSize !== figma.mixed) {
            const value = pxToFontSize(node.fontSize);
            this.attributes += `text-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/font-style/
     * example: font-extrabold
     * example: italic
     */
    fontStyle(node) {
        if (node.fontName !== figma.mixed) {
            const lowercaseStyle = node.fontName.style.toLowerCase();
            if (lowercaseStyle.match("italic")) {
                this.attributes += "italic ";
            }
            if (lowercaseStyle.match("regular")) {
                // ignore the font-style when regular (default)
                return this;
            }
            const value = node.fontName.style
                .replace("italic", "")
                .replace(" ", "")
                .toLowerCase();
            this.attributes += `font-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/letter-spacing/
     * example: tracking-widest
     */
    letterSpacing(node) {
        const letterSpacing = commonLetterSpacing(node);
        if (letterSpacing > 0) {
            const value = pxToLetterSpacing(letterSpacing);
            this.attributes += `tracking-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/line-height/
     * example: leading-3
     */
    lineHeight(node) {
        const lineHeight = commonLineHeight(node);
        if (lineHeight > 0) {
            const value = pxToLineHeight(lineHeight);
            this.attributes += `leading-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-align/
     * example: text-justify
     */
    textAlign(node) {
        // if alignHorizontal is LEFT, don't do anything because that is native
        // only undefined in testing
        if (node.textAlignHorizontal && node.textAlignHorizontal !== "LEFT") {
            // todo when node.textAutoResize === "WIDTH_AND_HEIGHT" and there is no \n in the text, this can be ignored.
            switch (node.textAlignHorizontal) {
                case "CENTER":
                    this.attributes += `text-center `;
                    break;
                case "RIGHT":
                    this.attributes += `text-right `;
                    break;
                case "JUSTIFIED":
                    this.attributes += `text-justify `;
                    break;
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-transform/
     * example: uppercase
     */
    textTransform(node) {
        if (node.textCase === "LOWER") {
            this.attributes += "lowercase ";
        }
        else if (node.textCase === "TITLE") {
            this.attributes += "capitalize ";
        }
        else if (node.textCase === "UPPER") {
            this.attributes += "uppercase ";
        }
        else if (node.textCase === "ORIGINAL") ;
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-decoration/
     * example: underline
     */
    textDecoration(node) {
        if (node.textDecoration === "UNDERLINE") {
            this.attributes += "underline ";
        }
        else if (node.textDecoration === "STRIKETHROUGH") {
            this.attributes += "line-through ";
        }
        return this;
    }
    reset() {
        this.attributes = "";
    }
}

// Convert generic named weights to numbers, which is the way tailwind understands
const convertFontWeight = (weight) => {
    // change extra-light to extralight
    weight = weight.replace(" ", "").replace("-", "").toLowerCase();
    switch (weight) {
        case "thin":
            return "100";
        case "extralight":
            return "200";
        case "light":
            return "300";
        case "regular":
            return "400";
        case "medium":
            return "500";
        case "semibold":
            return "600";
        case "bold":
            return "700";
        case "extrabold":
            return "800";
        case "heavy":
            return "800";
        case "black":
            return "900";
        default:
            return null;
    }
};

const retrieveTailwindText = (sceneNode) => {
    // convert to AltNode and then flatten it. Conversion is necessary because of [tailwindText]
    const selectedText = deepFlatten$1(sceneNode);
    const textStr = [];
    selectedText.forEach((node) => {
        var _a, _b;
        if (node.type === "TEXT") {
            const attr = new TailwindTextBuilder(node, false, false)
                .blend(node)
                .position(node, (_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "")
                .textAutoSize(node)
                .fontSize(node)
                .fontStyle(node)
                .letterSpacing(node)
                .lineHeight(node)
                .textDecoration(node)
                .textAlign(node)
                .customColor(node.fills, "text")
                .textTransform(node)
                .removeTrailingSpace();
            const splittedChars = node.characters.split("\n");
            const charsWithLineBreak = splittedChars.length > 1
                ? node.characters.split("\n").join("<br/>")
                : node.characters;
            const black = {
                r: 0,
                g: 0,
                b: 0,
            };
            let contrastBlack = 21;
            const fill = retrieveTopFill(node.fills);
            if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
                contrastBlack = calculateContrastRatio$1(fill.color, black);
            }
            textStr.push({
                name: node.name,
                attr: attr.attributes,
                full: `<p class="${attr.attributes}">${charsWithLineBreak}</p>`,
                style: style(node),
                contrastBlack: contrastBlack,
            });
        }
    });
    // retrieve only unique texts (attr + name)
    // from https://stackoverflow.com/a/18923480/4418073
    const unique = {};
    const distinct = [];
    textStr.forEach(function (x) {
        if (!unique[x.attr + x.name]) {
            distinct.push(x);
            unique[x.attr + x.name] = true;
        }
    });
    return distinct;
};
const style = (node) => {
    let comp = "";
    if (node.fontName !== figma.mixed) {
        const lowercaseStyle = node.fontName.style.toLowerCase();
        if (lowercaseStyle.match("italic")) {
            comp += "font-style: italic; ";
        }
        const value = node.fontName.style
            .replace("italic", "")
            .replace(" ", "")
            .toLowerCase();
        const weight = convertFontWeight(value);
        if (weight) {
            comp += `font-weight: ${weight}; `;
        }
    }
    if (node.fontSize !== figma.mixed) {
        comp += `font-size: ${Math.min(node.fontSize, 24)}; `;
    }
    const color = convertColor(node.fills);
    if (color) {
        comp += `color: ${color}; `;
    }
    return comp;
};
function deepFlatten$1(arr) {
    let result = [];
    arr.forEach((d) => {
        if ("children" in d) {
            result = result.concat(deepFlatten$1([...d.children]));
        }
        else {
            if (d.type === "TEXT") {
                result.push(d);
            }
        }
    });
    return result;
}
const convertColor = (fills) => {
    // kind can be text, bg, border...
    // [when testing] fills can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        return tailwindNearestColor(rgbTo6hex(fill.color));
    }
    return undefined;
};
// from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
function calculateContrastRatio$1(color1, color2) {
    const color1luminance = luminance$1(color1);
    const color2luminance = luminance$1(color2);
    const contrast = color1luminance > color2luminance
        ? (color2luminance + 0.05) / (color1luminance + 0.05)
        : (color1luminance + 0.05) / (color2luminance + 0.05);
    return 1 / contrast;
}
function luminance$1(color) {
    const a = [color.r * 255, color.g * 255, color.b * 255].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Retrieve the SOLID color for SwiftUI when existent, otherwise ""
 */
const swiftuiColorFromFills = (fills) => {
    var _a;
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        // todo maybe ignore text color when it is black?
        // opacity should only be null on set, not on get. But better be prevented.
        const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
        return swiftuiColor(fill.color, opacity);
    }
    else if ((fill === null || fill === void 0 ? void 0 : fill.type) === "GRADIENT_LINEAR") {
        return swiftuiGradient(fill);
    }
    else if ((fill === null || fill === void 0 ? void 0 : fill.type) === "IMAGE") {
        // placeholder for the image. Apparently SwiftUI doesn't support Image.network(...).
        return swiftuiColor({
            r: 0.5,
            g: 0.23,
            b: 0.27,
        }, 0.5);
    }
    return "";
};
const swiftuiGradient = (fill) => {
    const direction = gradientDirection$1(gradientAngle(fill));
    const colors = fill.gradientStops
        .map((d) => {
        return swiftuiColor(d.color, d.color.a);
    })
        .join(", ");
    return `LinearGradient(gradient: Gradient(colors: [${colors}]), ${direction})`;
};
const gradientDirection$1 = (angle) => {
    switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
        case 0:
            return "startPoint: .leading, endPoint: .trailing";
        case 45:
            return "startPoint: .topLeading, endPoint: .bottomTrailing";
        case 90:
            return "startPoint: .top, endPoint: .bottom";
        case 135:
            return "startPoint: .topTrailing, endPoint: .bottomLeading";
        case -45:
            return "startPoint: .bottomLeading, endPoint: .topTrailing";
        case -90:
            return "startPoint: .bottom, endPoint: .top";
        case -135:
            return "startPoint: .bottomTrailing, endPoint: .topLeading";
        default:
            // 180 and -180
            return "startPoint: .trailing, endPoint: .leading";
    }
};
const swiftuiColor = (color, opacity) => {
    // Using Color.black.opacity() is not reccomended, as per:
    // https://stackoverflow.com/a/56824114/4418073
    // Therefore, only use Color.black/white when opacity is 1.
    if (color.r + color.g + color.b === 0 && opacity === 1) {
        return "Color.black";
    }
    if (color.r + color.g + color.b === 3 && opacity === 1) {
        return "Color.white";
    }
    const r = "red: " + numToAutoFixed(color.r);
    const g = "green: " + numToAutoFixed(color.g);
    const b = "blue: " + numToAutoFixed(color.b);
    const opacityAttr = opacity !== 1.0 ? `, opacity: ${numToAutoFixed(opacity)}` : "";
    return `Color(${r}, ${g}, ${b}${opacityAttr})`;
};

/**
 * Retrieve the SOLID color for Flutter when existent, otherwise ""
 */
const flutterColorFromFills = (fills) => {
    var _a;
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        // todo maybe ignore text color when it is black?
        const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
        return `color: ${flutterColor(fill.color, opacity)},`;
    }
    return "";
};
const flutterBoxDecorationColor = (fills) => {
    var _a;
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
        return `\ncolor: ${flutterColor(fill.color, opacity)},`;
    }
    else if ((fill === null || fill === void 0 ? void 0 : fill.type) === "GRADIENT_LINEAR") {
        return `\ngradient: ${flutterGradient(fill)},`;
    }
    return "";
};
const flutterGradient = (fill) => {
    const direction = gradientDirection(gradientAngle(fill));
    const colors = fill.gradientStops
        .map((d) => {
        return flutterColor(d.color, d.color.a);
    })
        .join(", ");
    return `LinearGradient(${direction}, colors: [${colors}], )`;
};
const gradientDirection = (angle) => {
    switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
        case 0:
            return "begin: Alignment.centerLeft, end: Alignment.centerRight";
        case 45:
            return "begin: Alignment.topLeft, end: Alignment.bottomRight";
        case 90:
            return "begin: Alignment.topCenter, end: Alignment.bottomCenter";
        case 135:
            return "begin: Alignment.topRight, end: Alignment.bottomLeft";
        case -45:
            return "begin: Alignment.bottomLeft, end: Alignment.topRight";
        case -90:
            return "begin: Alignment.bottomCenter, end: Alignment.topCenter";
        case -135:
            return "begin: Alignment.bottomRight, end: Alignment.topLeft";
        default:
            // 180 and -180
            return "begin: Alignment.centerRight, end: Alignment.centerLeft";
    }
};
const flutterColor = (color, opacity) => {
    // todo use Colors.black.opacity()
    if (color.r + color.g + color.b === 0 && opacity === 1) {
        return "Colors.black";
    }
    if (color.r + color.g + color.b === 3 && opacity === 1) {
        return "Colors.white";
    }
    return `Color(0x${rgbTo8hex(color, opacity)})`;
};

// retrieve the SOLID color on HTML
const htmlColorFromFills = (fills) => {
    // kind can be text, bg, border...
    // [when testing] fills can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "SOLID") {
        // if fill isn't visible, it shouldn't be painted.
        return htmlColor(fill.color, fill.opacity);
    }
    return "";
};
const htmlColor = (color, alpha = 1) => {
    const r = numToAutoFixed(color.r * 255);
    const g = numToAutoFixed(color.g * 255);
    const b = numToAutoFixed(color.b * 255);
    const a = numToAutoFixed(alpha !== null && alpha !== void 0 ? alpha : 1);
    if (color.r === 1 && color.g === 1 && color.b === 1 && alpha === 1) {
        return "white";
    }
    if (color.r === 0 && color.g === 0 && color.b === 0 && alpha === 1) {
        return "black";
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const htmlGradientFromFills = (fills) => {
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === "GRADIENT_LINEAR") {
        return htmlGradient(fill);
    }
    return "";
};
// This was separated from htmlGradient because it is going to be used in the plugin UI and it wants all gradients, not only the top one.
const htmlGradient = (fill) => {
    // add 90 to be correct in HTML.
    const angle = (gradientAngle(fill) + 90).toFixed(0);
    const mappedFill = fill.gradientStops
        .map((d) => {
        // only add position to fractional
        const position = d.position > 0 && d.position < 1
            ? " " + (100 * d.position).toFixed(0) + "%"
            : "";
        return `${htmlColor(d.color, d.color.a)}${position}`;
    })
        .join(", ");
    return `linear-gradient(${angle}deg, ${mappedFill})`;
};

class AltRectangleNode {
    constructor() {
        this.type = "RECTANGLE";
    }
}
class AltEllipseNode {
    constructor() {
        this.type = "ELLIPSE";
    }
}
class AltFrameNode {
    constructor() {
        this.type = "FRAME";
    }
}
class AltGroupNode {
    constructor() {
        this.type = "GROUP";
    }
}
class AltTextNode {
    constructor() {
        this.type = "TEXT";
    }
}
// // DOCUMENT
// class AltDocumentNode {
//   type = "DOCUMENT";
//   children = [];
// }
// // PAGE
// class AltPageNode {
//   type = "PAGE";
//   children = [];
//   _selection: Array<SceneNode> = [];
//   get selection() {
//     return this._selection || [];
//   }
//   set selection(value) {
//     this._selection = value;
//   }
// }

/**
 * Large (Default)
 * https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
 */
const swiftuiFontMatcher = (node) => {
    if (node.fontSize === figma.mixed) {
        return "";
    }
    if (node.fontSize <= 11) {
        return ".caption2";
    }
    else if (node.fontSize <= 12) {
        return ".caption";
    }
    else if (node.fontSize <= 13) {
        return ".footnote";
    }
    else if (node.fontSize <= 15) {
        return ".subheadline";
    }
    else if (node.fontSize <= 16) {
        return ".callout";
    }
    else if (node.fontSize <= 17) {
        return ".body";
    }
    else if (node.fontSize <= 20) {
        return ".title3";
    }
    else if (node.fontSize <= 22) {
        return ".title2";
    }
    else if (node.fontSize <= 28) {
        return ".title";
    }
    else {
        return ".largeTitle";
    }
};
/**
 * nine weights — from Ultralight to Black
 * https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
 */
const swiftuiWeightMatcher = (weight) => {
    // yes, "ultraLight" and "semibold" are correct.
    switch (weight) {
        case "100":
            return ".ultraLight";
        case "200":
            return ".thin";
        case "300":
            return ".light";
        case "400":
            return ".regular";
        case "500":
            return ".medium";
        case "600":
            return ".semibold";
        case "700":
            return ".bold";
        case "800":
            return ".heavy";
        case "900":
            return ".black";
    }
};

const swiftuiShadow = (node) => {
    if (!node.effects || node.effects.length === 0) {
        return "";
    }
    const dropShadow = node.effects.filter((d) => d.type === "DROP_SHADOW" && d.visible !== false);
    if (dropShadow.length === 0) {
        return "";
    }
    // retrieve first shadow.
    const shadow = dropShadow[0];
    let comp = "";
    const color = shadow.color;
    // set color when not black with 0.25 of opacity, which is the Figma default. Round the alpha now to avoid rounding issues.
    const a = numToAutoFixed(color.a);
    if (color.r + color.g + color.b === 0 && a !== "0.25") {
        const r = numToAutoFixed(color.r);
        const g = numToAutoFixed(color.g);
        const b = numToAutoFixed(color.b);
        comp += `color: Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${a}), `;
    }
    comp += `radius: ${numToAutoFixed(shadow.radius)}`;
    if (shadow.offset.x !== shadow.offset.y) {
        const x = shadow.offset.x > 0 ? `x: ${numToAutoFixed(shadow.offset.x)}` : "";
        const y = shadow.offset.y > 0 ? `y: ${numToAutoFixed(shadow.offset.y)}` : "";
        // add initial comma since this is an optional paramater and radius must come first.
        comp += ", ";
        if (x && y) {
            comp += `${x}, ${y}`;
        }
        else {
            // no comma in the middle, since only one of them will be valid
            comp += `${x}${y}`;
        }
    }
    return `\n.shadow(${comp})`;
};
const swiftuiBlur = (node) => {
    if (!node.effects || node.effects.length === 0) {
        return "";
    }
    const layerBlur = node.effects.filter((d) => d.type === "LAYER_BLUR" && d.visible !== false);
    if (layerBlur.length === 0) {
        return "";
    }
    // retrieve first blur.
    const blur = layerBlur[0].radius;
    return `\n.blur(radius: ${numToAutoFixed(blur)})`;
};

/**
 * Generate border or an overlay with stroke.
 * In Flutter and Tailwind, setting the border sets for both fill and stroke. Not in SwiftUI.
 * This method, therefore, only serves for the stroke/border and not for roundness of the layer behind.
 * Also, it only works when there is a fill. When there isn't, [swiftuiShapeStroke] should be used.
 *
 * @param node with hopefully a fill object in [node.strokes].
 * @returns a string with overlay, when there node has a corner radius, or just border. If no color is found in node.strokes, return "".
 */
const swiftuiBorder = (node) => {
    if (node.type === "GROUP" || !node.strokes || node.strokes.length === 0) {
        return "";
    }
    const propStrokeColor = swiftuiColorFromFills(node.strokes);
    const lW = numToAutoFixed(node.strokeWeight);
    const fill = retrieveTopFill(node.fills);
    if (propStrokeColor && node.strokeWeight) {
        const roundRect = swiftuiRoundedRectangle(node);
        if (roundRect) {
            return `\n.overlay(${roundRect}.stroke(${propStrokeColor}, lineWidth: ${lW}))`;
        }
        else if (node.type === "RECTANGLE" && !fill) {
            // this scenario was taken care already by [swiftuiShapeStroke]
            return "";
        }
        if (node.type === "ELLIPSE" && fill) {
            // add overlay, to not loose the current fill
            return `\n.overlay(Ellipse().stroke(${propStrokeColor}, lineWidth: ${lW}))`;
        }
        else if (node.type === "ELLIPSE" && !fill) {
            // this scenario was taken care already by [swiftuiShapeStroke]
            return "";
        }
        // border can be put before or after frame()
        return `\n.border(${propStrokeColor}, width: ${lW})`;
    }
    return "";
};
// .stroke() must be called near the shape declaration, but .overlay() must be called after frame().
// Stroke and Border were split. This method deals with stroke, and the other one with overlay.
const swiftuiShapeStroke = (node) => {
    if (node.type === "GROUP" || !node.strokes || node.strokes.length === 0) {
        return "";
    }
    const propStrokeColor = swiftuiColorFromFills(node.strokes);
    const lW = numToAutoFixed(node.strokeWeight);
    if (propStrokeColor && node.strokeWeight) {
        const fill = retrieveTopFill(node.fills);
        // only add stroke when there isn't a fill set.
        if (node.type === "ELLIPSE" && !fill) {
            return `\n.stroke(${propStrokeColor}, lineWidth: ${lW})`;
        }
        const roundRect = swiftuiRoundedRectangle(node);
        if (!roundRect && node.type === "RECTANGLE" && !fill) {
            return `\n.stroke(${propStrokeColor}, lineWidth: ${lW})`;
        }
    }
    return "";
};
/**
 * Produce a Rectangle with border radius.
 * The reason this was extracted into its own method is for reusability in [swiftuiBorder],
 * where a RoundedRectangle is needed again to be part of the overlay.
 *
 * @param node with cornerRadius and topLeftRadius properties.
 * @returns a string with RoundedRectangle, if node has a corner larger than zero; else "".
 */
const swiftuiCornerRadius = (node) => {
    if ("cornerRadius" in node &&
        node.cornerRadius !== figma.mixed &&
        node.cornerRadius > 0) {
        return numToAutoFixed(node.cornerRadius);
    }
    else {
        if (!("topLeftRadius" in node)) {
            return "";
        }
        // SwiftUI doesn't support individual corner radius, so get the largest one
        const maxBorder = Math.max(node.topLeftRadius, node.topRightRadius, node.bottomLeftRadius, node.bottomRightRadius);
        if (maxBorder > 0) {
            return numToAutoFixed(maxBorder);
        }
    }
    return "";
};
/**
 * Produce a Rectangle with border radius.
 * The reason this was extracted into its own method is for reusability in [swiftuiBorder],
 * where a RoundedRectangle is needed again to be part of the overlay.
 *
 * @param node with cornerRadius and topLeftRadius properties.
 * @returns a string with RoundedRectangle, if node has a corner larger than zero; else "".
 */
const swiftuiRoundedRectangle = (node) => {
    const corner = swiftuiCornerRadius(node);
    if (corner) {
        return `RoundedRectangle(cornerRadius: ${corner})`;
    }
    return "";
};

// Add padding if necessary!
// This must happen before Stack or after the Positioned, but not before.
const swiftuiPadding = (node) => {
    if (!("layoutMode" in node)) {
        return "";
    }
    const padding = commonPadding(node);
    if (!padding) {
        return "";
    }
    if ("all" in padding) {
        return `\n.padding(${numToAutoFixed(padding.all)})`;
    }
    let comp = "";
    // horizontal and vertical, as the default AutoLayout
    if (padding.horizontal) {
        comp += `\n.padding(.horizontal, ${numToAutoFixed(padding.horizontal)})`;
    }
    if (padding.vertical) {
        comp += `\n.padding(.vertical, ${numToAutoFixed(padding.vertical)})`;
    }
    // if left and right exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.left) {
        comp += `\n.padding(.leading, ${numToAutoFixed(padding.left)})`;
    }
    if (padding.right) {
        comp += `\n.padding(.trailing, ${numToAutoFixed(padding.right)})`;
    }
    if (padding.top) {
        comp += `\n.padding(.top, ${numToAutoFixed(padding.top)})`;
    }
    if (padding.bottom) {
        comp += `\n.padding(.bottom, ${numToAutoFixed(padding.bottom)})`;
    }
    return comp;
};

const swiftuiSize = (node) => {
    const size = nodeWidthHeight(node, false);
    // if width is set as maxWidth, height must also be set as maxHeight (not height)
    const shouldExtend = size.height === "full" || size.width === "full";
    // this cast will always be true, since nodeWidthHeight was called with false to relative.
    let propWidth = "";
    if (typeof size.width === "number") {
        const w = numToAutoFixed(size.width);
        if (shouldExtend) {
            propWidth = `maxWidth: ${w}`;
        }
        else {
            propWidth = `width: ${w}`;
        }
    }
    else if (size.width === "full") {
        propWidth = `maxWidth: .infinity`;
    }
    let propHeight = "";
    if (typeof size.height === "number") {
        const h = numToAutoFixed(size.height);
        if (shouldExtend) {
            propHeight = `maxHeight: ${h}`;
        }
        else {
            propHeight = `height: ${h}`;
        }
    }
    else if (size.height === "full") {
        propHeight = `maxHeight: .infinity`;
    }
    return [propWidth, propHeight];
};

const swiftuiPosition = (node, parentId = "") => {
    // avoid adding Positioned() when parent is not a Stack(), which can happen at the beggining
    if (!node.parent || parentId === node.parent.id) {
        return "";
    }
    // check if view is in a stack. Group and Frames must have more than 1 element
    if (node.parent.isRelative === true) {
        const [parentX, parentY] = parentCoordinates(node.parent);
        const parentCenterX = parentX + node.parent.width / 2;
        const parentCenterY = parentY + node.parent.height / 2;
        const pointX = node.x - parentX + node.width / 2;
        const pointY = node.y - parentY + node.height / 2;
        // verify if items are centered, with a small threshold.
        // use abs because they can be negative.
        if (Math.abs(parentCenterX - pointX) < 2 &&
            Math.abs(parentCenterY - pointY) < 2) {
            return "";
        }
        else {
            const x = numToAutoFixed(pointX - parentCenterX);
            const y = numToAutoFixed(pointY - parentCenterY);
            return `\n.offset(x: ${x}, y: ${y})`;
        }
    }
    return "";
};

/**
 * https://developer.apple.com/documentation/swiftui/view/opacity(_:)
 */
const swiftuiOpacity = (node) => {
    if (node.opacity !== undefined && node.opacity !== 1) {
        return `\n.opacity(${numToAutoFixed(node.opacity)})`;
    }
    return "";
};
/**
 * https://developer.apple.com/documentation/swiftui/view/hidden()
 */
const swiftuiVisibility = (node) => {
    // [when testing] node.visible can be undefined
    if (node.visible !== undefined && node.visible === false) {
        return `\n.hidden()`;
    }
    return "";
};
/**
 * https://developer.apple.com/documentation/swiftui/modifiedcontent/rotationeffect(_:anchor:)
 */
const swiftuiRotation = (node) => {
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        return `.rotationEffect(.degrees(${numToAutoFixed(node.rotation)}))`;
    }
    return "";
};
/**
 * https://developer.apple.com/documentation/swiftui/blendmode
 */
const swiftuiBlendMode = (node) => {
    const fromBlendEnum = blendModeEnum(node);
    if (fromBlendEnum) {
        return `\n.blendMode(${fromBlendEnum})`;
    }
    return "";
};
const blendModeEnum = (node) => {
    switch (node.blendMode) {
        case "COLOR":
            return ".color";
        case "COLOR_BURN":
            return ".colorBurn";
        case "COLOR_DODGE":
            return ".colorDodge";
        case "DIFFERENCE":
            return ".difference";
        case "EXCLUSION":
            return ".exclusion";
        case "HARD_LIGHT":
            return ".hardLight";
        case "HUE":
            return ".hue";
        case "LIGHTEN":
            return ".lighten";
        case "LUMINOSITY":
            return ".luminosity";
        case "MULTIPLY":
            return ".multiply";
        case "OVERLAY":
            return ".overlay";
        case "SATURATION":
            return ".saturation";
        case "SCREEN":
            return ".screen";
        case "SOFT_LIGHT":
            return ".softLight";
        default:
            // PASS_THROUGH, NORMAL, LINEAR_DODGE
            return "";
    }
};

class SwiftuiDefaultBuilder {
    constructor() {
        this.modifiers = "";
    }
    blend(node) {
        this.modifiers += swiftuiVisibility(node);
        this.modifiers += swiftuiRotation(node);
        this.modifiers += swiftuiOpacity(node);
        this.modifiers += swiftuiBlendMode(node);
        return this;
    }
    position(node, parentId) {
        this.modifiers += swiftuiPosition(node, parentId);
        return this;
    }
    shapeBorder(node) {
        this.modifiers += swiftuiShapeStroke(node);
        return this;
    }
    layerBorder(node) {
        this.modifiers += swiftuiBorder(node);
        return this;
    }
    shapeBackground(node) {
        if (node.type !== "ELLIPSE" && node.type !== "RECTANGLE") {
            return this;
        }
        const fillColor = swiftuiColorFromFills(node.fills);
        if (fillColor) {
            this.modifiers += `\n.fill(${fillColor})`;
        }
        return this;
    }
    layerBackground(node) {
        if (node.type !== "FRAME") {
            return this;
        }
        const fillColor = swiftuiColorFromFills(node.fills);
        if (fillColor) {
            this.modifiers += `\n.background(${fillColor})`;
        }
        // add corner to the background. It needs to come after the Background, and since we already in the if, let's add it here.
        const corner = swiftuiCornerRadius(node);
        // it seems this is necessary even in RoundedRectangle
        if (corner) {
            this.modifiers += `\n.cornerRadius(${corner})`;
        }
        return this;
    }
    effects(node) {
        if (node.type === "GROUP") {
            return this;
        }
        this.modifiers += swiftuiBlur(node);
        this.modifiers += swiftuiShadow(node);
        return this;
    }
    widthHeight(node) {
        const [propWidth, propHeight] = swiftuiSize(node);
        if (propWidth || propHeight) {
            // add comma if propWidth and propHeight both exists
            const comma = propWidth && propHeight ? ", " : "";
            this.modifiers += `\n.frame(${propWidth}${comma}${propHeight})`;
        }
        return this;
    }
    autoLayoutPadding(node) {
        this.modifiers += swiftuiPadding(node);
        return this;
    }
    build() {
        return this.modifiers;
    }
}

class SwiftuiTextBuilder extends SwiftuiDefaultBuilder {
    constructor() {
        super(...arguments);
        this.textStyle = (node) => {
            // for some reason this must be set before the multilineTextAlignment
            if (node.fontName !== figma.mixed) {
                const fontWeight = convertFontWeight(node.fontName.style);
                if (fontWeight && fontWeight !== "400") {
                    const weight = swiftuiWeightMatcher(fontWeight);
                    this.modifiers += `\n.fontWeight(${weight})`;
                }
            }
            // https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
            const retrievedFont = swiftuiFontMatcher(node);
            if (retrievedFont) {
                this.modifiers += `\n.font(${retrievedFont})`;
            }
            // todo might be a good idea to calculate the width based on the font size and check if view is really multi-line
            if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
                // it can be confusing, but multilineTextAlignment is always set to left by default.
                if (node.textAlignHorizontal === "CENTER") {
                    this.modifiers += `\n.multilineTextAlignment(.center)`;
                }
                else if (node.textAlignHorizontal === "RIGHT") {
                    this.modifiers += `\n.multilineTextAlignment(.trailing)`;
                }
            }
            return this;
        };
        this.letterSpacing = (node) => {
            const letterSpacing = commonLetterSpacing(node);
            if (letterSpacing > 0) {
                this.modifiers += `\n.tracking(${numToAutoFixed(letterSpacing)})`;
            }
            return this;
        };
        // the difference between kerning and tracking is that tracking spaces everything, kerning keeps lignatures,
        // Figma spaces everything, so we are going to use tracking.
        this.lineHeight = (node) => {
            const letterHeight = commonLineHeight(node);
            if (letterHeight > 0) {
                this.modifiers += `\n.lineSpacing(${numToAutoFixed(letterHeight)})`;
            }
            return this;
        };
        this.wrapTextAutoResize = (node) => {
            const [propWidth, propHeight] = swiftuiSize(node);
            let comp = "";
            if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
                comp += propWidth;
            }
            if (node.textAutoResize === "NONE") {
                // if it is NONE, it isn't WIDTH_AND_HEIGHT, which means the comma must be added.
                comp += ", ";
                comp += propHeight;
            }
            if (comp.length > 0) {
                const align = this.textAlignment(node);
                return `\n.frame(${comp}${align})`;
            }
            return "";
        };
        // SwiftUI has two alignments for Text, when it is a single line and when it is multiline. This one is for single line.
        this.textAlignment = (node) => {
            let hAlign = "";
            if (node.textAlignHorizontal === "LEFT") {
                hAlign = "leading";
            }
            else if (node.textAlignHorizontal === "RIGHT") {
                hAlign = "trailing";
            }
            let vAlign = "";
            if (node.textAlignVertical === "TOP") {
                vAlign = "top";
            }
            else if (node.textAlignVertical === "BOTTOM") {
                vAlign = "bottom";
            }
            if (hAlign && !vAlign) {
                // result should be leading or trailing
                return `, alignment: .${hAlign}`;
            }
            else if (!hAlign && vAlign) {
                // result should be top or bottom
                return `, alignment: .${vAlign}`;
            }
            else if (hAlign && vAlign) {
                // make the first char from hAlign uppercase
                const hAlignUpper = hAlign.charAt(0).toUpperCase() + hAlign.slice(1);
                // result should be topLeading, topTrailing, bottomLeading or bottomTrailing
                return `, alignment: .${vAlign}${hAlignUpper}`;
            }
            // when they are centered
            return "";
        };
    }
    reset() {
        this.modifiers = "";
    }
    textAutoSize(node) {
        this.modifiers += this.wrapTextAutoResize(node);
        return this;
    }
    textDecoration(node) {
        // https://developer.apple.com/documentation/swiftui/text/underline(_:color:)
        if (node.textDecoration === "UNDERLINE") {
            this.modifiers += "\n.underline()";
        }
        // https://developer.apple.com/documentation/swiftui/text/strikethrough(_:color:)
        if (node.textDecoration === "STRIKETHROUGH") {
            this.modifiers += "\n.strikethrough()";
        }
        // https://developer.apple.com/documentation/swiftui/text/italic()
        if (node.fontName !== figma.mixed &&
            node.fontName.style.toLowerCase().match("italic")) {
            this.modifiers += "\n.italic()";
        }
        return this;
    }
}

// From https://github.com/sindresorhus/indent-string
const indentString = (str, indentLevel = 1) => {
    // const options = {
    //   includeEmptyLines: false,
    // };
    // const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    const regex = /^(?!\s*$)/gm;
    return str.replace(regex, " ".repeat(indentLevel * 4));
};

let parentId$4 = "";
const swiftuiMain = (sceneNode, parentIdSrc = "") => {
    parentId$4 = parentIdSrc;
    let result = swiftuiWidgetGenerator(sceneNode, 0);
    // remove the initial \n that is made in Container.
    if (result.length > 0 && result.slice(0, 1) === "\n") {
        result = result.slice(1, result.length);
    }
    return result;
};
const swiftuiWidgetGenerator = (sceneNode, indentLevel) => {
    let comp = "";
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    const sceneLen = visibleSceneNode.length;
    visibleSceneNode.forEach((node, index) => {
        if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
            comp += swiftuiContainer(node, indentLevel);
        }
        else if (node.type === "GROUP") {
            comp += swiftuiGroup(node, indentLevel);
        }
        else if (node.type === "FRAME") {
            comp += swiftuiFrame(node, indentLevel);
        }
        else if (node.type === "TEXT") {
            comp += swiftuiText(node, indentLevel);
        }
        // don't add a newline at last element.
        if (index < sceneLen - 1) {
            comp += "\n";
        }
    });
    return comp;
};
// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const swiftuiContainer = (node, indentLevel, children = "") => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return children;
    }
    const modifiers = new SwiftuiDefaultBuilder()
        .shapeBackground(node)
        .shapeBorder(node)
        .blend(node)
        .autoLayoutPadding(node)
        .position(node, parentId$4)
        .widthHeight(node)
        .layerBackground(node)
        .layerBorder(node)
        .effects(node)
        .build();
    let kind = "";
    if (node.type === "RECTANGLE" || (!children && node.type === "FRAME")) {
        // return a different kind of Rectangle when cornerRadius exists
        const roundedRect = swiftuiRoundedRectangle(node);
        if (roundedRect) {
            kind = roundedRect;
        }
        else {
            kind = "Rectangle()";
        }
    }
    else if (node.type === "ELLIPSE") {
        kind = "Ellipse()";
    }
    else {
        kind = children;
    }
    // only add the newline when result is not empty
    const result = (children !== kind ? "\n" : "") + kind + modifiers;
    return indentString(result, indentLevel);
};
const swiftuiGroup = (node, indentLevel) => {
    return swiftuiContainer(node, indentLevel, `\nZStack {${widgetGeneratorWithLimits(node, indentLevel)}\n}`);
};
const swiftuiText = (node, indentLevel) => {
    const builder = new SwiftuiTextBuilder();
    let text = node.characters;
    if (node.textCase === "LOWER") {
        text = text.toLowerCase();
    }
    else if (node.textCase === "UPPER") {
        text = text.toUpperCase();
    }
    const splittedChars = text.split("\n");
    const charsWithLineBreak = splittedChars.length > 1 ? splittedChars.join("\\n") : text;
    const modifier = builder
        .textDecoration(node)
        .textStyle(node)
        .textAutoSize(node)
        .letterSpacing(node)
        .lineHeight(node)
        .blend(node)
        .layerBackground(node)
        .position(node, parentId$4)
        .build();
    const result = `\nText("${charsWithLineBreak}")${modifier}`;
    return indentString(result, indentLevel);
};
const swiftuiFrame = (node, indentLevel) => {
    // when there is a single children, indent should be zero; [swiftuiContainer] will already assign it.
    const updatedIndentLevel = node.children.length === 1 ? 0 : indentLevel + 1;
    const children = widgetGeneratorWithLimits(node, updatedIndentLevel);
    // if there is only one child, there is no need for a HStack of VStack.
    if (node.children.length === 1) {
        return swiftuiContainer(node, indentLevel, children);
        // return swiftuiContainer(node, rowColumn);
    }
    else if (node.layoutMode !== "NONE") {
        const rowColumn = wrapInDirectionalStack(node, children);
        return swiftuiContainer(node, indentLevel, rowColumn);
    }
    else {
        // node.layoutMode === "NONE" && node.children.length > 1
        // children needs to be absolute
        return swiftuiContainer(node, indentLevel, `\nZStack {${children}\n}`);
    }
};
const wrapInDirectionalStack = (node, children) => {
    const rowOrColumn = node.layoutMode === "HORIZONTAL" ? "HStack" : "VStack";
    // retrieve the align based on the most frequent position of children
    // SwiftUI doesn't allow the children to be set individually. And there are different align properties for HStack and VStack.
    let layoutAlign = "";
    const mostFreq = node.counterAxisAlignItems;
    if (node.layoutMode === "VERTICAL") {
        if (mostFreq === "MIN") {
            layoutAlign = "alignment: .leading";
        }
        else if (mostFreq === "MAX") {
            layoutAlign = "alignment: .trailing";
        }
    }
    else {
        if (mostFreq === "MIN") {
            layoutAlign = "alignment: .top";
        }
        else if (mostFreq === "MAX") {
            layoutAlign = "alignment: .bottom";
        }
    }
    // only add comma and a space if layoutAlign has a value
    const comma = layoutAlign ? ", " : "";
    // default spacing for SwiftUI is 16.
    const spacing = Math.round(node.itemSpacing) !== 16
        ? `${comma}spacing: ${numToAutoFixed(node.itemSpacing)}`
        : "";
    return `\n${rowOrColumn}(${layoutAlign}${spacing}) {${children}\n}`;
};
// https://stackoverflow.com/a/20762713
const mostFrequent = (arr) => {
    return arr
        .sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length)
        .pop();
};
// todo should the plugin manually Group items? Ideally, it would detect the similarities and allow a ForEach.
const widgetGeneratorWithLimits = (node, indentLevel) => {
    if (node.children.length < 10) {
        // standard way
        return swiftuiWidgetGenerator(node.children, indentLevel);
    }
    const chunk = 10;
    let strBuilder = "";
    const slicedChildren = node.children.slice(0, 100);
    // I believe no one should have more than 100 items in a single nesting level. If you do, please email me.
    if (node.children.length > 100) {
        strBuilder += `\n// SwiftUI has a 10 item limit in Stacks. By grouping them, it can grow even more. 
// It seems, however, that you have more than 100 items at the same level. Wow!
// This is not yet supported; Limiting to the first 100 items...`;
    }
    // split node.children in arrays of 10, so that it can be Grouped. I feel so guilty of allowing this.
    for (let i = 0, j = slicedChildren.length; i < j; i += chunk) {
        const chunkChildren = slicedChildren.slice(i, i + chunk);
        const strChildren = swiftuiWidgetGenerator(chunkChildren, indentLevel);
        strBuilder += `\nGroup {${strChildren}\n}`;
    }
    return strBuilder;
};

const convertGroupToFrame = (node) => {
    const newNode = new AltFrameNode();
    newNode.id = node.id;
    newNode.name = node.name;
    newNode.x = node.x;
    newNode.y = node.y;
    newNode.width = node.width;
    newNode.height = node.height;
    newNode.rotation = node.rotation;
    newNode.fills = [];
    newNode.strokes = [];
    newNode.effects = [];
    newNode.cornerRadius = 0;
    newNode.layoutMode = "NONE";
    newNode.counterAxisSizingMode = "AUTO";
    newNode.primaryAxisSizingMode = "AUTO";
    newNode.primaryAxisAlignItems = "CENTER";
    newNode.primaryAxisAlignItems = "CENTER";
    newNode.clipsContent = false;
    newNode.layoutGrids = [];
    newNode.gridStyleId = "";
    newNode.guides = [];
    newNode.parent = node.parent;
    // update the children's x and y position. Modify the 'original' node, then pass them.
    updateChildrenXY(node);
    newNode.children = node.children;
    newNode.children.forEach((d) => {
        // update the parent of each child
        d.parent = newNode;
    });
    // don't need to take care of newNode.parent.children because method is recursive.
    // .children =... calls convertGroupToFrame() which returns the correct node
    return newNode;
};
/**
 * Update all children's X and Y value from a Group.
 * Group uses relative values, while Frame use absolute. So child.x - group.x = child.x on Frames.
 * This isn't recursive, because it is going to run from the inner-most to outer-most element. Therefore, it would calculate wrongly otherwise.
 *
 * This must be called with a GroupNode. Param accepts anything because of the recurison.
 * Result of a Group with x,y = (250, 250) and child at (260, 260) must be child at (10, 10)
 */
const updateChildrenXY = (node) => {
    // the second condition is necessary, so it can convert the root
    if (node.type === "GROUP") {
        node.children.forEach((d) => {
            d.x = d.x - node.x;
            d.y = d.y - node.y;
            updateChildrenXY(d);
        });
        return node;
    }
    else {
        return node;
    }
};

/**
 * Add AutoLayout attributes if layout has items aligned (either vertically or horizontally).
 * To make the calculation, the average position of every child, ordered, needs to pass a threshold.
 * If it fails for both X and Y axis, there is no AutoLayout and return it unchanged.
 * If it finds, add the correct attributes. When original node is a Group,
 * convert it to Frame before adding the attributes. Group doesn't have AutoLayout properties.
 */
const convertToAutoLayout = (node) => {
    // only go inside when AutoLayout is not already set.
    if (("layoutMode" in node &&
        node.layoutMode === "NONE" &&
        node.children.length > 0) ||
        node.type === "GROUP") {
        const [orderedChildren, direction, itemSpacing] = reorderChildrenIfAligned(node.children);
        node.children = orderedChildren;
        if (direction === "NONE" && node.children.length > 1) {
            node.isRelative = true;
        }
        if (direction === "NONE" && node.children.length !== 1) {
            // catches when children is 0 or children is larger than 1
            return node;
        }
        // if node is a group, convert to frame
        if (node.type === "GROUP") {
            node = convertGroupToFrame(node);
        }
        if (direction === "NONE" && node.children.length === 1) {
            // Add fake AutoLayout when there is a single item. This is done for the Padding.
            node.layoutMode = "HORIZONTAL";
        }
        else {
            node.layoutMode = direction;
        }
        node.itemSpacing = itemSpacing > 0 ? itemSpacing : 0;
        const padding = detectAutoLayoutPadding(node);
        node.paddingTop = Math.max(padding.top, 0);
        node.paddingBottom = Math.max(padding.bottom, 0);
        node.paddingLeft = Math.max(padding.left, 0);
        node.paddingRight = Math.max(padding.right, 0);
        // set children to INHERIT or STRETCH
        node.children.map((d) => {
            // @ts-ignore current node can't be AltGroupNode because it was converted into AltFrameNode
            layoutAlignInChild(d, node);
        });
        const allChildrenDirection = node.children.map((d) => 
        // @ts-ignore current node can't be AltGroupNode because it was converted into AltFrameNode
        primaryAxisDirection(d, node));
        const primaryDirection = allChildrenDirection.map((d) => d.primary);
        const counterDirection = allChildrenDirection.map((d) => d.counter);
        // @ts-ignore it is never going to be undefined.
        node.primaryAxisAlignItems = mostFrequent(primaryDirection);
        // @ts-ignore it is never going to be undefined.
        node.counterAxisAlignItems = mostFrequent(counterDirection);
        node.counterAxisSizingMode = "FIXED";
        node.primaryAxisSizingMode = "FIXED";
    }
    return node;
};
/**
 * Standard average calculation. Length must be > 0
 */
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
/**
 * Check the average of children positions against this threshold;
 * This allows a small tolerance, which is useful when items are slightly overlayed.
 * If you set this lower, layouts will get more responsive but with less visual fidelity.
 */
const threshold = -2;
/**
 * Verify if children are sorted by their relative position and return them sorted, if identified.
 */
const reorderChildrenIfAligned = (children) => {
    if (children.length === 1) {
        return [[...children], "NONE", 0];
    }
    const updateChildren = [...children];
    const [visit, avg] = shouldVisit(updateChildren);
    // check against a threshold
    if (visit === "VERTICAL") {
        // if all elements are horizontally aligned
        return [updateChildren.sort((a, b) => a.y - b.y), "VERTICAL", avg];
    }
    else {
        if (visit === "HORIZONTAL") {
            // if all elements are vertically aligned
            return [updateChildren.sort((a, b) => a.x - b.x), "HORIZONTAL", avg];
        }
    }
    return [updateChildren, "NONE", 0];
};
/**
 * Checks if layout is horizontally or vertically aligned.
 * First verify if all items are vertically aligned in Y axis (spacing > 0), then for X axis, then the average for Y and finally the average for X.
 * If no correspondence is found, returns "NONE".
 * In a previous version, it used a "standard deviation", but "average" performed better.
 */
const shouldVisit = (children) => {
    const intervalY = calculateInterval(children, "y");
    const intervalX = calculateInterval(children, "x");
    const avgX = average(intervalX);
    const avgY = average(intervalY);
    if (!intervalY.every((d) => d >= threshold)) {
        if (!intervalX.every((d) => d >= threshold)) {
            if (avgY <= threshold) {
                if (avgX <= threshold) {
                    return ["NONE", 0];
                }
                return ["HORIZONTAL", avgX];
            }
            return ["VERTICAL", avgY];
        }
        return ["HORIZONTAL", avgX];
    }
    return ["VERTICAL", avgY];
};
// todo improve this method to try harder. Idea: maybe use k-means or hierarchical cluster?
/**
 * This function calculates the distance (interval) between items.
 * Example: for [item]--8--[item]--8--[item], the result is [8, 8]
 */
const calculateInterval = (children, xOrY) => {
    const hOrW = xOrY === "x" ? "width" : "height";
    // sort children based on X or Y values
    const sorted = [...children].sort((a, b) => a[xOrY] - b[xOrY]);
    // calculate the distance between values (either vertically or horizontally)
    const interval = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        interval.push(sorted[i + 1][xOrY] - (sorted[i][xOrY] + sorted[i][hOrW]));
    }
    return interval;
};
/**
 * Calculate the Padding.
 * This is very verbose, but also more performant than calculating them independently.
 */
const detectAutoLayoutPadding = (node) => {
    // this need to be run before VERTICAL or HORIZONTAL
    if (node.children.length === 1) {
        // left padding is first element's y value
        const left = node.children[0].x;
        const right = node.width - (node.children[0].x + node.children[0].width);
        const top = node.children[0].y;
        const bottom = node.height - (node.children[0].y + node.children[0].height);
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
    else if (node.layoutMode === "VERTICAL") {
        // top padding is first element's y value
        const top = node.children[0].y;
        // bottom padding is node height - last position + last height
        const last = node.children[node.children.length - 1];
        const bottom = node.height - (last.y + last.height);
        // the closest value to the left border
        const left = Math.min(...node.children.map((d) => d.x));
        // similar to [bottom] calculation, but using height and getting the minimum
        const right = Math.min(...node.children.map((d) => node.width - (d.width + d.x)));
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
    else {
        // node.layoutMode === "HORIZONTAL"
        // left padding is first element's y value
        const left = node.children[0].x;
        // right padding is node width - last position + last width
        const last = node.children[node.children.length - 1];
        const right = node.width - (last.x + last.width);
        // the closest value to the top border
        const top = Math.min(...node.children.map((d) => d.y));
        // similar to [right] calculation, but using height and getting the minimum
        const bottom = Math.min(...node.children.map((d) => node.height - (d.height + d.y)));
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
};
/**
 * Detect if children stretch or inherit.
 */
const layoutAlignInChild = (node, parentNode) => {
    const sameWidth = node.width - 2 >
        parentNode.width - parentNode.paddingLeft - parentNode.paddingRight;
    const sameHeight = node.height - 2 >
        parentNode.height - parentNode.paddingTop - parentNode.paddingBottom;
    if (parentNode.layoutMode === "VERTICAL") {
        node.layoutAlign = sameWidth ? "STRETCH" : "INHERIT";
    }
    else {
        node.layoutAlign = sameHeight ? "STRETCH" : "INHERIT";
    }
    // with custom AutoLayout, this is never going to be 1.
    node.layoutGrow = 0;
};
const primaryAxisDirection = (node, parentNode) => {
    // parentNode.layoutMode can't be NONE.
    const nodeCenteredPosX = node.x + node.width / 2;
    const parentCenteredPosX = parentNode.width / 2;
    const centerXPosition = nodeCenteredPosX - parentCenteredPosX;
    const nodeCenteredPosY = node.y + node.height / 2;
    const parentCenteredPosY = parentNode.height / 2;
    const centerYPosition = nodeCenteredPosY - parentCenteredPosY;
    if (parentNode.layoutMode === "VERTICAL") {
        return {
            primary: getPaddingDirection(centerYPosition),
            counter: getPaddingDirection(centerXPosition),
        };
    }
    else {
        return {
            primary: getPaddingDirection(centerXPosition),
            counter: getPaddingDirection(centerYPosition),
        };
    }
};
const getPaddingDirection = (position) => {
    // allow a small threshold
    if (position < -4) {
        return "MIN";
    }
    else if (position > 4) {
        return "MAX";
    }
    else {
        return "CENTER";
    }
};

/**
 * Identify all nodes that are inside Rectangles and transform those Rectangles into Frames containing those nodes.
 */
const convertNodesOnRectangle = (node) => {
    if (node.children.length < 2) {
        return node;
    }
    if (!node.id) {
        throw new Error("Node is missing an id! This error should only happen in tests.");
    }
    const colliding = retrieveCollidingItems(node.children);
    const parentsKeys = Object.keys(colliding);
    // start with all children. This is going to be filtered.
    let updatedChildren = [...node.children];
    parentsKeys.forEach((key) => {
        // dangerous cast, but this is always true
        const parentNode = node.children.find((d) => d.id === key);
        // retrieve the position. Key should always be at the left side, so even when other items are removed, the index is kept the same.
        const indexPosition = updatedChildren.findIndex((d) => d.id === key);
        // filter the children to remove those that are being modified
        updatedChildren = updatedChildren.filter((d) => !colliding[key].map((dd) => dd.id).includes(d.id) && key !== d.id);
        const frameNode = convertRectangleToFrame(parentNode);
        // todo when the soon-to-be-parent is larger than its parent, things get weird. Happens, for example, when a large image is used in the background. Should this be handled or is this something user should never do?
        frameNode.children = [...colliding[key]];
        colliding[key].forEach((d) => {
            d.parent = frameNode;
            d.x = d.x - frameNode.x;
            d.y = d.y - frameNode.y;
        });
        // try to convert the children to AutoLayout, and insert back at updatedChildren.
        updatedChildren.splice(indexPosition, 0, convertToAutoLayout(frameNode));
    });
    if (updatedChildren.length > 0) {
        node.children = updatedChildren;
    }
    // convert the resulting node to AutoLayout.
    node = convertToAutoLayout(node);
    return node;
};
const convertRectangleToFrame = (rect) => {
    // if a Rect with elements inside were identified, extract this Rect
    // outer methods are going to use it.
    const frameNode = new AltFrameNode();
    frameNode.parent = rect.parent;
    frameNode.width = rect.width;
    frameNode.height = rect.height;
    frameNode.x = rect.x;
    frameNode.y = rect.y;
    frameNode.rotation = rect.rotation;
    frameNode.layoutMode = "NONE";
    // opacity should be ignored, else it will affect children
    // when invisible, add the layer but don't fill it; he designer might use invisible layers for alignment.
    // visible can be undefined in tests
    if (rect.visible !== false) {
        frameNode.fills = rect.fills;
        frameNode.fillStyleId = rect.fillStyleId;
        frameNode.strokes = rect.strokes;
        frameNode.strokeStyleId = rect.strokeStyleId;
        frameNode.effects = rect.effects;
        frameNode.effectStyleId = rect.effectStyleId;
    }
    // inner Rectangle shall get a FIXED size
    frameNode.counterAxisAlignItems = "MIN";
    frameNode.counterAxisSizingMode = "FIXED";
    frameNode.primaryAxisAlignItems = "MIN";
    frameNode.primaryAxisSizingMode = "FIXED";
    frameNode.strokeAlign = rect.strokeAlign;
    frameNode.strokeCap = rect.strokeCap;
    frameNode.strokeJoin = rect.strokeJoin;
    frameNode.strokeMiterLimit = rect.strokeMiterLimit;
    frameNode.strokeWeight = rect.strokeWeight;
    frameNode.cornerRadius = rect.cornerRadius;
    frameNode.cornerSmoothing = rect.cornerSmoothing;
    frameNode.topLeftRadius = rect.topLeftRadius;
    frameNode.topRightRadius = rect.topRightRadius;
    frameNode.bottomLeftRadius = rect.bottomLeftRadius;
    frameNode.bottomRightRadius = rect.bottomRightRadius;
    frameNode.id = rect.id;
    frameNode.name = rect.name;
    return frameNode;
};
/**
 * Iterate over each Rectangle and check if it has any child on top.
 * This is O(n^2), but is optimized to only do j=i+1 until length, and avoid repeated entries.
 * A Node can only have a single parent. The order is defined by layer order.
 */
const retrieveCollidingItems = (children) => {
    const used = {};
    const groups = {};
    for (let i = 0; i < children.length - 1; i++) {
        const item1 = children[i];
        // ignore items that are not Rectangles
        if (item1.type !== "RECTANGLE") {
            continue;
        }
        for (let j = i + 1; j < children.length; j++) {
            const item2 = children[j];
            if (!used[item2.id] &&
                item1.x <= item2.x &&
                item1.y <= item2.y &&
                item1.x + item1.width >= item2.x + item2.width &&
                item1.y + item1.height >= item2.y + item2.height) {
                if (!groups[item1.id]) {
                    groups[item1.id] = [item2];
                }
                else {
                    groups[item1.id].push(item2);
                }
                used[item2.id] = true;
            }
        }
    }
    return groups;
};

const frameNodeToAlt = (node, altParent = null) => {
    if (node.children.length === 0) {
        // if it has no children, convert frame to rectangle
        return frameToRectangleNode(node, altParent);
    }
    const altNode = new AltFrameNode();
    altNode.id = node.id;
    altNode.name = node.name;
    if (altParent) {
        altNode.parent = altParent;
    }
    convertDefaultShape(altNode, node);
    convertFrame(altNode, node);
    convertCorner(altNode, node);
    convertRectangleCorner(altNode, node);
    altNode.children = convertIntoAltNodes(node.children, altNode);
    return convertToAutoLayout(convertNodesOnRectangle(altNode));
};
// auto convert Frame to Rectangle when Frame has no Children
const frameToRectangleNode = (node, altParent) => {
    const newNode = new AltRectangleNode();
    newNode.id = node.id;
    newNode.name = node.name;
    if (altParent) {
        newNode.parent = altParent;
    }
    convertDefaultShape(newNode, node);
    convertRectangleCorner(newNode, node);
    convertCorner(newNode, node);
    return newNode;
};
const convertIntoAltNodes = (sceneNode, altParent = null) => {
    const mapped = sceneNode.map((node) => {
        if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
            let altNode;
            if (node.type === "RECTANGLE") {
                altNode = new AltRectangleNode();
                convertRectangleCorner(altNode, node);
            }
            else {
                altNode = new AltEllipseNode();
            }
            altNode.id = node.id;
            altNode.name = node.name;
            if (altParent) {
                altNode.parent = altParent;
            }
            convertDefaultShape(altNode, node);
            convertCorner(altNode, node);
            return altNode;
        }
        else if (node.type === "LINE") {
            const altNode = new AltRectangleNode();
            altNode.id = node.id;
            altNode.name = node.name;
            if (altParent) {
                altNode.parent = altParent;
            }
            convertDefaultShape(altNode, node);
            // Lines have a height of zero, but they must have a height, so add 1.
            altNode.height = 1;
            // Let them be CENTER, since on Lines this property is ignored.
            altNode.strokeAlign = "CENTER";
            // Remove 1 since it now has a height of 1. It won't be visually perfect, but will be almost.
            altNode.strokeWeight = altNode.strokeWeight - 1;
            return altNode;
        }
        else if (node.type === "FRAME" ||
            node.type === "INSTANCE" ||
            node.type === "COMPONENT") {
            const iconToRect = iconToRectangle(node, altParent);
            if (iconToRect != null) {
                return iconToRect;
            }
            return frameNodeToAlt(node, altParent);
        }
        else if (node.type === "GROUP") {
            if (node.children.length === 1 && node.visible !== false) {
                // if Group is visible and has only one child, Group should disappear.
                // there will be a single value anyway.
                return convertIntoAltNodes(node.children, altParent)[0];
            }
            const iconToRect = iconToRectangle(node, altParent);
            if (iconToRect != null) {
                return iconToRect;
            }
            const altNode = new AltGroupNode();
            altNode.id = node.id;
            altNode.name = node.name;
            if (altParent) {
                altNode.parent = altParent;
            }
            convertLayout(altNode, node);
            convertBlend(altNode, node);
            altNode.children = convertIntoAltNodes(node.children, altNode);
            // try to find big rect and regardless of that result, also try to convert to autolayout.
            // There is a big chance this will be returned as a Frame
            // also, Group will always have at least 2 children.
            return convertNodesOnRectangle(altNode);
        }
        else if (node.type === "TEXT") {
            const altNode = new AltTextNode();
            altNode.id = node.id;
            altNode.name = node.name;
            if (altParent) {
                altNode.parent = altParent;
            }
            convertDefaultShape(altNode, node);
            convertIntoAltText(altNode, node);
            return altNode;
        }
        else if (node.type === "VECTOR") {
            const altNode = new AltRectangleNode();
            altNode.id = node.id;
            altNode.name = node.name;
            if (altParent) {
                altNode.parent = altParent;
            }
            convertDefaultShape(altNode, node);
            // Vector support is still missing. Meanwhile, add placeholder.
            altNode.cornerRadius = 8;
            if (altNode.fills === figma.mixed || altNode.fills.length === 0) {
                // Use rose[400] from Tailwind 2 when Vector has no color.
                altNode.fills = [
                    {
                        type: "SOLID",
                        color: {
                            r: 0.5,
                            g: 0.23,
                            b: 0.27,
                        },
                        visible: true,
                        opacity: 0.5,
                        blendMode: "NORMAL",
                    },
                ];
            }
            return altNode;
        }
        return null;
    });
    return mapped.filter(notEmpty);
};
const iconToRectangle = (node, altParent) => {
    if (node.children.every((d) => d.type === "VECTOR")) {
        const altNode = new AltRectangleNode();
        altNode.id = node.id;
        altNode.name = node.name;
        if (altParent) {
            altNode.parent = altParent;
        }
        convertBlend(altNode, node);
        // width, x, y
        convertLayout(altNode, node);
        // Vector support is still missing. Meanwhile, add placeholder.
        altNode.cornerRadius = 8;
        altNode.strokes = [];
        altNode.strokeWeight = 0;
        altNode.strokeMiterLimit = 0;
        altNode.strokeAlign = "CENTER";
        altNode.strokeCap = "NONE";
        altNode.strokeJoin = "BEVEL";
        altNode.dashPattern = [];
        altNode.fillStyleId = "";
        altNode.strokeStyleId = "";
        altNode.fills = [
            {
                type: "IMAGE",
                imageHash: "",
                scaleMode: "FIT",
                visible: true,
                opacity: 0.5,
                blendMode: "NORMAL",
            },
        ];
        return altNode;
    }
    return null;
};
const convertLayout = (altNode, node) => {
    // Get the correct X/Y position when rotation is applied.
    // This won't guarantee a perfect position, since we would still
    // need to calculate the offset based on node width/height to compensate,
    // which we are not currently doing. However, this is a lot better than nothing and will help LineNode.
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        const boundingRect = getBoundingRect(node);
        altNode.x = boundingRect.x;
        altNode.y = boundingRect.y;
    }
    else {
        altNode.x = node.x;
        altNode.y = node.y;
    }
    altNode.width = node.width;
    altNode.height = node.height;
    altNode.rotation = node.rotation;
    altNode.layoutAlign = node.layoutAlign;
    altNode.layoutGrow = node.layoutGrow;
};
const convertFrame = (altNode, node) => {
    altNode.layoutMode = node.layoutMode;
    altNode.primaryAxisSizingMode = node.primaryAxisSizingMode;
    altNode.counterAxisSizingMode = node.counterAxisSizingMode;
    // Fix this: https://stackoverflow.com/questions/57859754/flexbox-space-between-but-center-if-one-element
    // It affects HTML, Tailwind, Flutter and possibly SwiftUI. So, let's be consistent.
    if (node.primaryAxisAlignItems === "SPACE_BETWEEN" &&
        node.children.length === 1) {
        altNode.primaryAxisAlignItems = "CENTER";
    }
    else {
        altNode.primaryAxisAlignItems = node.primaryAxisAlignItems;
    }
    altNode.counterAxisAlignItems = node.counterAxisAlignItems;
    altNode.paddingLeft = node.paddingLeft;
    altNode.paddingRight = node.paddingRight;
    altNode.paddingTop = node.paddingTop;
    altNode.paddingBottom = node.paddingBottom;
    altNode.itemSpacing = node.itemSpacing;
    altNode.layoutGrids = node.layoutGrids;
    altNode.gridStyleId = node.gridStyleId;
    altNode.clipsContent = node.clipsContent;
    altNode.guides = node.guides;
};
const convertGeometry = (altNode, node) => {
    altNode.fills = node.fills;
    altNode.strokes = node.strokes;
    altNode.strokeWeight = node.strokeWeight;
    altNode.strokeMiterLimit = node.strokeMiterLimit;
    altNode.strokeAlign = node.strokeAlign;
    altNode.strokeCap = node.strokeCap;
    altNode.strokeJoin = node.strokeJoin;
    altNode.dashPattern = node.dashPattern;
    altNode.fillStyleId = node.fillStyleId;
    altNode.strokeStyleId = node.strokeStyleId;
};
const convertBlend = (altNode, node) => {
    altNode.opacity = node.opacity;
    altNode.blendMode = node.blendMode;
    altNode.isMask = node.isMask;
    altNode.effects = node.effects;
    altNode.effectStyleId = node.effectStyleId;
    altNode.visible = node.visible;
};
const convertDefaultShape = (altNode, node) => {
    // opacity, visible
    convertBlend(altNode, node);
    // fills, strokes
    convertGeometry(altNode, node);
    // width, x, y
    convertLayout(altNode, node);
};
const convertCorner = (altNode, node) => {
    altNode.cornerRadius = node.cornerRadius;
    altNode.cornerSmoothing = node.cornerSmoothing;
};
const convertRectangleCorner = (altNode, node) => {
    altNode.topLeftRadius = node.topLeftRadius;
    altNode.topRightRadius = node.topRightRadius;
    altNode.bottomLeftRadius = node.bottomLeftRadius;
    altNode.bottomRightRadius = node.bottomRightRadius;
};
const convertIntoAltText = (altNode, node) => {
    altNode.textAlignHorizontal = node.textAlignHorizontal;
    altNode.textAlignVertical = node.textAlignVertical;
    altNode.paragraphIndent = node.paragraphIndent;
    altNode.paragraphSpacing = node.paragraphSpacing;
    altNode.fontSize = node.fontSize;
    altNode.fontName = node.fontName;
    altNode.textCase = node.textCase;
    altNode.textDecoration = node.textDecoration;
    altNode.letterSpacing = node.letterSpacing;
    altNode.textAutoResize = node.textAutoResize;
    altNode.characters = node.characters;
    altNode.lineHeight = node.lineHeight;
};
function notEmpty(value) {
    return value !== null && value !== undefined;
}
const applyMatrixToPoint = (matrix, point) => {
    return [
        point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
        point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2],
    ];
};
/**
 *  this function return a bounding rect for an nodes
 */
// x/y absolute coordinates
// height/width
// x2/y2 bottom right coordinates
const getBoundingRect = (node) => {
    const halfHeight = node.height / 2;
    const halfWidth = node.width / 2;
    const [[c0, s0, x], [s1, c1, y]] = node.absoluteTransform;
    const matrix = [
        [c0, s0, x + halfWidth * c0 + halfHeight * s0],
        [s1, c1, y + halfWidth * s1 + halfHeight * c1],
    ];
    // the coordinates of the corners of the rectangle
    const XY = {
        x: [1, -1, 1, -1],
        y: [1, -1, -1, 1],
    };
    // fill in
    for (let i = 0; i <= 3; i++) {
        const a = applyMatrixToPoint(matrix, [
            XY.x[i] * halfWidth,
            XY.y[i] * halfHeight,
        ]);
        XY.x[i] = a[0];
        XY.y[i] = a[1];
    }
    XY.x.sort((a, b) => a - b);
    XY.y.sort((a, b) => a - b);
    return {
        x: XY.x[0],
        y: XY.y[0],
    };
};

// from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
const calculateContrastRatio = (color1, color2) => {
    const color1luminance = luminance(color1);
    const color2luminance = luminance(color2);
    const contrast = color1luminance > color2luminance
        ? (color2luminance + 0.05) / (color1luminance + 0.05)
        : (color1luminance + 0.05) / (color2luminance + 0.05);
    return 1 / contrast;
};
function luminance(color) {
    const a = [color.r * 255, color.g * 255, color.b * 255].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
const deepFlatten = (arr) => {
    let result = [];
    arr.forEach((d) => {
        if ("children" in d) {
            result.push(d);
            result = result.concat(deepFlatten(d.children));
        }
        else {
            result.push(d);
        }
    });
    return result;
};

const retrieveGenericSolidUIColors = (sceneNode, framework) => {
    const selectedChildren = deepFlatten(sceneNode);
    const colorStr = [];
    // collect all fills and strokes SOLID colors
    selectedChildren.forEach((d) => {
        if ("fills" in d) {
            const fills = convertSolidColor(d.fills, framework, d.type);
            if (fills) {
                colorStr.push(...fills);
            }
        }
        if ("strokes" in d) {
            const strokes = convertSolidColor(d.strokes, framework, d.type);
            if (strokes) {
                colorStr.push(...strokes);
            }
        }
    });
    // retrieve only unique colors
    // from https://stackoverflow.com/a/18923480/4418073
    const unique = {};
    const distinct = [];
    colorStr.forEach(function (x) {
        if (!unique[x.hex]) {
            distinct.push(x);
            unique[x.hex] = true;
        }
    });
    return distinct.sort((a, b) => a.hex.localeCompare(b.hex));
};
const convertSolidColor = (fills, framework, nodeType) => {
    // shortcut to be used for calculateContrastRatio.
    const black = {
        r: 0,
        g: 0,
        b: 0,
    };
    const white = {
        r: 1,
        g: 1,
        b: 1,
    };
    if (fills && fills !== figma.mixed && fills.length > 0) {
        return fills
            .map((fill) => {
            var _a;
            if (fill.type === "SOLID") {
                let exported = "";
                const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
                if (framework === "flutter") {
                    exported = flutterColor(fill.color, opacity);
                    return {
                        hex: rgbTo6hex(fill.color),
                        colorName: "",
                        exported: exported,
                        contrastBlack: calculateContrastRatio(fill.color, black),
                        contrastWhite: calculateContrastRatio(fill.color, white),
                    };
                }
                else if (framework === "html") {
                    exported = htmlColor(fill.color, opacity);
                }
                else if (framework === "tailwind") {
                    const kind = nodeType === "TEXT" ? "text" : "bg";
                    exported = tailwindSolidColor(fill, kind);
                    const hex = rgbTo6hex(fill.color);
                    const hexNearestColor = tailwindNearestColor(hex);
                    // special case since each color has a name.
                    return {
                        hex: hex,
                        colorName: tailwindColors[hexNearestColor],
                        exported: exported,
                        contrastBlack: 0,
                        contrastWhite: 0,
                    };
                }
                else if (framework === "swiftui") {
                    exported = swiftuiColor(fill.color, opacity);
                }
                return {
                    hex: rgbTo6hex(fill.color),
                    colorName: "",
                    exported: exported,
                    contrastBlack: 0,
                    contrastWhite: 0,
                };
            }
        })
            .filter(notEmpty);
    }
    return null;
};
const retrieveGenericLinearGradients = (sceneNode, framework) => {
    const selectedChildren = deepFlatten(sceneNode);
    const colorStr = [];
    // collect all Linear Gradient colors from fills and strokes
    selectedChildren.forEach((d) => {
        if ("fills" in d) {
            const fills = convertGradient(d.fills, framework);
            if (fills) {
                colorStr.push(...fills);
            }
        }
        if ("strokes" in d) {
            const strokes = convertGradient(d.strokes, framework);
            if (strokes) {
                colorStr.push(...strokes);
            }
        }
    });
    // retrieve only unique colors
    // from https://stackoverflow.com/a/18923480/4418073
    const unique = {};
    const distinct = [];
    colorStr.forEach(function (x) {
        if (!unique[x.css]) {
            distinct.push(x);
            unique[x.css] = true;
        }
    });
    return distinct;
};
const convertGradient = (fills, framework) => {
    // kind can be text, bg, border...
    // [when testing] fills can be undefined
    if (fills && fills !== figma.mixed && fills.length > 0) {
        return fills
            .map((fill) => {
            if (fill.type === "GRADIENT_LINEAR") {
                let exported = "";
                switch (framework) {
                    case "flutter":
                        exported = flutterGradient(fill);
                        break;
                    case "html":
                        exported = htmlGradient(fill);
                        break;
                    case "tailwind":
                        exported = tailwindGradient(fill);
                        break;
                    case "swiftui":
                        exported = swiftuiGradient(fill);
                        break;
                }
                return {
                    css: htmlGradient(fill),
                    exported: exported,
                };
            }
        })
            .filter(notEmpty);
    }
    return null;
};

const htmlSize = (node, isJSX) => {
    return htmlSizePartial(node, isJSX).join("");
};
const htmlSizePartial = (node, isJsx) => {
    const size = nodeWidthHeight(node, false);
    let w = "";
    if (typeof size.width === "number") {
        w += formatWithJSX("width", isJsx, size.width);
    }
    else if (size.width === "full") {
        if (node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "HORIZONTAL") {
            w += formatWithJSX("flex", isJsx, "1 1 0%");
        }
        else {
            w += formatWithJSX("width", isJsx, "100%");
        }
    }
    let h = "";
    if (typeof size.height === "number") {
        h += formatWithJSX("height", isJsx, size.height);
    }
    else if (typeof size.height === "string") {
        if (node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "VERTICAL") {
            h += formatWithJSX("flex", isJsx, "1 1 0%");
        }
        else {
            h += formatWithJSX("height", isJsx, "100%");
        }
    }
    return [w, h];
};

const htmlTextSize = (node, isJsx) => {
    const [width, height] = htmlSizePartial(node, isJsx);
    let comp = "";
    if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
        comp += width;
    }
    if (node.textAutoResize === "NONE") {
        comp += height;
    }
    return comp;
};

/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
const htmlShadow = (node) => {
    // [when testing] node.effects can be undefined
    if (node.effects && node.effects.length > 0) {
        const dropShadow = node.effects.filter((d) => (d.type === "DROP_SHADOW" || d.type === "INNER_SHADOW") &&
            d.visible !== false);
        // simple shadow from tailwind
        if (dropShadow.length > 0) {
            const shadow = dropShadow[0];
            const x = shadow.offset.x;
            const y = shadow.offset.y;
            const color = htmlColor(shadow.color, shadow.color.a);
            const blur = shadow.radius;
            const spread = shadow.spread ? `${shadow.spread}px ` : "";
            const inner = shadow.type === "INNER_SHADOW" ? " inset" : "";
            return `${x}px ${y}px ${blur}px ${spread}${color}${inner}`;
        }
    }
    return "";
};

/**
 * https://tailwindcss.com/docs/opacity/
 * default is [0, 25, 50, 75, 100], but '100' will be ignored:
 * if opacity was changed, let it be visible. Therefore, 98% => 75
 * node.opacity is between [0, 1]; output will be [0, 100]
 */
const htmlOpacity = (node, isJsx) => {
    // [when testing] node.opacity can be undefined
    if (node.opacity !== undefined && node.opacity !== 1) {
        // formatWithJSX is not called here because opacity unit doesn't end in px.
        if (isJsx) {
            return `opacity: ${numToAutoFixed(node.opacity)}, `;
        }
        else {
            return `opacity: ${numToAutoFixed(node.opacity)}; `;
        }
    }
    return "";
};
/**
 * https://tailwindcss.com/docs/visibility/
 * example: invisible
 */
const htmlVisibility = (node, isJsx) => {
    // [when testing] node.visible can be undefined
    // When something is invisible in Figma, it isn't gone. Groups can make use of it.
    // Therefore, instead of changing the visibility (which causes bugs in nested divs),
    // this plugin is going to ignore color and stroke
    if (node.visible !== undefined && !node.visible) {
        return formatWithJSX("visibility", isJsx, "hidden");
    }
    return "";
};
/**
 * https://tailwindcss.com/docs/rotate/
 * default is [-180, -90, -45, 0, 45, 90, 180], but '0' will be ignored:
 * if rotation was changed, let it be perceived. Therefore, 1 => 45
 */
const htmlRotation = (node, isJsx) => {
    // that's how you convert angles to clockwise radians: angle * -pi/180
    // using 3.14159 as Pi for enough precision and to avoid importing math lib.
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        return formatWithJSX("transform", isJsx, `rotate(${numToAutoFixed(node.rotation)}deg)`);
    }
    return "";
};

const htmlPosition = (node, parentId = "") => {
    // don't add position to the first (highest) node in the tree
    if (!node.parent || parentId === node.parent.id) {
        return "";
    }
    // Group
    if (node.parent.isRelative === true) {
        // position is absolute, needs to be relative
        return "absoluteManualLayout";
    }
    return "";
};

/**
 * https://tailwindcss.com/docs/margin/
 * example: px-2 py-8
 */
const htmlPadding = (node, isJsx) => {
    const padding = commonPadding(node);
    if (padding === null) {
        return "";
    }
    if ("all" in padding) {
        return formatWithJSX("padding", isJsx, padding.all);
    }
    let comp = "";
    // horizontal and vertical, as the default AutoLayout
    if (padding.horizontal) {
        comp += formatWithJSX("padding-left", isJsx, padding.horizontal);
        comp += formatWithJSX("padding-right", isJsx, padding.horizontal);
    }
    if (padding.vertical) {
        comp += formatWithJSX("padding-top", isJsx, padding.vertical);
        comp += formatWithJSX("padding-bottom", isJsx, padding.vertical);
    }
    if (padding.top) {
        comp += formatWithJSX("padding-top", isJsx, padding.top);
    }
    if (padding.bottom) {
        comp += formatWithJSX("padding-bottom", isJsx, padding.bottom);
    }
    if (padding.left) {
        comp += formatWithJSX("padding-left", isJsx, padding.left);
    }
    if (padding.right) {
        comp += formatWithJSX("padding-right", isJsx, padding.right);
    }
    // todo use REM
    return comp;
};

/**
 * https://tailwindcss.com/docs/border-radius/
 * example: rounded-sm
 * example: rounded-tr-lg
 */
const htmlBorderRadius = (node, isJsx) => {
    if (node.type === "ELLIPSE") {
        return formatWithJSX("border-radius", isJsx, 9999);
    }
    else if ((!("cornerRadius" in node) && !("topLeftRadius" in node)) ||
        (node.cornerRadius === figma.mixed && node.topLeftRadius === undefined) ||
        node.cornerRadius === 0) {
        // the second condition is used on tests. On Figma, topLeftRadius is never undefined.
        // ignore when 0, undefined or non existent
        return "";
    }
    let comp = "";
    if (node.cornerRadius !== figma.mixed) {
        comp += formatWithJSX("border-radius", isJsx, node.cornerRadius);
    }
    else {
        // todo optimize for tr/tl/br/bl instead of t/r/l/b
        if (node.topLeftRadius !== 0) {
            comp += formatWithJSX("border-top-left-radius", isJsx, node.topLeftRadius);
        }
        if (node.topRightRadius !== 0) {
            comp += formatWithJSX("border-top-right-radius", isJsx, node.topRightRadius);
        }
        if (node.bottomLeftRadius !== 0) {
            comp += formatWithJSX("border-bottom-left-radius", isJsx, node.bottomLeftRadius);
        }
        if (node.bottomRightRadius !== 0) {
            comp += formatWithJSX("border-bottom-right-radius", isJsx, node.bottomRightRadius);
        }
    }
    return comp;
};

class HtmlDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        this.name = "";
        this.hasFixedSize = false;
        this.retrieveFill = (paintArray) => {
            // visible is true or undefinied (tests)
            if (this.visible !== false) {
                const gradient = htmlGradientFromFills(paintArray);
                if (gradient) {
                    return { prop: gradient, kind: "gradient" };
                }
                else {
                    const color = htmlColorFromFills(paintArray);
                    if (color) {
                        return { prop: color, kind: "solid" };
                    }
                }
            }
            return { prop: "", kind: "none" };
        };
        this.isJSX = optIsJSX;
        this.style = "";
        this.visible = node.visible;
        if (showLayerName) {
            this.name = node.name.replace(" ", "");
        }
    }
    blend(node) {
        this.style += htmlVisibility(node, this.isJSX);
        this.style += htmlRotation(node, this.isJSX);
        this.style += htmlOpacity(node, this.isJSX);
        return this;
    }
    border(node) {
        // add border-radius: 10, for example.
        this.style += htmlBorderRadius(node, this.isJSX);
        // add border: 10px solid, for example.
        if (node.strokes && node.strokes.length > 0 && node.strokeWeight > 0) {
            const fill = this.retrieveFill(node.strokes);
            const weight = node.strokeWeight;
            if (node.dashPattern.length > 0) {
                this.style += formatWithJSX("border-style", this.isJSX, "dotted");
            }
            else {
                this.style += formatWithJSX("border-style", this.isJSX, "solid");
            }
            this.style += formatWithJSX("border-width", this.isJSX, weight);
            this.style += formatWithJSX("border-style", this.isJSX, "solid");
            if (fill.kind === "gradient") {
                // Gradient requires these.
                this.style += formatWithJSX("border-image-slice", this.isJSX, 1);
                this.style += formatWithJSX("border-image-source", this.isJSX, fill.prop);
            }
            else {
                this.style += formatWithJSX("border-color", this.isJSX, fill.prop);
            }
        }
        return this;
    }
    position(node, parentId, isRelative = false) {
        const position = htmlPosition(node, parentId);
        if (position === "absoluteManualLayout" && node.parent) {
            // tailwind can't deal with absolute layouts.
            const [parentX, parentY] = parentCoordinates(node.parent);
            const left = node.x - parentX;
            const top = node.y - parentY;
            this.style += formatWithJSX("left", this.isJSX, left);
            this.style += formatWithJSX("top", this.isJSX, top);
            if (isRelative === false) {
                this.style += formatWithJSX("position", this.isJSX, "absolute");
            }
        }
        else {
            this.style += position;
        }
        return this;
    }
    customColor(paintArray, property) {
        const fill = this.retrieveFill(paintArray);
        if (fill.kind === "solid") {
            // When text, solid must be outputted as 'color'.
            const prop = property === "text" ? "color" : property;
            this.style += formatWithJSX(prop, this.isJSX, fill.prop);
        }
        else if (fill.kind === "gradient") {
            if (property === "background-color") {
                this.style += formatWithJSX("background-image", this.isJSX, fill.prop);
            }
            else if (property === "text") {
                this.style += formatWithJSX("background", this.isJSX, fill.prop);
                this.style += formatWithJSX("-webkit-background-clip", this.isJSX, "text");
                this.style += formatWithJSX("-webkit-text-fill-color", this.isJSX, "transparent");
            }
        }
        return this;
    }
    shadow(node) {
        const shadow = htmlShadow(node);
        if (shadow) {
            this.style += formatWithJSX("box-shadow", this.isJSX, htmlShadow(node));
        }
        return this;
    }
    // must be called before Position, because of the hasFixedSize attribute.
    widthHeight(node) {
        // if current element is relative (therefore, children are absolute)
        // or current element is one of the absoltue children and has a width or height > w/h-64
        if ("isRelative" in node && node.isRelative === true) {
            this.style += htmlSize(node, this.isJSX);
        }
        else {
            const partial = htmlSizePartial(node, this.isJSX);
            this.hasFixedSize = partial[0] !== "" && partial[1] !== "";
            this.style += partial.join("");
        }
        return this;
    }
    autoLayoutPadding(node) {
        this.style += htmlPadding(node, this.isJSX);
        return this;
    }
    removeTrailingSpace() {
        if (this.style.length > 0 && this.style.slice(-1) === " ") {
            this.style = this.style.slice(0, -1);
        }
        return this;
    }
    build(additionalStyle = "") {
        this.style += additionalStyle;
        this.removeTrailingSpace();
        if (this.style) {
            if (this.isJSX) {
                this.style = ` style={{${this.style}}}`;
            }
            else {
                this.style = ` style="${this.style}"`;
            }
        }
        if (this.name.length > 0) {
            const classOrClassName = this.isJSX ? "className" : "class";
            return ` ${classOrClassName}="${this.name}"${this.style}`;
        }
        else {
            return this.style;
        }
    }
}

class HtmlTextBuilder extends HtmlDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        super(node, showLayerName, optIsJSX);
    }
    // must be called before Position method
    textAutoSize(node) {
        if (node.textAutoResize === "NONE") {
            // going to be used for position
            this.hasFixedSize = true;
        }
        this.style += htmlTextSize(node, this.isJSX);
        return this;
    }
    // todo fontFamily
    //  fontFamily(node: AltTextNode): this {
    //    return this;
    //  }
    /**
     * https://tailwindcss.com/docs/font-size/
     * example: text-md
     */
    fontSize(node, isUI = false) {
        // example: text-md
        if (node.fontSize !== figma.mixed) {
            // special limit when used in UI.
            const value = isUI ? Math.min(node.fontSize, 24) : node.fontSize;
            this.style += formatWithJSX("font-size", this.isJSX, value);
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/font-style/
     * example: font-extrabold
     * example: italic
     */
    fontStyle(node) {
        if (node.fontName !== figma.mixed) {
            const lowercaseStyle = node.fontName.style.toLowerCase();
            if (lowercaseStyle.match("italic")) {
                this.style += formatWithJSX("font-style", this.isJSX, "italic");
            }
            if (lowercaseStyle.match("regular")) {
                // ignore the font-style when regular (default)
                return this;
            }
            const value = node.fontName.style
                .replace("italic", "")
                .replace(" ", "")
                .toLowerCase();
            const weight = convertFontWeight(value);
            if (weight !== null && weight !== "400") {
                this.style += formatWithJSX("font-weight", this.isJSX, weight);
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/letter-spacing/
     * example: tracking-widest
     */
    letterSpacing(node) {
        const letterSpacing = commonLetterSpacing(node);
        if (letterSpacing > 0) {
            this.style += formatWithJSX("letter-spacing", this.isJSX, letterSpacing);
        }
        return this;
    }
    /**
     * Since Figma is built on top of HTML + CSS, lineHeight properties are easy to map.
     */
    lineHeight(node) {
        if (node.lineHeight !== figma.mixed) {
            switch (node.lineHeight.unit) {
                case "AUTO":
                    this.style += formatWithJSX("line-height", this.isJSX, "100%");
                    break;
                case "PERCENT":
                    this.style += formatWithJSX("line-height", this.isJSX, `${numToAutoFixed(node.lineHeight.value)}%`);
                    break;
                case "PIXELS":
                    this.style += formatWithJSX("line-height", this.isJSX, node.lineHeight.value);
                    break;
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-align/
     * example: text-justify
     */
    textAlign(node) {
        // if alignHorizontal is LEFT, don't do anything because that is native
        // only undefined in testing
        if (node.textAlignHorizontal && node.textAlignHorizontal !== "LEFT") {
            // todo when node.textAutoResize === "WIDTH_AND_HEIGHT" and there is no \n in the text, this can be ignored.
            switch (node.textAlignHorizontal) {
                case "CENTER":
                    this.style += formatWithJSX("text-align", this.isJSX, "center");
                    break;
                case "RIGHT":
                    this.style += formatWithJSX("text-align", this.isJSX, "right");
                    break;
                case "JUSTIFIED":
                    this.style += formatWithJSX("text-align", this.isJSX, "justify");
                    break;
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-transform/
     * example: uppercase
     */
    textTransform(node) {
        if (node.textCase === "LOWER") {
            this.style += formatWithJSX("text-transform", this.isJSX, "lowercase");
        }
        else if (node.textCase === "TITLE") {
            this.style += formatWithJSX("text-transform", this.isJSX, "capitalize");
        }
        else if (node.textCase === "UPPER") {
            this.style += formatWithJSX("text-transform", this.isJSX, "uppercase");
        }
        else if (node.textCase === "ORIGINAL") ;
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-decoration/
     * example: underline
     */
    textDecoration(node) {
        if (node.textDecoration === "UNDERLINE") {
            this.style += formatWithJSX("text-decoration", this.isJSX, "underline");
        }
        else if (node.textDecoration === "STRIKETHROUGH") {
            this.style += formatWithJSX("text-decoration", this.isJSX, "line-through");
        }
        return this;
    }
}

let parentId$3 = "";
let showLayerName$1 = false;
const htmlMain = (sceneNode, parentIdSrc = "", isJsx = false, layerName = false) => {
    parentId$3 = parentIdSrc;
    showLayerName$1 = layerName;
    let result = htmlWidgetGenerator(sceneNode, isJsx);
    // remove the initial \n that is made in Container.
    if (result.length > 0 && result.slice(0, 1) === "\n") {
        result = result.slice(1, result.length);
    }
    return result;
};
// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const htmlWidgetGenerator = (sceneNode, isJsx) => {
    let comp = "";
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    const sceneLen = visibleSceneNode.length;
    visibleSceneNode.forEach((node, index) => {
        if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
            comp += htmlContainer(node, "", "", isJsx);
        }
        else if (node.type === "GROUP") {
            comp += htmlGroup(node, isJsx);
        }
        else if (node.type === "FRAME") {
            comp += htmlFrame(node, isJsx);
        }
        else if (node.type === "TEXT") {
            comp += htmlText(node, false, isJsx);
        }
        comp += addSpacingIfNeeded$1(node, index, sceneLen, isJsx);
        // todo support Line
    });
    return comp;
};
const htmlGroup = (node, isJsx = false) => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    // also ignore if there are no children inside, which makes no sense
    if (node.width <= 0 || node.height <= 0 || node.children.length === 0) {
        return "";
    }
    // const vectorIfExists = tailwindVector(node, isJsx);
    // if (vectorIfExists) return vectorIfExists;
    // this needs to be called after CustomNode because widthHeight depends on it
    const builder = new HtmlDefaultBuilder(node, showLayerName$1, isJsx)
        .blend(node)
        .widthHeight(node)
        .position(node, parentId$3);
    if (builder.style) {
        const attr = builder.build(formatWithJSX("position", isJsx, "relative"));
        const generator = htmlWidgetGenerator(node.children, isJsx);
        return `\n<div${attr}>${indentString(generator)}\n</div>`;
    }
    return htmlWidgetGenerator(node.children, isJsx);
};
// this was split from htmlText to help the UI part, where the style is needed (without <p></p>).
const htmlBuilder = (node, isJsx, isUI = false) => {
    const builderResult = new HtmlTextBuilder(node, showLayerName$1, isJsx)
        .blend(node)
        .textAutoSize(node)
        .position(node, parentId$3)
        // todo fontFamily (via node.fontName !== figma.mixed ? `fontFamily: ${node.fontName.family}`)
        // todo font smoothing
        .fontSize(node, isUI)
        .fontStyle(node)
        .letterSpacing(node)
        .lineHeight(node)
        .textDecoration(node)
        // todo text lists (<li>)
        .textAlign(node)
        .customColor(node.fills, "text")
        .textTransform(node);
    const splittedChars = node.characters.split("\n");
    const charsWithLineBreak = splittedChars.length > 1
        ? node.characters.split("\n").join("<br/>")
        : node.characters;
    return [builderResult, charsWithLineBreak];
};
const htmlText = (node, isInput = false, isJsx) => {
    // follow the website order, to make it easier
    const [builder, charsWithLineBreak] = htmlBuilder(node, isJsx);
    if (isInput) {
        return [builder.style, charsWithLineBreak];
    }
    else {
        return `\n<p${builder.build()}>${charsWithLineBreak}</p>`;
    }
};
const htmlFrame = (node, isJsx = false) => {
    // const vectorIfExists = tailwindVector(node, isJsx);
    // if (vectorIfExists) return vectorIfExists;
    var _a;
    if (node.children.length === 1 &&
        node.children[0].type === "TEXT" &&
        ((_a = node === null || node === void 0 ? void 0 : node.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().match("input"))) {
        const isInput = true;
        const [attr, char] = htmlText(node.children[0], isInput, isJsx);
        return htmlContainer(node, ` placeholder="${char}"`, attr, isJsx, isInput);
    }
    const childrenStr = htmlWidgetGenerator(node.children, isJsx);
    if (node.layoutMode !== "NONE") {
        const rowColumn = rowColumnProps$1(node, isJsx);
        return htmlContainer(node, childrenStr, rowColumn, isJsx);
    }
    else {
        // node.layoutMode === "NONE" && node.children.length > 1
        // children needs to be absolute
        return htmlContainer(node, childrenStr, formatWithJSX("position", isJsx, "relative"), isJsx, false, false);
    }
};
// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const htmlContainer = (node, children, additionalStyle = "", isJsx, isInput = false, isRelative = false) => {
    var _a;
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return children;
    }
    const builder = new HtmlDefaultBuilder(node, showLayerName$1, isJsx)
        .blend(node)
        .widthHeight(node)
        .autoLayoutPadding(node)
        .position(node, parentId$3, isRelative)
        .customColor(node.fills, "background-color")
        // TODO image and gradient support (tailwind does not support gradients)
        .shadow(node)
        .border(node);
    if (isInput) {
        return `\n<input${builder.build(additionalStyle)}>${children}</input>`;
    }
    if (builder.style || additionalStyle) {
        const build = builder.build(additionalStyle);
        let tag = "div";
        let src = "";
        console.log("with ", node.name, "fill", retrieveTopFill(node.fills));
        if (((_a = retrieveTopFill(node.fills)) === null || _a === void 0 ? void 0 : _a.type) === "IMAGE") {
            tag = "img";
            src = ` src="https://via.placeholder.com/${node.width}x${node.height}"`;
        }
        if (children) {
            return `\n<${tag}${build}${src}>${indentString(children)}\n</${tag}>`;
        }
        else {
            return `\n<${tag}${build}${src}/>`;
        }
    }
    return children;
};
const rowColumnProps$1 = (node, isJsx) => {
    // ROW or COLUMN
    // ignore current node when it has only one child and it has the same size
    if (node.children.length === 1 &&
        node.children[0].width === node.width &&
        node.children[0].height === node.height) {
        return "";
    }
    // [optimization]
    // flex, by default, has flex-row. Therefore, it can be omitted.
    const rowOrColumn = node.layoutMode === "HORIZONTAL"
        ? formatWithJSX("flex-direction", isJsx, "row")
        : formatWithJSX("flex-direction", isJsx, "column");
    // special case when there is only one children; need to position correctly in Flex.
    // let justify = "justify-center";
    // if (node.children.length === 1) {
    //   const nodeCenteredPosX = node.children[0].x + node.children[0].width / 2;
    //   const parentCenteredPosX = node.width / 2;
    //   const marginX = nodeCenteredPosX - parentCenteredPosX;
    //   // allow a small threshold
    //   if (marginX < -4) {
    //     justify = "justify-start";
    //   } else if (marginX > 4) {
    //     justify = "justify-end";
    //   }
    // }
    let primaryAlign;
    switch (node.primaryAxisAlignItems) {
        case "MIN":
            primaryAlign = "flex-start";
            break;
        case "CENTER":
            primaryAlign = "center";
            break;
        case "MAX":
            primaryAlign = "flex-end";
            break;
        case "SPACE_BETWEEN":
            primaryAlign = "space-between";
            break;
    }
    primaryAlign = formatWithJSX("justify-content", isJsx, primaryAlign);
    // [optimization]
    // when all children are STRETCH and layout is Vertical, align won't matter. Otherwise, center it.
    let counterAlign;
    switch (node.counterAxisAlignItems) {
        case "MIN":
            counterAlign = "flex-start";
            break;
        case "CENTER":
            counterAlign = "center";
            break;
        case "MAX":
            counterAlign = "flex-end";
            break;
    }
    counterAlign = formatWithJSX("align-items", isJsx, counterAlign);
    // if parent is a Frame with AutoLayout set to Vertical, the current node should expand
    let flex = node.parent &&
        "layoutMode" in node.parent &&
        node.parent.layoutMode === node.layoutMode
        ? "flex"
        : "inline-flex";
    flex = formatWithJSX("display", isJsx, flex);
    return `${flex}${rowOrColumn}${counterAlign}${primaryAlign}`;
};
const addSpacingIfNeeded$1 = (node, index, len, isJsx) => {
    var _a;
    // Ignore this when SPACE_BETWEEN is set.
    if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === "FRAME" &&
        node.parent.layoutMode !== "NONE" &&
        node.parent.primaryAxisAlignItems !== "SPACE_BETWEEN") {
        // check if itemSpacing is set and if it isn't the last value.
        // Don't add at the last value. In Figma, itemSpacing CAN be negative; here it can't.
        if (node.parent.itemSpacing > 0 && index < len - 1) {
            const wh = node.parent.layoutMode === "HORIZONTAL" ? "width" : "height";
            // don't show the layer name in these separators.
            const style = new HtmlDefaultBuilder(node, false, isJsx).build(formatWithJSX(wh, isJsx, node.parent.itemSpacing));
            return `\n<div${style}/>`;
        }
    }
    return "";
};

var componentName;
(function (componentName) {
    componentName[componentName["input"] = 0] = "input";
    componentName[componentName["button"] = 1] = "button";
    componentName[componentName["checkbox"] = 2] = "checkbox";
    componentName[componentName["avatar"] = 3] = "avatar";
    componentName[componentName["radio"] = 4] = "radio";
    componentName[componentName["select"] = 5] = "select";
    componentName[componentName["Alert"] = 6] = "Alert";
    componentName[componentName["list"] = 7] = "list";
    componentName[componentName["background"] = 8] = "background";
})(componentName || (componentName = {}));
const isUI = (name) => {
    console.log('isUI' + name);
    return Object.values(componentName).includes(name);
};
const recognizeAntdUI = (name, text) => {
    console.log(name);
    switch (name) {
        case 'input': return `<Input placeholder="${text}" />`;
        case 'button': return `<Button type="${text === 'submit' || text === '提 交' || text === '登 录' ? "primary" : "defualt"}" >${text}</Button>`;
        case 'checkbox': return `<Checkbox>${text}</Checkbox>`;
        case 'list': return `
        <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={['item1','item2','item3']}
      renderItem={item => (
        <List.Item>
          <Typography.Text mark>[ITEM]</Typography.Text> {item}
        </List.Item>
      )}
    />
        `;
        case 'avatar': return `<Avatar>${text}</Avatar>`;
        case 'Alert': return '<Alert message="Success Text" type="success" />';
        case 'radio': return `<Radio>${text}</Radio>`;
        case 'select': return `
        <Select defaultValue="${text}" style={{ width: 120 }}>
        <Option value="select2">select2</Option>
        <Option value="select3">select3</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
      </Select>
        `;
        default: return text;
    }
};

const nodesTraverserGenerator = (nodes) => {
    // return a traverser for modify particular type nodes
    return {
        nodes,
        traverseFirstLayer(type, method, ...args) {
            // traverse first layer only
            function traverse(node) {
                if (node.type === type) {
                    method(node, ...args);
                }
            }
            for (const node of this.nodes) {
                traverse(node);
            }
            return this;
        },
        traverseAllNodes(method, ...args) {
            function traverse(node) {
                method(node, ...args);
                if (node.type === 'FRAME' || node.type === 'GROUP') {
                    node.children.forEach(child => traverse(child));
                }
            }
            for (const node of this.nodes) {
                traverse(node);
            }
            return this;
        },
        traverseNodesAndSkip(type, method, ...args) {
            function traverse(node) {
                const typeReg = new RegExp(type);
                if (!typeReg.exec(node.type)) {
                    method(node, ...args);
                }
                if (node.type === 'FRAME' || node.type === 'GROUP') {
                    node.children.forEach(child => traverse(child));
                }
            }
            for (const node of this.nodes) {
                traverse(node);
            }
            return this;
        },
        traverseNodes(type, method, ...args) {
            function traverse(node) {
                const typeReg = new RegExp(type);
                if (typeReg.exec(node.type)) {
                    method(node, ...args);
                }
                if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'INSTANCE') {
                    node.children.forEach(child => traverse(child));
                }
            }
            for (const node of this.nodes) {
                traverse(node);
            }
            return this;
        }
    };
};

let parentId$2 = "";
let showLayerName = false;
const tailwindMain = (sceneNode, parentIdSrc = "", isJsx = false, layerName = false, recognize = false) => {
    parentId$2 = parentIdSrc;
    showLayerName = layerName;
    console.log(recognize);
    let result = tailwindWidgetGenerator(sceneNode, isJsx, recognize);
    // remove the initial \n that is made in Container.
    if (result.length > 0 && result.slice(0, 1) === "\n") {
        result = result.slice(1, result.length);
    }
    return result;
};
// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const tailwindWidgetGenerator = (sceneNode, isJsx, recognize) => {
    let comp = "";
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    visibleSceneNode.forEach((node) => {
        console.log(node.name, node.type);
        if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
            comp += tailwindContainer(node, "", "", { isRelative: false, isInput: false }, isJsx);
        }
        else if (node.type === "GROUP") {
            comp += tailwindGroup(node, isJsx, recognize);
        }
        else if (node.type === "FRAME") {
            comp += tailwindFrame(node, isJsx, recognize);
        }
        else if (node.type === "TEXT") {
            comp += tailwindText(node, false, isJsx);
        }
        // todo support Line
    });
    return comp;
};
const tailwindGroup = (node, isJsx = false, recognize) => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    // also ignore if there are no children inside, which makes no sense
    if (node.width <= 0 || node.height <= 0 || node.children.length === 0) {
        return "";
    }
    // this needs to be called after CustomNode because widthHeight depends on it
    const builder = new TailwindDefaultBuilder(node, showLayerName, isJsx)
        .blend(node)
        .widthHeight(node)
        .position(node, parentId$2);
    if (builder.attributes || builder.style) {
        const attr = builder.build("relative ");
        if (recognize && isUI(node.name)) {
            const nodesTraverse = nodesTraverserGenerator(Array.isArray(node) ? node : [node]);
            let text = '';
            const getText = (node) => {
                text = node.characters;
            };
            nodesTraverse.traverseNodes("TEXT", getText);
            return recognizeAntdUI(node.name, text);
        }
        const generator = tailwindWidgetGenerator(node.children, isJsx, recognize);
        return `\n<div${attr}>${indentString(generator)}\n</div>`;
    }
    return tailwindWidgetGenerator(node.children, isJsx, recognize);
};
const tailwindText = (node, isInput, isJsx) => {
    // follow the website order, to make it easier
    const builderResult = new TailwindTextBuilder(node, showLayerName, isJsx)
        .blend(node)
        .textAutoSize(node)
        .position(node, parentId$2)
        // todo fontFamily (via node.fontName !== figma.mixed ? `fontFamily: ${node.fontName.family}`)
        // todo font smoothing
        .fontSize(node)
        .fontStyle(node)
        .letterSpacing(node)
        .lineHeight(node)
        .textDecoration(node)
        // todo text lists (<li>)
        .textAlign(node)
        .customColor(node.fills, "text")
        .textTransform(node);
    const splittedChars = node.characters.split("\n");
    const charsWithLineBreak = splittedChars.length > 1
        ? node.characters.split("\n").join("<br/>")
        : node.characters;
    if (isInput) {
        return [builderResult.attributes, charsWithLineBreak];
    }
    else {
        return `\n<p${builderResult.build()}>${charsWithLineBreak}</p>`;
    }
};
const tailwindFrame = (node, isJsx, recognize) => {
    // const vectorIfExists = tailwindVector(node, isJsx);
    // if (vectorIfExists) return vectorIfExists;
    var _a;
    if (recognize && isUI(node.name)) {
        const nodesTraverse = nodesTraverserGenerator(Array.isArray(node) ? node : [node]);
        let text = '';
        const getText = (node) => {
            text = node.characters;
        };
        nodesTraverse.traverseNodes("TEXT", getText);
        return recognizeAntdUI(node.name, text);
    }
    if (node.children.length === 1 &&
        node.children[0].type === "TEXT" &&
        ((_a = node === null || node === void 0 ? void 0 : node.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().match("input"))) {
        const [attr, char] = tailwindText(node.children[0], true, isJsx);
        return tailwindContainer(node, ` placeholder="${char}"`, attr, { isRelative: false, isInput: true }, isJsx);
    }
    const childrenStr = tailwindWidgetGenerator(node.children, isJsx, recognize);
    if (node.layoutMode !== "NONE") {
        const rowColumn = rowColumnProps(node);
        return tailwindContainer(node, childrenStr, rowColumn, { isRelative: false, isInput: false }, isJsx);
    }
    else {
        // node.layoutMode === "NONE" && node.children.length > 1
        // children needs to be absolute
        return tailwindContainer(node, childrenStr, "relative ", { isRelative: true, isInput: false }, isJsx);
    }
};
// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const tailwindContainer = (node, children, additionalAttr, attr, isJsx) => {
    var _a;
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return children;
    }
    const builder = new TailwindDefaultBuilder(node, showLayerName, isJsx)
        .blend(node)
        .widthHeight(node)
        .autoLayoutPadding(node)
        .position(node, parentId$2, attr.isRelative)
        .customColor(node.fills, "bg")
        // TODO image and gradient support (tailwind does not support gradients)
        .shadow(node)
        .border(node);
    if (attr.isInput) {
        // children before the > is not a typo.
        return `\n<input${builder.build(additionalAttr)}${children}></input>`;
    }
    if (builder.attributes || additionalAttr) {
        const build = builder.build(additionalAttr);
        // image fill and no children -- let's emit an <img />
        let tag = "div";
        let src = "";
        if (((_a = retrieveTopFill(node.fills)) === null || _a === void 0 ? void 0 : _a.type) === "IMAGE") {
            tag = "img";
            src = ` src="https://via.placeholder.com/${node.width}x${node.height}"`;
        }
        if (children) {
            return `\n<${tag}${build}${src}>${indentString(children)}\n</${tag}>`;
        }
        else {
            return `\n<${tag}${build}${src}/>`;
        }
    }
    return children;
};
const rowColumnProps = (node) => {
    // ROW or COLUMN
    // ignore current node when it has only one child and it has the same size
    if (node.children.length === 1 &&
        node.children[0].width === node.width &&
        node.children[0].height === node.height) {
        return "";
    }
    // [optimization]
    // flex, by default, has flex-row. Therefore, it can be omitted.
    const rowOrColumn = node.layoutMode === "HORIZONTAL" ? "" : "flex-col ";
    // https://tailwindcss.com/docs/space/
    // space between items
    const spacing = node.itemSpacing > 0 ? pxToLayoutSize(node.itemSpacing) : 0;
    const spaceDirection = node.layoutMode === "HORIZONTAL" ? "x" : "y";
    // space is visually ignored when there is only one child or spacing is zero
    const space = node.children.length > 1 && spacing > 0
        ? `space-${spaceDirection}-${spacing} `
        : "";
    // special case when there is only one children; need to position correctly in Flex.
    // let justify = "justify-center";
    // if (node.children.length === 1) {
    //   const nodeCenteredPosX = node.children[0].x + node.children[0].width / 2;
    //   const parentCenteredPosX = node.width / 2;
    //   const marginX = nodeCenteredPosX - parentCenteredPosX;
    //   // allow a small threshold
    //   if (marginX < -4) {
    //     justify = "justify-start";
    //   } else if (marginX > 4) {
    //     justify = "justify-end";
    //   }
    // }
    let primaryAlign;
    switch (node.primaryAxisAlignItems) {
        case "MIN":
            primaryAlign = "justify-start ";
            break;
        case "CENTER":
            primaryAlign = "justify-center ";
            break;
        case "MAX":
            primaryAlign = "justify-end ";
            break;
        case "SPACE_BETWEEN":
            primaryAlign = "justify-between ";
            break;
    }
    // [optimization]
    // when all children are STRETCH and layout is Vertical, align won't matter. Otherwise, center it.
    let counterAlign;
    switch (node.counterAxisAlignItems) {
        case "MIN":
            counterAlign = "items-start ";
            break;
        case "CENTER":
            counterAlign = "items-center ";
            break;
        case "MAX":
            counterAlign = "items-end ";
            break;
    }
    // const layoutAlign =
    //   node.layoutMode === "VERTICAL" &&
    //   node.children.every((d) => d.layoutAlign === "STRETCH")
    //     ? ""
    //     : `items-center ${justify} `;
    // if parent is a Frame with AutoLayout set to Vertical, the current node should expand
    const flex = node.parent &&
        "layoutMode" in node.parent &&
        node.parent.layoutMode === node.layoutMode
        ? "flex "
        : "inline-flex ";
    return `${flex}${rowOrColumn}${space}${counterAlign}${primaryAlign}`;
};

const flutterPosition = (node, child, parentId = "") => {
    // avoid adding Positioned() when parent is not a Stack(), which can happen at the beggining
    if (!node.parent || parentId === node.parent.id || child === "") {
        return child;
    }
    // check if view is in a stack. Group and Frames must have more than 1 element
    if (node.parent.isRelative === true) {
        const pos = retrieveAbsolutePos(node, child);
        if (pos !== "Absolute") {
            return pos;
        }
        else {
            // this is necessary because Group have absolute position, while Frame is relative.
            // output is always going to be relative to the parent.
            const [parentX, parentY] = parentCoordinates(node.parent);
            const diffX = numToAutoFixed(node.x - parentX);
            const diffY = numToAutoFixed(node.y - parentY);
            const properties = `\nleft: ${diffX},\ntop: ${diffY},\nchild: ${child}`;
            return `Positioned(${indentString(properties)}\n),`;
        }
    }
    return child;
};
const retrieveAbsolutePos = (node, child) => {
    const positionedAlign = (align) => {
        const alignProp = `\nalignment: Alignment.${align},\nchild: ${child}`;
        const positionedProp = `\nchild: Align(${indentString(alignProp)}\n),`;
        return `Positioned.fill(${indentString(positionedProp)}\n),`;
    };
    switch (commonPosition(node)) {
        case "":
            return child;
        case "Absolute":
            return "Absolute";
        case "TopStart":
            return positionedAlign("topLeft");
        case "TopCenter":
            return positionedAlign("topCenter");
        case "TopEnd":
            return positionedAlign("topRight");
        case "CenterStart":
            return positionedAlign("centerLeft");
        case "Center":
            return positionedAlign("center");
        case "CenterEnd":
            return positionedAlign("centerRight");
        case "BottomStart":
            return positionedAlign("bottomLeft");
        case "BottomCenter":
            return positionedAlign("bottomCenter");
        case "BottomEnd":
            return positionedAlign("bottomRight");
    }
};

/**
 * https://api.flutter.dev/flutter/widgets/Opacity-class.html
 */
const flutterOpacity = (node, child) => {
    if (node.opacity !== undefined && node.opacity !== 1 && child !== "") {
        const prop = `\nopacity: ${numToAutoFixed(node.opacity)},\nchild: ${child}`;
        return `Opacity(${indentString(prop)}\n),`;
    }
    return child;
};
/**
 * https://api.flutter.dev/flutter/widgets/Visibility-class.html
 */
const flutterVisibility = (node, child) => {
    // [when testing] node.visible can be undefined
    if (node.visible !== undefined && node.visible === false && child !== "") {
        const prop = `\nvisible: ${node.visible},\nchild: ${child}`;
        return `Visibility(${indentString(prop)}\n),`;
    }
    return child;
};
/**
 * https://api.flutter.dev/flutter/widgets/Transform-class.html
 * that's how you convert angles to clockwise radians: angle * -pi/180
 * using 3.14159 as Pi for enough precision and to avoid importing math lib.
 */
const flutterRotation = (node, child) => {
    if (node.rotation !== undefined &&
        child !== "" &&
        Math.round(node.rotation) !== 0) {
        const prop = `\nangle: ${numToAutoFixed(node.rotation * (-3.14159 / 180))},\nchild: ${child}`;
        return `Transform.rotate(${indentString(prop)}\n),`;
    }
    return child;
};

// generate the border, when it exists
const flutterBorder = (node) => {
    if (node.type === "GROUP" || !node.strokes || node.strokes.length === 0) {
        return "";
    }
    // retrieve the stroke color, when existent (returns "" otherwise)
    const propStrokeColor = flutterColorFromFills(node.strokes);
    // only add strokeWidth when there is a strokeColor (returns "" otherwise)
    const propStrokeWidth = `width: ${numToAutoFixed(node.strokeWeight)}, `;
    // generate the border, when it should exist
    return propStrokeColor && node.strokeWeight
        ? `\nborder: Border.all(${propStrokeColor} ${propStrokeWidth}),`
        : "";
};
const flutterShape = (node) => {
    const strokeColor = flutterColorFromFills(node.strokes);
    const side = strokeColor && node.strokeWeight > 0
        ? `\nside: BorderSide(width: ${node.strokeWeight}, ${strokeColor} ),`
        : "";
    if (node.type === "ELLIPSE") {
        return `\nshape: CircleBorder(${indentString(side)}${side ? "\n" : ""}),`;
    }
    const properties = side + flutterBorderRadius(node);
    return `\nshape: RoundedRectangleBorder(${indentString(properties)}\n),`;
};
// retrieve the borderRadius, when existent (returns "" for EllipseNode)
const flutterBorderRadius = (node) => {
    if (node.type === "ELLIPSE")
        return "";
    if (node.cornerRadius === 0 ||
        (node.cornerRadius === undefined && node.topLeftRadius === undefined)) {
        return "";
    }
    return node.cornerRadius !== figma.mixed
        ? `\nborderRadius: BorderRadius.circular(${numToAutoFixed(node.cornerRadius)}),`
        : `\nborderRadius: BorderRadius.only(topLeft: Radius.circular(${numToAutoFixed(node.topLeftRadius)}), topRight: Radius.circular(${numToAutoFixed(node.topRightRadius)}), bottomLeft: Radius.circular(${numToAutoFixed(node.bottomLeftRadius)}), bottomRight: Radius.circular(${numToAutoFixed(node.bottomRightRadius)}), ),`;
};

const flutterSize = (node) => {
    const size = nodeWidthHeight(node, false);
    let isExpanded = false;
    // this cast will always be true, since nodeWidthHeight was called with false to relative.
    let propWidth = "";
    if (typeof size.width === "number") {
        propWidth = `\nwidth: ${numToAutoFixed(size.width)},`;
    }
    else if (size.width === "full") {
        // When parent is a Row, child must be Expanded.
        if (node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "HORIZONTAL") {
            isExpanded = true;
        }
        else {
            propWidth = `\nwidth: double.infinity,`;
        }
    }
    let propHeight = "";
    if (typeof size.height === "number") {
        propHeight = `\nheight: ${numToAutoFixed(size.height)},`;
    }
    else if (size.height === "full") {
        // When parent is a Column, child must be Expanded.
        if (node.parent &&
            "layoutMode" in node.parent &&
            node.parent.layoutMode === "VERTICAL") {
            isExpanded = true;
        }
        else {
            propHeight = `\nheight: double.infinity,`;
        }
    }
    return { width: propWidth, height: propHeight, isExpanded: isExpanded };
};

// Add padding if necessary!
// This must happen before Stack or after the Positioned, but not before.
const flutterPadding = (node) => {
    if (!("layoutMode" in node)) {
        return "";
    }
    const padding = commonPadding(node);
    if (!padding) {
        return "";
    }
    if ("all" in padding) {
        return `\npadding: const EdgeInsets.all(${numToAutoFixed(padding.all)}),`;
    }
    // horizontal and vertical, as the default AutoLayout
    if (padding.horizontal + padding.vertical !== 0 &&
        padding.top + padding.bottom + padding.left + padding.right === 0) {
        const propHorizontalPadding = padding.horizontal > 0
            ? `horizontal: ${numToAutoFixed(padding.horizontal)}, `
            : "";
        const propVerticalPadding = padding.vertical > 0
            ? `vertical: ${numToAutoFixed(padding.vertical)}, `
            : "";
        return `\npadding: const EdgeInsets.symmetric(${propHorizontalPadding}${propVerticalPadding}),`;
    }
    let comp = "";
    // if left and right exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.left) {
        comp += `left: ${numToAutoFixed(padding.left)}, `;
    }
    if (padding.right) {
        comp += `right: ${numToAutoFixed(padding.right)}, `;
    }
    if (padding.top) {
        comp += `top: ${numToAutoFixed(padding.top)}, `;
    }
    if (padding.bottom) {
        comp += `bottom: ${numToAutoFixed(padding.bottom)}, `;
    }
    if (comp !== "") {
        return `\npadding: const EdgeInsets.only(${comp}),`;
    }
    return "";
};

const flutterBoxShadow = (node) => {
    var _a;
    let propBoxShadow = "";
    if (((_a = node.effects) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const dropShadow = node.effects.filter((d) => d.type === "DROP_SHADOW" && d.visible !== false);
        if (dropShadow.length > 0) {
            let boxShadow = "";
            dropShadow.forEach((d) => {
                const color = `\ncolor: Color(0x${rgbTo8hex(d.color, d.color.a)}),`;
                const radius = `\nblurRadius: ${numToAutoFixed(d.radius)},`;
                const offset = `\noffset: Offset(${numToAutoFixed(d.offset.x)}, ${numToAutoFixed(d.offset.y)}),`;
                const property = color + radius + offset;
                boxShadow += `\nBoxShadow(${indentString(property)}\n),`;
            });
            propBoxShadow = `\nboxShadow: [${indentString(boxShadow)}\n],`;
        }
        // TODO inner shadow, layer blur
    }
    return propBoxShadow;
};
const flutterElevationAndShadowColor = (node) => {
    var _a;
    let elevation = "";
    let shadowColor = "";
    if (((_a = node.effects) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const dropShadow = node.effects.filter((d) => d.type === "DROP_SHADOW" && d.visible !== false);
        if (dropShadow.length > 0 && dropShadow[0].type === "DROP_SHADOW") {
            shadowColor = `\ncolor: Color(0x${rgbTo8hex(dropShadow[0].color, dropShadow[0].color.a)}), `;
            elevation = `\nelevation: ${numToAutoFixed(dropShadow[0].radius)}, `;
        }
    }
    return [elevation, shadowColor];
};

// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const flutterContainer$1 = (node, child) => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return child;
    }
    // ignore for Groups
    const propBoxDecoration = node.type === "GROUP" ? "" : getBoxDecoration(node);
    const fSize = flutterSize(node);
    const size = fSize.width + fSize.height;
    const isExpanded = fSize.isExpanded;
    // todo Image & multiple fills
    /// if child is empty, propChild is empty
    const propChild = child ? `\nchild: ${child}` : "";
    // [propPadding] will be "padding: const EdgeInsets.symmetric(...)" or ""
    let propPadding = "";
    if (node.type === "FRAME") {
        propPadding = flutterPadding(node);
    }
    let result;
    if (size || propBoxDecoration) {
        // Container is a container if [propWidthHeight] and [propBoxDecoration] are set.
        const properties = `${size}${propBoxDecoration}${propPadding}${propChild}`;
        result = `Container(${indentString(properties)}\n),`;
    }
    else if (propPadding) {
        // if there is just a padding, add Padding
        const properties = `${propPadding}${propChild}`;
        result = `Padding(${indentString(properties)}\n),`;
    }
    else {
        result = child;
    }
    // Add Expanded() when parent is a Row/Column and width is full.
    if (isExpanded) {
        const properties = `\nchild: ${result}`;
        result = `Expanded(${indentString(properties)}\n),`;
    }
    return result;
};
const getBoxDecoration = (node) => {
    const propBackgroundColor = flutterBoxDecorationColor(node.fills);
    const propBorder = flutterBorder(node);
    const propBoxShadow = flutterBoxShadow(node);
    const propBorderRadius = flutterBorderRadius(node);
    // modify the circle's shape when type is ellipse
    const propShape = node.type === "ELLIPSE" ? "\nshape: BoxShape.circle," : "";
    // generate the decoration, or just the backgroundColor when color is SOLID.
    if (propBorder ||
        propShape ||
        propBorder ||
        propBorderRadius ||
        propBackgroundColor[0] === "g") {
        const properties = propBorderRadius +
            propShape +
            propBorder +
            propBoxShadow +
            propBackgroundColor;
        return `\ndecoration: BoxDecoration(${indentString(properties)}\n),`;
    }
    else {
        return propBackgroundColor;
    }
};

// https://api.flutter.dev/flutter/material/Material-class.html
const flutterMaterial = (node, child) => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return child;
    }
    const color = materialColor(node);
    const shape = materialShape(node);
    const clip = getClipping(node);
    const [elevation, shadowColor] = flutterElevationAndShadowColor(node);
    const padChild = child ? `\nchild: ${getPadding(node, child)}` : "";
    const materialAttr = color + elevation + shadowColor + shape + clip + padChild;
    let materialResult = `Material(${indentString(materialAttr)}\n),`;
    const fSize = flutterSize(node);
    const size = fSize.width + fSize.height;
    const isExpanded = fSize.isExpanded;
    if (size) {
        const properties = `${size}\nchild: ${materialResult}`;
        materialResult = `SizedBox(${indentString(properties)}\n),`;
    }
    if (isExpanded) {
        const properties = `\nchild: ${materialResult}`;
        materialResult = `Expanded(${indentString(properties)}\n),`;
    }
    return materialResult;
};
const materialColor = (node) => {
    const color = flutterColorFromFills(node.fills);
    if (!color) {
        return "\ncolor: Colors.transparent,";
    }
    return "\n" + color;
};
const materialShape = (node) => {
    var _a;
    if (node.type === "ELLIPSE" || ((_a = node.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        return flutterShape(node);
    }
    else {
        return flutterBorderRadius(node);
    }
};
const getClipping = (node) => {
    let clip = false;
    if (node.type === "FRAME" && node.cornerRadius && node.cornerRadius !== 0) {
        clip = node.clipsContent;
    }
    return clip ? "\nclipBehavior: Clip.antiAlias," : "";
};
const getPadding = (node, child) => {
    const padding = flutterPadding(node);
    if (padding) {
        const properties = `${padding}\nchild: ${child}`;
        return `Padding(${indentString(properties)}\n),`;
    }
    return child;
};

class FlutterDefaultBuilder {
    constructor(optChild) {
        this.child = optChild;
    }
    createContainer(node, material) {
        const fill = node.type === "GROUP" ? null : retrieveTopFill(node.fills);
        // fill.visible can be true or undefined (on tests)
        if (node.type !== "GROUP" &&
            material &&
            fill &&
            fill.visible !== false &&
            fill.type === "SOLID") {
            this.child = flutterMaterial(node, this.child);
        }
        else {
            this.child = flutterContainer$1(node, this.child);
        }
        return this;
    }
    blendAttr(node) {
        this.child = flutterVisibility(node, this.child);
        this.child = flutterRotation(node, this.child);
        this.child = flutterOpacity(node, this.child);
        return this;
    }
    position(node, parentId) {
        this.child = flutterPosition(node, this.child, parentId);
        return this;
    }
}

class FlutterTextBuilder extends FlutterDefaultBuilder {
    constructor(optChild = "") {
        super(optChild);
    }
    reset() {
        this.child = "";
    }
    createText(node) {
        this.child = makeTextComponent(node);
        return this;
    }
    textAutoSize(node) {
        this.child = wrapTextAutoResize(node, this.child);
        return this;
    }
}
const makeTextComponent = (node) => {
    var _a, _b, _c;
    // only undefined in testing
    let alignHorizontal = (_c = (_b = (_a = node.textAlignHorizontal) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : "left";
    alignHorizontal =
        alignHorizontal === "justified" ? "justify" : alignHorizontal;
    // todo if layoutAlign !== MIN, Text will be wrapped by Align
    // if alignHorizontal is LEFT, don't do anything because that is native
    const textAlign = alignHorizontal !== "left"
        ? `\ntextAlign: TextAlign.${alignHorizontal},`
        : "";
    let text = node.characters;
    if (node.textCase === "LOWER") {
        text = text.toLowerCase();
    }
    else if (node.textCase === "UPPER") {
        text = text.toUpperCase();
    }
    // else if (node.textCase === "TITLE") {
    // TODO this
    // }
    const textStyle = getTextStyle(node);
    const style = textStyle
        ? `\nstyle: TextStyle(${indentString(textStyle)}\n),`
        : "";
    const splittedChars = text.split("\n");
    const charsWithLineBreak = splittedChars.length > 1 ? splittedChars.join("\\n") : text;
    const properties = `\n"${charsWithLineBreak}",${textAlign}${style}`;
    return `Text(${indentString(properties)}\n),`;
};
const getTextStyle = (node) => {
    // example: text-md
    let styleBuilder = "";
    const color = flutterColorFromFills(node.fills);
    if (color) {
        styleBuilder += `\n${color}`;
    }
    if (node.fontSize !== figma.mixed) {
        styleBuilder += `\nfontSize: ${numToAutoFixed(node.fontSize)},`;
    }
    if (node.textDecoration === "UNDERLINE") {
        styleBuilder += "\ndecoration: TextDecoration.underline,";
    }
    if (node.fontName !== figma.mixed) {
        const lowercaseStyle = node.fontName.style.toLowerCase();
        if (lowercaseStyle.match("italic")) {
            styleBuilder += "\nfontStyle: FontStyle.italic,";
        }
        // ignore the font-style when regular (default)
        if (!lowercaseStyle.match("regular")) {
            const value = node.fontName.style
                .replace("italic", "")
                .replace(" ", "")
                .toLowerCase();
            const weight = convertFontWeight(value);
            if (weight) {
                styleBuilder += `\nfontFamily: "${node.fontName.family}",`;
                styleBuilder += `\nfontWeight: FontWeight.w${weight},`;
            }
        }
    }
    // todo lineSpacing
    const letterSpacing = commonLetterSpacing(node);
    if (letterSpacing > 0) {
        styleBuilder += `\nletterSpacing: ${numToAutoFixed(letterSpacing)},`;
    }
    return styleBuilder;
};
const wrapTextAutoResize = (node, child) => {
    const fSize = flutterSize(node);
    const width = fSize.width;
    const height = fSize.height;
    const isExpanded = fSize.isExpanded;
    let result = "";
    if (node.textAutoResize === "NONE") {
        // = instead of += because we want to replace it
        const properties = `${width}${height}\nchild: ${child}`;
        result = `SizedBox(${indentString(properties)}\n),`;
    }
    else if (node.textAutoResize === "HEIGHT") {
        // if HEIGHT is set, it means HEIGHT will be calculated automatically, but width won't
        // = instead of += because we want to replace it
        const properties = `${width}\nchild: ${child}`;
        result = `SizedBox(${indentString(properties)}\n),`;
    }
    if (isExpanded) {
        const properties = `\nchild: ${result}`;
        return `Expanded(${indentString(properties)}\n),`;
    }
    else if (result.length > 0) {
        return result;
    }
    return child;
};

let parentId$1 = "";
let material$1 = true;
const flutterMain = (sceneNode, parentIdSrc = "", isMaterial = false) => {
    parentId$1 = parentIdSrc;
    material$1 = isMaterial;
    let result = flutterWidgetGenerator(sceneNode);
    // remove the last ','
    result = result.slice(0, -1);
    return result;
};
// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const flutterWidgetGenerator = (sceneNode) => {
    let comp = "";
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    const sceneLen = visibleSceneNode.length;
    visibleSceneNode.forEach((node, index) => {
        if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
            comp += flutterContainer(node, "");
        }
        //  else if (node.type === "VECTOR") {
        // comp = flutterVector(node);
        // }
        else if (node.type === "GROUP") {
            comp += flutterGroup(node);
        }
        else if (node.type === "FRAME") {
            comp += flutterFrame(node);
        }
        else if (node.type === "TEXT") {
            comp += flutterText(node);
        }
        if (index < sceneLen - 1) {
            // if the parent is an AutoLayout, and itemSpacing is set, add a SizedBox between items.
            // on else, comp += ""
            const spacing = addSpacingIfNeeded(node);
            if (spacing) {
                // comp += "\n";
                comp += spacing;
            }
            // don't add a newline at last element.
            comp += "\n";
        }
    });
    return comp;
};
const flutterGroup = (node) => {
    const properties = `\nchildren:[${flutterWidgetGenerator(node.children)}],`;
    return flutterContainer(node, `Stack(${indentString(properties)}\n),`);
};
const flutterContainer = (node, child) => {
    var _a;
    let propChild = "";
    let image = "";
    if ("fills" in node && ((_a = retrieveTopFill(node.fills)) === null || _a === void 0 ? void 0 : _a.type) === "IMAGE") {
        // const url = `https://via.placeholder.com/${node.width}x${node.height}`;
        // image = `Image.network("${url}"),`;
        // Flutter Web currently can't render network images :(
        image = `FlutterLogo(size: ${Math.min(node.width, node.height)}),`;
    }
    if (child.length > 0 && image.length > 0) {
        const prop1 = `\nPositioned.fill(\n${indentString(`child: ${child}`)}\n),`;
        const prop2 = `\nPositioned.fill(\n${indentString(`child: ${image}`)}\n),`;
        const propStack = `\nchildren: [${indentString(prop1 + prop2)}\n],`;
        propChild = `Stack(${indentString(propStack)}\n),`;
    }
    else if (child.length > 0) {
        propChild = child;
    }
    else if (image.length > 0) {
        propChild = image;
    }
    const builder = new FlutterDefaultBuilder(propChild);
    builder
        .createContainer(node, material$1)
        .blendAttr(node)
        .position(node, parentId$1);
    return builder.child;
};
const flutterText = (node) => {
    const builder = new FlutterTextBuilder();
    builder
        .createText(node)
        .blendAttr(node)
        .textAutoSize(node)
        .position(node, parentId$1);
    return builder.child;
};
const flutterFrame = (node) => {
    const children = flutterWidgetGenerator(node.children);
    // Ignoring when Frame has a single child was removed because Expanded only works in Row/Column and not in Container, so additional logic would be required elsewhere.
    if (node.layoutMode !== "NONE") {
        const rowColumn = makeRowColumn(node, children);
        return flutterContainer(node, rowColumn);
    }
    else {
        // node.layoutMode === "NONE" && node.children.length > 1
        // children needs to be absolute
        const properties = `\nchildren:[\n${indentString(children, 1)}\n],`;
        return flutterContainer(node, `Stack(${indentString(properties)}\n),`);
    }
};
const makeRowColumn = (node, children) => {
    // ROW or COLUMN
    const rowOrColumn = node.layoutMode === "HORIZONTAL" ? "Row" : "Column";
    let crossAlignType;
    switch (node.counterAxisAlignItems) {
        case "MIN":
            crossAlignType = "start";
            break;
        case "CENTER":
            crossAlignType = "center";
            break;
        case "MAX":
            crossAlignType = "end";
            break;
    }
    const crossAxisAlignment = `\ncrossAxisAlignment: CrossAxisAlignment.${crossAlignType},`;
    let mainAlignType;
    switch (node.primaryAxisAlignItems) {
        case "MIN":
            mainAlignType = "start";
            break;
        case "CENTER":
            mainAlignType = "center";
            break;
        case "MAX":
            mainAlignType = "end";
            break;
        case "SPACE_BETWEEN":
            mainAlignType = "spaceBetween";
            break;
    }
    const mainAxisAlignment = `\nmainAxisAlignment: MainAxisAlignment.${mainAlignType},`;
    let mainAxisSize;
    if (node.layoutGrow === 1) {
        mainAxisSize = "\nmainAxisSize: MainAxisSize.max,";
    }
    else {
        mainAxisSize = "\nmainAxisSize: MainAxisSize.min,";
    }
    const properties = mainAxisSize +
        mainAxisAlignment +
        crossAxisAlignment +
        `\nchildren:[\n${indentString(children, 1)}\n],`;
    return `${rowOrColumn}(${indentString(properties, 1)}\n),`;
};
// TODO Vector support in Flutter is complicated. Currently, AltConversion converts it in a Rectangle.
const addSpacingIfNeeded = (node) => {
    var _a;
    if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === "FRAME" && node.parent.layoutMode !== "NONE") {
        // check if itemSpacing is set and if it isn't the last value.
        // Don't add the SizedBox at last value. In Figma, itemSpacing CAN be negative; here it can't.
        if (node.parent.itemSpacing > 0) {
            if (node.parent.layoutMode === "HORIZONTAL") {
                return `\nSizedBox(width: ${numToAutoFixed(node.parent.itemSpacing)}),`;
            }
            else {
                // node.parent.layoutMode === "VERTICAL"
                return `\nSizedBox(height: ${numToAutoFixed(node.parent.itemSpacing)}),`;
            }
        }
    }
    return "";
};

let parentId;
let isJsx = false;
let layerName = false;
let material = true;
let recognize = false;
let mode;
figma.showUI(__html__, { width: 450, height: 550 });
const run = () => {
    var _a, _b;
    // ignore when nothing was selected
    if (figma.currentPage.selection.length === 0) {
        figma.ui.postMessage({
            type: "empty",
        });
        return;
    }
    // check [ignoreStackParent] description
    if (figma.currentPage.selection.length > 0) {
        parentId = (_b = (_a = figma.currentPage.selection[0].parent) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
    }
    let result = "";
    const convertedSelection = convertIntoAltNodes(figma.currentPage.selection, null);
    // @ts-ignore
    if (mode === "flutter") {
        result = flutterMain(convertedSelection, parentId, material);
    }
    else if (mode === "tailwind") {
        result = tailwindMain(convertedSelection, parentId, isJsx, layerName, recognize);
    }
    else if (mode === "swiftui") {
        result = swiftuiMain(convertedSelection, parentId);
    }
    else if (mode === "html") {
        result = htmlMain(convertedSelection, parentId, isJsx, layerName);
    }
    console.log(result);
    figma.ui.postMessage({
        type: "result",
        data: result,
    });
    if (mode === "tailwind" ||
        mode === "flutter" ||
        mode === "html" ||
        mode === "swiftui") {
        figma.ui.postMessage({
            type: "colors",
            data: retrieveGenericSolidUIColors(convertedSelection, mode),
        });
        figma.ui.postMessage({
            type: "gradients",
            data: retrieveGenericLinearGradients(convertedSelection, mode),
        });
    }
    if (mode === "tailwind") {
        figma.ui.postMessage({
            type: "text",
            data: retrieveTailwindText(convertedSelection),
        });
    }
};
figma.on("selectionchange", () => {
    run();
});
// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = (msg) => {
    if (msg.type === "tailwind" ||
        msg.type === "flutter" ||
        msg.type === "swiftui" ||
        msg.type === "html") {
        mode = msg.type;
        run();
    }
    else if (msg.type === "jsx" && msg.data !== isJsx) {
        isJsx = msg.data;
        run();
    }
    else if (msg.type === "layerName" && msg.data !== layerName) {
        layerName = msg.data;
        run();
    }
    else if (msg.type === "material" && msg.data !== material) {
        material = msg.data;
        run();
    }
    else if (msg.type === "recognize" && msg.data !== recognize) {
        recognize = msg.data;
        run();
    }
};
//# sourceMappingURL=code.js.map
