/**
 * Tidy Up - Elimina los saltos de línea del resultado.
 * @param {string[]} records - El array de registros.
 * @param {boolean} tidyUp - Si se debe eliminar los saltos de línea.
 * @returns {string[]} - Un array de registros procesados.
 */
function tidyUp(records, tidyUp) {
    if (tidyUp) {
        return records.map(record => record.replace(/\n/g, ' ').trim());
    }
    return records;
}

/**
 * Attack the Clones - Elimina los duplicados del resultado.
 * @param {string[]} records - El array de registros.
 * @param {boolean} removeDuplicates - Si se deben eliminar los duplicados.
 * @returns {string[]} - Un array de registros únicos.
 */
function attackTheClones(records, removeDuplicates) {
    if (removeDuplicates) {
        return [...new Set(records)];
    }
    return records;
}

/**
 * Explode - Divide el texto en registros usando el delimitador.
 * @param {string} text - El texto que se quiere dividir.
 * @param {string} delimiter - El delimitador ('New Lines', 'Spaces', 'Commas', 'Semicolons').
 * @returns {string[]} - Un array de registros divididos.
 */
function explodeRecords(text, delimiter) {
    const delimiters = {
        'newLines': '\n',
        'Spaces': ' ',
        'Commas': ',',
        'Semicolons': ';'
    };
    const delim = delimiters[delimiter] ?? delimiter;
    if ([null, undefined].includes(delim)) {
        throw new Error('Delimiter not recognized');
    }
    return text.split(delim).map(record => record.trim()).filter(record => record.length > 0);
}

/**
 * Quotes - Agrega comillas a cada registro.
 * @param {string[]} records - El array de registros.
 * @param {string} quoteType - El tipo de comillas ('No', 'double', 'simple').
 * @returns {string[]} - Un array de registros con comillas.
 */
function addQuotes(records, quoteType = "") {
    const quotes = {
        'No': '',
        'double': '"',
        'simple': "'"
    };
    const quote = quotes[quoteType];
    return records.map(record => `${quote}${record}${quote}`);
}

/**
 * Delimiter - Usa un delimitador entre registros.
 * @param {string[]} records - El array de registros.
 * @param {string} delimiter - El delimitador a usar.
 * @returns {string} - El texto con registros separados por el delimitador.
 */
function joinWithDelimiter(records, delimiter) {
    return records.join(delimiter);
}

/**
 * Tags - Usa etiquetas para envolver los registros.
 * @param {string[]} records - El array de registros.
 * @param {string} tag - La etiqueta para envolver los registros.
 * @returns {string} - El texto con registros envueltos en etiquetas.
 */
function wrapWithTags(records, openTag = "", closeTag = "") {
    return records.map(record => `${openTag}${record}${closeTag}`).join('\n');
}

/**
 * Interval - Agrega una nueva línea después de cada x cantidad de registros.
 * @param {string[]} records - El array de registros.
 * @param {number} interval - La cantidad de registros después de la cual se agrega un salto de línea.
 * @returns {string} - El texto con nuevos saltos de línea después de cada intervalo.
 */
function addInterval(records, interval) {
    if (interval <= 0) return records;
    return records.reduce((result, record, index) => {
        if (index > 0 && index % interval === 0) {
            result += '\n';
        }
        result += record + '\n';
        return result;
    }, '').trim();
}

/**
 * Interval Wrap - Envuelve los intervalos con etiquetas.
 * @param {string[]} records - El array de registros.
 * @param {number} interval - La cantidad de registros después de la cual se agrega un salto de línea.
 * @param {string} tag - La etiqueta para envolver los intervalos.
 * @returns {string} - El texto con intervalos envueltos en etiquetas.
 */
function wrapIntervals(records, interval, tag) {
    if (interval <= 0) return records;
    return records.reduce((result, record, index) => {
        if (index % interval === 0) {
            result += index > 0 ? `${tag}\n${tag}` : tag;
        }
        result += record + '\n';
        return result;
    }, '').trim() + tag;
}

// Ejemplo de uso
// const text = "apple,banana,orange,grape";
// const records = explodeRecords(text, 'Commas');

// console.log(tidyUp(records, true)); // [ 'apple', 'banana', 'orange', 'grape' ]
// console.log(attackTheClones(records, true)); // [ 'apple', 'banana', 'orange', 'grape' ]
// console.log(addQuotes(records, 'double')); // [ '"apple"', '"banana"', '"orange"', '"grape"' ]
// console.log(joinWithDelimiter(records, ' | ')); // 'apple | banana | orange | grape'
// console.log(wrapWithTags(records, 'strong')); // '<strong>apple</strong>\n<strong>banana</strong>\n<strong>orange</strong>\n<strong>grape</strong>'
// console.log(addInterval(records, 2)); // 'apple\nbanana\n\orange\ngrape'
// console.log(wrapIntervals(records, 2, 'div')); // '<div>apple\nbanana\n</div>\n<div>orange\ngrape\n</div>'

export {
    explodeRecords,
    tidyUp,
    attackTheClones,
    addQuotes,
    joinWithDelimiter,
    wrapWithTags,
    addInterval,
    wrapIntervals
}