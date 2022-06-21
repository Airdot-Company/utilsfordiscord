const numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];

export function randomNumber(){
    const n = Math.floor(Math.random() * Math.floor(numbers.length-1)) + 1;

    return numbers[n];
}

export function generateId(){
    return `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
}
