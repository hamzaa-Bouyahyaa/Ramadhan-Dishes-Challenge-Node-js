const { default: axios } = require("axios");
const dishes = require("../dishes");

exports.getSuggestion = async (req, res) => {
  try {
    var meals;
    var Possibleingredients = [];
    const day = req.query.day;

    if (!day) {
      res
        .status(404)
        .send("please enter a day number to suggest you a meal darling");
    } else if (parseInt(day) > 30 || parseInt(day) < 1) {
      res
        .status(404)
        .send(
          "please enter a day number between 1 and 30 to suggest you a meal darling"
        );
    } else {
      //day query factoring

      dishes.map((meal) => {
        meal.ingredients.map(
          (ingredient) =>
            (Possibleingredients = [...Possibleingredients, ingredient])
        );
      });
      await axios
        .get(
          `http://localhost:3000/cooktime?ingredient=${
            Possibleingredients[
              Math.floor(Math.random() * Possibleingredients.length)
            ]
          }&day=${day}`
        )
        .then((res) => (meals = res.data));

      const meal = meals[Math.floor(Math.random() * meals.length)];

      res.status(200).send(meal);
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
