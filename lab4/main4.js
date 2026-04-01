/**
 * Функция-конструктор для базового предмета.
 * @constructor
 * @param {string} name - Название предмета.
 * @param {number} weight - Вес предмета.
 * @param {string} rarity - Редкость предмета.
 */
function Item(name, weight, rarity) {
    this.name = name;
    this.weight = weight;
    this.rarity = rarity;
}

/**
 * Возвращает информацию о предмете.
 * @returns {string} Строка с информацией о предмете.
 */
Item.prototype.getInfo = function () {
    return `Name: ${this.name}, Weight: ${this.weight}, Rarity: ${this.rarity}`;
};

/**
 * Устанавливает новый вес предмета.
 * @param {number} newWeight - Новый вес.
 */
Item.prototype.setWeight = function (newWeight) {
    this.weight = newWeight;
};

/**
 * Функция-конструктор для оружия. Наследует Item.
 * @constructor
 * @augments Item
 * @param {string} name - Название оружия.
 * @param {number} weight - Вес оружия.
 * @param {string} rarity - Редкость оружия.
 * @param {number} damage - Урон оружия.
 * @param {number} durability - Прочность оружия.
 */
function Weapon(name, weight, rarity, damage, durability) {
    Item.call(this, name, weight, rarity);
    this.damage = damage;
    this.durability = durability;
}
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

/**
 * Возвращает подробную информацию об оружии.
 * @returns {string} Строка с информацией.
 */
Weapon.prototype.getInfo = function () {
    return `${Item.prototype.getInfo.call(this)} | Damage: ${this.damage} | Durability: ${this.durability}`;
};

/**
 * Использовать оружие. Уменьшает прочность.
 * @returns {string} Результат использования.
 */
Weapon.prototype.use = function () {
    if (this.durability > 0) {
        this.durability -= 10;
        return `Used ${this.name}, durability is now ${this.durability}`;
    } else {
        return `${this.name} is broken. Good luck`;
    }
};

/**
 * Починить оружие. Задает прочность 100.
 */
Weapon.prototype.repair = function () {
    this.durability = 100;
    console.log(`${this.name} is repaired`);
};

const sword = new Weapon("Steel Sword", 3.5, "rare", 45, 100);
const helmet = new Item("Iron Helmet", 2.1, "common");
let ghost = null;

console.log(ghost?.getInfo());        // undefined
console.log(ghost?.name);             // undefined
console.log(ghost?.damage);           // undefined

console.log(sword?.getInfo());        // Name: Steel Sword, Weight: 3.5, Rarity: rare | Damage: 45 | Durability: 100
console.log(sword?.damage);           // 45
console.log(sword?.use());            // Used Steel Sword, durability is now 90

console.log(helmet?.getInfo());       // Name: Iron Helmet, Weight: 2.1, Rarity: common
console.log(helmet?.damage);         // undefined 

const inventory = {
    slot1: sword,
    slot2: null,
};

console.log(inventory.slot1?.getInfo()); // Name: Steel Sword, Weight: 3.5, Rarity: rare | Damage: 45 | Durability: 90
console.log(inventory.slot2?.getInfo()); // undefined 
console.log(inventory.slot3?.getInfo()); // undefined