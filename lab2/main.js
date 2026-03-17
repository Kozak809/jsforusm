/**
 * Выводит элементы массива в консоль в формате "Element i: value x"
 * @param {Array} array - Исходный массив
 * @returns {undefined}
 */
function printArray(array) {
    for (let i = 0; i < array.length; i++) {
        console.log(`Element ${i}: value ${array[i]}`);
    }
}

/**
 * Выводит элементы массива в консоль в формате "i: x"
 * @param {Array} array - Исходный массив
 * @returns {undefined}
 */
function printArray1(array) {
    for (let i = 0; i < array.length; i++) {
        console.log(`${i}:  ${array[i]}`);
    }
}

/**
 * Выполняет колбэк для каждого элемента массива
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => void
 * @returns {undefined}
 */
function forEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}

forEach([1, 2, 3], (element, index, array) => {
    console.log(`Element ${index}: value ${element}`);
});

/**
 * Создаёт новый массив из результатов вызова колбэка для каждого элемента
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => newElement
 * @returns {Array} Новый массив преобразованных элементов
 */
function map(array, callback) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(callback(array[i], i, array));
    }
    return newArray;
}

const numbers = [1, 2, 3];
const squared = map(numbers, (element) => element * element);
console.log(squared); // [1, 4, 9]

/**
 * Создаёт новый массив из элементов, прошедших проверку колбэка
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => boolean
 * @returns {Array} Новый массив отфильтрованных элементов
 */
function filter(array, callback) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

const numbers1 = [1, 2, 3, 4, 5];
const evenNumbers = filter(numbers1, (element) => element % 2 === 0);
console.log(evenNumbers); // [2, 4]

/**
 * Возвращает первый элемент массива, удовлетворяющий условию колбэка
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => boolean
 * @returns {*} Первый подходящий элемент или undefined
 */
function find(array, callback) {
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            return array[i];
        }
    }
    return undefined;
}

const numbers2 = [1, 2, 3, 4, 5];
const evenNumber = find(numbers2, (element) => element % 2 === 0);
console.log(evenNumber); // 2

/**
 * Проверяет, есть ли хотя бы один элемент, удовлетворяющий условию колбэка
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => boolean
 * @returns {boolean} true если найден хотя бы один подходящий элемент
 */
function some(array, callback) {
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            return true;
        }
    }
    return false;
}

const numbers3 = [1, 2, 3, 4, 5];
const evenNumber1 = some(numbers3, (element) => element % 2 === 0);
console.log(evenNumber1); // true

/**
 * Проверяет, удовлетворяют ли все элементы массива условию колбэка
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (element, index, array) => boolean
 * @returns {boolean} true если все элементы прошли проверку
 */
function every(array, callback) {
    for (let i = 0; i < array.length; i++) {
        if (!callback(array[i], i, array)) {
            return false;
        }
    }
    return true;
}

const numbers5 = [2, 4, 6];
const allEven = every(numbers5, (element) => element % 2 === 0);
console.log(allEven); // true

/**
 * Последовательно обрабатывает элементы массива, накапливая результат
 * @param {Array} array - Исходный массив
 * @param {Function} callback - Функция: (accumulator, element, index, array) => newAccumulator
 * @param {*} [initialValue] - Начальное значение аккумулятора (необязательно)
 * @returns {*} Итоговое значение аккумулятора или undefined если массив пустой
 */
function reduce(array, callback, initialValue) {
    if (array.length === 0 && initialValue === undefined) {
        return undefined;
    }
    let accumulator;
    let startIndex;
    if (initialValue !== undefined) {
        accumulator = initialValue;
        startIndex = 0;
    } else {
        accumulator = array[0];
        startIndex = 1;
    }
    for (let i = startIndex; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
}

const numbers6 = [1, 2, 3, 4, 5];
const sum = reduce(numbers6, (accumulator, element) => accumulator + element, 0);
console.log(sum); // 15