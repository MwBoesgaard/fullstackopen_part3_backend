const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const nameToAdd = process.argv[3]
const numberToAdd = process.argv[4]

const url = `mongodb+srv://mwboesgaard:${password}@cluster0.cyeqw.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
    })
    .then(
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log('some message')
          console.log(person)
        })
        mongoose.connection.close()
      })
    )
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: nameToAdd,
        number: numberToAdd,
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${nameToAdd} number ${numberToAdd} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
