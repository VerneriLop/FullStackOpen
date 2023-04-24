const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//hakee salasanan komentoriviltä
const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.e6wu6fk.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

//skeema, joka kertoo Mongooselle, miten muistiinpano-oliot tulee tallettaa tietokantaan.
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//Modelin Note määrittelyssä ensimmäisenä parametrina oleva merkkijono Note määrittelee, 
//että Mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan nimeltään notes, 
//sillä Mongoosen konventiona on määritellä kokoelmien nimet monikossa (esim. notes), 
//kun niihin viitataan skeeman määrittelyssä yksikkömuodossa (esim. Note).
const Note = mongoose.model('Note', noteSchema)

//luodaan skeemaa vastaava olio
const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

//tallennetaan olio tietokantaan
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})