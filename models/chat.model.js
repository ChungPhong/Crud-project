const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
    user_id: String,
    content: String,
    room_chat_id: String,
    images: Array,
    deleted: {
      default: false,
      type: Boolean,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", customer, "chats");

module.exports = Chat;
