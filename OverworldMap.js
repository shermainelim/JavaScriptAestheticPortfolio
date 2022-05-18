class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }
    this.isCutscenePlaying = false;
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    //const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          return playerState.storyFlags[sf];
        });
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

const sleep = document?.querySelector(".sleep");
const music = document?.querySelector(".music");

sleep?.addEventListener("mousedown", clicked1, false);
music?.addEventListener("mousedown", clicked2, false);
// city?.addEventListener("mousedown", clicked3, false);
const soundPlayer = new Audio("/images/characters/people/music.mp3");
function clicked1(e) {
  e.preventDefault();
  alert("Music stopped");
  soundPlayer.pause();
  soundPlayer.currentTime = 0;
}
function clicked2(e) {
  e.preventDefault();
  alert("Music started");

  soundPlayer.play();
  soundPlayer.loop = true;
}

const city = document?.querySelector(".city");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

city.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

//moon
const moon = document?.querySelector(".moon");
const modal2 = document.querySelector(".modal2");

const closeButton2 = document.querySelector(".close-button2");

function toggleModal2() {
  modal2.classList.toggle("show-modal2");
}

function windowOnClick2(event) {
  if (event.target === modal2) {
    toggleModal2();
  }
}

moon.addEventListener("click", toggleModal2);
closeButton2.addEventListener("click", toggleModal2);
window.addEventListener("click", windowOnClick2);

//cityDay

const cityDay = document?.querySelector(".cityDay");
const modal3 = document.querySelector(".modal3");

const closeButton3 = document.querySelector(".close-button3");

function toggleModal3() {
  modal3.classList.toggle("show-modal3");
}

function windowOnClick3(event) {
  if (event.target === modal3) {
    toggleModal3();
  }
}

cityDay.addEventListener("click", toggleModal3);
closeButton3.addEventListener("click", toggleModal3);
window.addEventListener("click", windowOnClick3);

window.OverworldMaps = {
  Kitchen: {
    id: "Kitchen",
    lowerSrc: "/images/maps/kawaii.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(50),
      }),
    },
  },
};
