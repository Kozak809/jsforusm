alert("Этот код выполнен из внешнего файла!");
console.log("Сообщение в консоли");

let name = "Student"; 
let birthYear = 2000;
let isStudent = false;

console.log("Name:", name);
console.log("Birth Year:", birthYear);
console.log("Is Student:", isStudent);

let score = prompt("Введите ваш балл:");

if (score === null || score.trim() === "" || isNaN(score)) {
  console.log("Ошибка: Введено не число или пустая строка!");
} else {
  score = Number(score);
  if (score >= 90) {
    console.log("Отлично!");
  } else if (score >= 70) {
    console.log("Хорошо");
  } else {
    console.log("Можно лучше!");
  }
}

for (let i = 1; i <= 5; i++) {
 console.log(`Итерация: ${i}`);
}