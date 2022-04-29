const router = require("express").Router();
const Character = require("../models/Character.model");
const axios = require("axios");


const ApiService = require("../services/api.service");
const apiService = new ApiService();


router.get("/", (req, res, next) => {
  apiService
    .getAllCharacters()
    .then(charactersFromApi => {
      res.render("characters/characters-list", {characters: charactersFromApi.data})
    })
    .catch(err => {
          console.log('Error getting characters from API...', err);
        })
});

router.get("/create", (req, res, next) => {
  res.render("characters/character-create");
});

router.post('/create', (req, res, next) => {

  const characterDetails = {
    name: req.body.name,
    occupation: req.body.occupation,
    weapon: req.body.weapon,
  }


  apiService
    .createCharacter(characterDetails)
    .then(() => {
      res.redirect("/characters");
    })
    .catch((err) => {
      console.log("Error creating new character...", err);
    });
})

router.get("/:characterId", (req, res, next) => {
  let id = req.params.characterId;

  apiService
    .getOneCharacter(id)
    .then(character => {
      res.render("characters/character-details", character.data)
    })
    .catch(error => {
      console.log("Error getting the character details from the database", error);
      next(error);
    });
  
});

router.get("/:characterId/edit", (req, res, next) => {

  const id = req.params.characterId;


  apiService
    .getOneCharacter(id)
    .then(characterFromApi => {
      res.render("characters/character-edit", characterFromApi.data);
    })
    .catch((err) => {
      console.log("Error editing character...", err);
    });
});

router.post("/:characterId/edit", (req, res, next) => {
  const id = req.params.characterId;
  const newDetails = req.body;

  apiService
    .editCharacter(id, newDetails)
    .then(() => {
      res.redirect("/characters");
    })
    .catch((err) => {
      console.log("Error updating character...", err);
    });
});

router.post("/:characterId/delete", (req, res, next) => {
  const id = req.params.characterId;

  apiService
    .deleteCharacter(id)
    .then((response) => {
      res.redirect("/characters");
    })
    .catch((err) => {
      console.log("Error deleting character...", err);
    });
});


module.exports = router;
