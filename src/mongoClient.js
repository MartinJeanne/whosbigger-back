const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: String,
  url: String
});

const Image = mongoose.model('image', ImageSchema);


const CommuneSchema = new Schema({
  nom: String,
  centre: {
    type: {
      type: String,
      enum: ['Point'],  // Ensure it is 'Point'
    },
    coordinates: {
      type: [Number],
    }
  },
  poplation: Number,
  code: String
});

const Commune = mongoose.model('commune', CommuneSchema);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to mongo!'))
  .catch(console.error);

exports.saveImage = async function (name, url) {
  await Image.create({ name, url });
}

exports.getImage = async function (name) {
  return await Image.findOne({ name });
}


exports.saveCommunes = async function (communes) {
  await Commune.insertMany(communes);
}

exports.getCommunes = async function () {
  return await Commune.find();
}
