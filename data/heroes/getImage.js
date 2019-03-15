const fs = require("fs");
const heroes = require("./all.json");

const first = process.argv[2]
const last = process.argv[3]

const findHero = () => (hero) => {
    const { fullName } = hero.biography;
    if (fullName.includes(first) && fullName.includes(last)) {
      return hero;
    }
}

function parseData() { 
    const hero = heroes.find(findHero());
    if (hero && hero.images && hero.images.sm) {
      console.log(hero.images.sm);
    }
}

parseData();