import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
    },
    image: {
      type: String, 
    },
    video: {
      type: String,
    },
  },
  {
    timestamps: true, //createdAt and updatedAt will be automatically added to the schema
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
