// import mongoose from 'mongoose';

// const clipSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     required: true,
//   },
//   tag: {
//     type: String,
//     required: true, 
//     enum: ['Stitching', 'Polishing', 'Cutting', 'Lasting', 'Hand Stitching']
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   duration: {
//     type: String,
//     default: '0:15'
//   },
//   views: {
//     type: String,
//     enum: ['Seen', 'Sent'],
//     default: 'Sent'
//   },
//   url: {
//     type: String,
//     required: true,
//   }
// }, {
//   timestamps: true,
// });

// const Clip = mongoose.model('Clip', clipSchema);

// export default Clip;
// import mongoose from 'mongoose';

// const clipSchema = new mongoose.Schema({
//   order_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },
//   artisan_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//   title:         { type: String, required: true, default: 'Workshop Clip' },
//   tag:           { type: String, enum: ['Stitching','Polishing','Cutting','Lasting','Hand Stitching'], default: 'Stitching' },
//   duration:      { type: String, default: '0:15' },
//   video_url:     { type: String, required: true },
//   thumbnail_url: { type: String, default: '' },
//   status:        { type: String, enum: ['Live','Archived','Pending Review'], default: 'Pending Review' },
//   views:         { type: String, enum: ['Seen','Sent'], default: 'Sent' }
// }, { timestamps: true });

// export default mongoose.model('Clip', clipSchema);
import mongoose from 'mongoose';

const clipSchema = new mongoose.Schema({
  order_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },
  artisan_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title:         { type: String, required: true, default: 'Workshop Clip' },
  tag:           { type: String, enum: ['Stitching','Polishing','Cutting','Lasting','Hand Stitching','production'], default: 'Stitching' },
  duration:      { type: String, default: '0:20' },
  video_url:     { type: String, required: true },
  thumbnail_url: { type: String, default: '' },
  status:        { type: String, enum: ['Live','Archived','Pending Review'], default: 'Pending Review' },
  views:         { type: String, enum: ['Seen','Sent'], default: 'Sent' },
  isYouTube:     { type: Boolean, default: false },
  uploadedBy:    { type: String, enum: ['artisan', 'admin'], default: 'artisan' }
}, { timestamps: true });

export default mongoose.model('Clip', clipSchema);