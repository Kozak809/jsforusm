/**
 * Класс, представляющий базовый предмет инвентаря.
 */
class Item {
    /**
     * Создает новый предмет.
     * @param {string} name - Название предмета.
     * @param {number} weight - Вес предмета.
     * @param {string} rarity - Редкость предмета.
     */
    constructor(name, weight, rarity) {
        this.name = name;
        this.weight = weight;
        this.rarity = rarity;
    }
    /**
     * Возвращает информацию о предмете.
     * @returns {string} Строка с информацией о предмете.
     */
    getInfo() {
        return `Name: ${this.name}, Weight: ${this.weight}, Rarity: ${this.rarity}`
    }

    /**
     * Устанавливает новый вес предмета.
     * @param {number} newWeight - Новый вес.
     */
    setWeight(newWeight) {
        this.weight = newWeight;
    }
}

/**
 * Класс, представляющий оружие. Наследует класс Item.
 * @extends Item
 */
class Weapon extends Item {
    /**
     * Создает новое оружие.
     * @param {string} name - Название оружия.
     * @param {number} weight - Вес оружия.
     * @param {string} rarity - Редкость оружия.
     * @param {number} damage - Урон, наносимый оружием.
     * @param {number} durability - Прочность оружия.
     */
    constructor(name, weight, rarity, damage, durability) {
        super(name, weight, rarity);
        this.damage = damage;
        this.durability = durability;
    }
    /**
     * Возвращает подробную информацию об оружии.
     * @returns {string} Строка с информацией об оружии.
     */
    getInfo() {
        return `${super.getInfo()} | Damage: ${this.damage} | Durability: ${this.durability}`;
    }

    /**
     * Использовать оружие. Уменьшает прочность на 10.
     * @returns {string} Результат использования оружия.
     */
    use() {
        if (this.durability > 0) {
            this.durability -= 10;
            return `Used ${this.name}, durability is now ${this.durability}`;
        } else {
            return `${this.name} is broken. Good luck`;
        }
    }

    /**
     * Починить оружие. Восстанавливает прочность до 100.
     */
    repair() {
        this.durability = 100;
        console.log(`${this.name} is repaired`)
    }
}
const helmet = new Item("Iron Helmet", 2.1, "common");
const amulet = new Item("Magic Amulet", 0.3, "legendary");

console.log(helmet.getInfo()); // Name: Iron Helmet, Weight: 2.1, Rarity: common

helmet.setWeight(1.8);
console.log(helmet.getInfo()); // Name: Iron Helmet, Weight: 1.8, Rarity: common

console.log(amulet.getInfo()); // Name: Magic Amulet, Weight: 0.3, Rarity: legendary

const sword = new Weapon("Steel Sword", 3.5, "rare", 45, 100);
const dagger = new Weapon("Shadow Dagger", 1.2, "uncommon", 25, 20);
const staff = new Weapon("Broken Staff", 2.8, "common", 10, 0);

console.log(sword.getInfo()); // Name: Steel Sword, Weight: 3.5, Rarity: rare | Damage: 45 | Durability: 100

console.log(sword.use()); // Used Steel Sword, durability is now 90
console.log(sword.use()); // Used Steel Sword, durability is now 80
console.log(sword.use()); // Used Steel Sword, durability is now 70

sword.repair();                    // Steel Sword is repaired
console.log(sword.durability);     // 100

console.log(dagger.getInfo());
// Name: Shadow Dagger, Weight: 1.2, Rarity: uncommon | Damage: 25 | Durability: 20

console.log(dagger.use()); // Used Shadow Dagger, durability is now 10
console.log(dagger.use()); // Used Shadow Dagger, durability is now 0
console.log(dagger.use()); // Shadow Dagger is broken. Good luck

console.log(staff.use());  // Broken Staff is broken. Good luck
staff.repair();            // Broken Staff is repaired
console.log(staff.use());  // Used Broken Staff, durability is now 90

console.log(sword.weight); // 3.5
sword.setWeight(5.0);
console.log(sword.weight); // 5