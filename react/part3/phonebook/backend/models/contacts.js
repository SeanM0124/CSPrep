require('dotenv').config();
const url = process.env.MONGODB_URL;
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3
    },
    number: String,
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


// if (process.argv.length === 3) {
//   Contact.find({}).then(result => {
//     console.log('All contacts:');
//     result.forEach(contact => {
//       console.log(contact)
//     })
//     mongoose.connection.close()
//   })
// } else if (process.argv.length > 3) {
//   const person = new Contact({
//     name: process.argv[3] ? process.argv[3] : 'Unknown',
//     number: process.argv[4] ? process.argv[4] : ''
//   })

//   person.save().then(result => {
//     console.log('Contact added!')
//     console.log(result)
//     mongoose.connection.close()
//   })
// }

module.exports = mongoose.model('Contact', contactSchema);