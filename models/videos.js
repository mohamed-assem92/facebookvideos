const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({

})

let VideoModel = {};
VideoModel.model = mongoose.model("videos", videoSchema);



module.exports = VideoModel;
