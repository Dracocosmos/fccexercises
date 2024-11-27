require('dotenv').config();
let mongoose = require('mongoose')

// connection url:
// mongodb+srv://dracocosmos:<db_password>@freecodecamp-exercise.lh9go.mongodb.net/?retryWrites=true&w=majority&appName=freecodecamp-exercise

//connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  new Person({
    name: 'hello',
    age: 2,
    favoriteFoods: ['las', 'mac']
  }).save(function(err, data) {
    done(null, data);
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data) {
    done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }).exec(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }).exec(function(err, data) {
    console.log(data, err)
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Peron.findById(personId).exec(function(err, data) {
    console.log(data, err)
    if (err) return console.error(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, function(err, data) {
    data.favoriteFoods.push(foodToAdd)
    console.log(data, err)
    data.save(function(err, data) {
      if (err) return console.error(err);
      done(null, data);
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    // search this
    { name: personName },
    // set to this
    { age: ageToSet },
    // this makes it return the new document, not old
    { new: true },
    // callback
    function(err, data) {
      console.log(data, err)
      if (err) return console.error(err);
      done(null, data);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId,
    function(err, data) {
      console.log(data, err)
      if (err) return console.error(err);
      done(null, data);
    }
  );
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  const data = Person.remove(
    { name: nameToRemove },
    function(err, data) {
      console.log(data)
      if (err) return console.error(err);
      done(null, data);
    }
  )
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person
    .find(

  )
    .sort(
  )
    .limit(
  )
    .select(
  )
    .exec()


  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
