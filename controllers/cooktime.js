const { default: axios } = require("axios");
const dishes = require("../dishes");
const moment = require("moment");

exports.getCookTime = async (req, res) => {
  try {
    var prayerTimes = {};
    const day = req.query.day;
    const ingredient = req.query.ingredient;

    if (!day || !ingredient) {
      res
        .status(404)
        .send(
          "ingredient or a day must be missed. please enter the both of them"
        );
    }

    //day query factoring
    const usefulDay = day.length == 1 ? "0" + day : day;

    //ingredient query factoring
    const usefulIngredient =
      ingredient.toLowerCase().charAt(0).toUpperCase() + ingredient.slice(1);

    //prayertimes get
    await axios
      .get(
        "https://api.aladhan.com/v1/hijriCalendar?latitude=35.8245&longitude=10.6346&method=1&month=9&year=1443"
      )
      .then((res) => (prayerTimes = res.data.data));

    //ramadhan day table based on day query
    const RamadhanDay = prayerTimes.filter((prayerTime) => {
      return prayerTime.date.gregorian.day == usefulDay;
    });

    //meals table based on ingredient query
    const meals = dishes.filter((dish) =>
      dish.ingredients.includes(usefulIngredient)
    );

    if (RamadhanDay.length === 0 && meals.length === 0) {
      res
        .status(404)
        .send(
          "Ingredient is not found. Also, the day in Invalid, Please take a day between 01 and 30 and try another ingredient like `carrot`"
        );
    } else if (RamadhanDay.length !== 0 && meals.length === 0) {
      res
        .status(404)
        .send("Ingredient is not found. Try another ingedient like `carrot`");
    } else if (RamadhanDay.length === 0 && meals.length !== 0) {
      res.status(404).send("The day is invalid. Try a day between 01 and 30");
    } else {
      const duration = moment
        .utc(
          moment(RamadhanDay[0].timings.Maghrib.slice(0, 5), "HH:mm:ss").diff(
            moment(RamadhanDay[0].timings.Asr.slice(0, 5), "HH:mm:ss")
          )
        )
        .format("hh:mm:ss");

      //duration with minutes including 15 minutes before maghrib
      const usefulDuration = moment.duration(duration).asMinutes() - 15;

      const response = meals.map((meal) => {
        if (meal.duration <= usefulDuration) {
          return {
            ...meal,
            cooktime: `${Math.abs(
              usefulDuration - meal.duration
            )} minutes after Asr`,
          };
        } else {
          return {
            ...meal,
            cooktime: `${Math.abs(
              usefulDuration - meal.duration
            )} minutes before Asr`,
          };
        }
      });

      //response with no duration
      const usefulResponse = response.map((meal) => {
        delete meal.duration;
        return meal;
      });
      res.status(200).send(usefulResponse);
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
