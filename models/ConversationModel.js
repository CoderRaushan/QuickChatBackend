// import mongoose from "mongoose";

// const conversationSchema = new mongoose.Schema({
//   participants: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   ],
//   message: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Message'
//     }],
// });

// const Conversation = mongoose.model('Conversation', conversationSchema);

// export default Conversation;
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
