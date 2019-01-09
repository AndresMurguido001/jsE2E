const fs = require("fs");
const heroes = require("../data/heroes.json");

function getNames() {
  heroes.forEach(hero => {
    const { fullName } = hero.biography;
    const nameArr = fullName.split(" ", 3);

    if (nameArr.length === 2) {
        // First,Last
        appendName(`${nameArr[0]},${nameArr[1]}\n`);
    }

    if (nameArr.length === 3) {
        // First,Last,Middle 
        appendName(`${nameArr[0]},${nameArr[2]},${nameArr[1]}\n`);
      }
  });
}

function appendName(name) {
    fs.appendFile("../data/names.txt", name, (err) => {
        if (err) {
            return console.log(err);
        }
    });
}

getNames();