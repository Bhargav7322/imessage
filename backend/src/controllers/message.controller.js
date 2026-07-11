// // import express from "express";
// // import Message from "../models/message.model.js";
// // import User from "../models/user.model.js";
// // import { upload } from "../middleware/upload.middlewware.js";
// // import { getReceiverSocketId ,io} from "../lib/socket.js";

// // export async function getUsersForSidebar(req, res) {
// //   try {
// //     const loggedInUserId = req.user._id;

// //     const filteredUsers = await User.find({
// //       _id: { $ne: loggedInUserId },
// //     }).select("-clerkId");

// //     res.status(200).json(filteredUsers);
// //   } catch (error) {
// //     console.log("Error in getUsersForSidebar:", error.message);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // }

// // export async function getConversationForSidebar(req, res) {
// //   try {
// //     const loggedInUserId = req.user._id;
// //     const converstion = await Message.aggregate([
// //       // 1. Keep only the messages I sent or received.
// //       {
// //         $match: {
// //           $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
// //         },
// //       },
// //       // 2. Collapse them into one row per chat partner, noting our latest message time.
// //       {
// //         $group: {
// //           // The partner is the other person on the message (not me).
// //           _id: {
// //             $cond: [
// //               { $eq: ["$senderId", loggedInUserId] },
// //               "$receiverId",
// //               "$senderId",
// //             ],
// //           },
// //           lastMessageAt: { $max: "$createdAt" },
// //         },
// //       },
// //       // 3. Put the most recent conversation at the top
// //       { $sort: { lastMessageAt: -1 } },
// //       // 4. Look up each partner's user profile (comes back as an array).
// //       {
// //         $lookup: {
// //           from: "users",
// //           localField: "_id",
// //           foreignField: "_id",
// //           as: "user",
// //         },
// //       },
// //       // 5. Pull that profile out of the array and make it the document.
// //       { $replaceRoot: { newRoot: { $first: "$user" } } },
// //       // 6. Hide the private clerkId field from the result.
// //       { $project: { clerkId: 0 } },
// //     ]);

// //     res.status(200).json(converstion);
// //   } catch (error) {
// //     console.error("Error in getConversationsForSidebar:", error.message);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // }

// // export async function getMessages(req, res) {
// //   try {
// //     const { id: userToChatId } = req.params;
// //     const myId = req.user_id;

// //     const messages = await Message.find({
// //       $or: [
// //         { senderId: myId, receiverId: userToChatId },
// //         { senderId: userToChatId, receiverId: myId },
// //       ],
// //     }).sort({ createdAt: 1 });
// //       res.status(200).json(messages);
// //   } catch (error) {
// //     console.error("Error in getMessages:", error.message);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // }

// // export async function sendMessage(req, res) {
// //   try {
// //     const { text } = req.body;
// //     const { id: receiverId } = req.params;
// //     const senderId = req.user._id;

// //     let imageUrl;
// //     let videoUrl;

// //     if (req.file) {
// //       if (!hasImageKitConfig()) {
// //         return res
// //           .status(500)
// //           .json({ message: "Media upload is not configured" });
// //       }
// //       const url = await uploadChatMedia(req.file);
// //       if (req.file.mimetype.startsWith("video/")) videoUrl = url;
// //       else imageUrl = url;
// //     }

// //     const newMessage = new Message({
// //       senderId,
// //       receiverId,
// //       text,
// //       image: imageUrl,
// //       video: videoUrl,
// //     });

// //     await newMessage.save();

// //     const reciverSocketId = getReceiverSocketId(receiverId)

// //     //only send the message in realtime if user is online 

// //     if(reciverSocketId){
// //       io.to(reciverSocketId).emit("newMessage",newMessage);
// //     }

// //     // for real time send message so we add socket.io
// //     // two type socket.io for backend and socket.io-client for frontend

// //     res.status(201).json(newMessage);
// //   } catch (error) {
// //     console.error(" Error in sendMessage:", error.message);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // }



// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";
// import { toast } from "react-hot-toast";

// export const useChatStore = create(
//   persist(
//     (set, get) => ({
//       users: [],
//       conversations: [],
//       // Messages are now keyed by the other user's id:
//       // { [userId]: Message[] }
//       messagesByUser: {},
//       selectedUser: null,
//       isUsersLoading: false,
//       isConversationsLoading: false,
//       isMessagesLoading: false,
//       activeConversationId: null,
//       searchQuery: "",
//       sidebarTab: "chats",
//       composerText: "",
//       isSoundEnabled: true,
//       isSendingMedia: false,

//       getUsers: async () => {
//         set({ isUsersLoading: true });
//         try {
//           const res = await axiosInstance.get("/messages/users");
//           set((state) => ({
//             users: res.data,
//             selectedUser:
//               state.selectedUser &&
//               res.data.some((user) => user._id === state.selectedUser._id)
//                 ? state.selectedUser
//                 : null,
//           }));
//         } catch (error) {
//           console.error("Error in getUsers:", error.message);
//         } finally {
//           set({ isUsersLoading: false });
//         }
//       },

//       getConversations: async () => {
//         set({ isConversationsLoading: true });
//         try {
//           const res = await axiosInstance.get("/messages/conversation");
//           set({ conversations: res.data });
//         } catch (error) {
//           console.error("Error in getConversations:", error.message);
//         } finally {
//           set({ isConversationsLoading: false });
//         }
//       },

//       // Fetches messages for a specific conversation and stores them
//       // under that user's id, without touching any other conversation's messages.
//       getMessages: async (userId) => {
//         if (!userId) return;
//         set({ isMessagesLoading: true });
//         try {
//           const res = await axiosInstance.get(`/messages/${userId}`);
//           set((state) => ({
//             messagesByUser: {
//               ...state.messagesByUser,
//               [userId]: res.data,
//             },
//           }));
//         } catch (error) {
//           console.error("Error in getMessages:", error.message);
//         } finally {
//           set({ isMessagesLoading: false });
//         }
//       },

//       sendMessage: async (messageData) => {
//         const { selectedUser, messagesByUser } = get();
//         if (!selectedUser) return false;

//         try {
//           const res = await axiosInstance.post(
//             `/messages/send/${selectedUser._id}`,
//             messageData,
//           );
//           const existing = messagesByUser[selectedUser._id] || [];
//           set((state) => ({
//             messagesByUser: {
//               ...state.messagesByUser,
//               [selectedUser._id]: [...existing, res.data],
//             },
//             composerText: "",
//           }));
//           get().getConversations();
//           return true;
//         } catch (error) {
//           toast.error(
//             error.response?.data?.message ||
//               "Failed to send message. Please try again.",
//           );
//           console.error("Error in sendMessage:", error.message);
//           return false;
//         }
//       },

//       // Appends an incoming socket message to the correct conversation
//       // (keyed by the sender's id), regardless of which chat is open.
//       subscribeToMessages: () => {
//         const socket = useAuthStore.getState().socket;
//         if (!socket) return;

//         socket.off("newMessage");
//         socket.on("newMessage", (newMessage) => {
//           const senderId = String(newMessage.senderId);
//           set((state) => ({
//             messagesByUser: {
//               ...state.messagesByUser,
//               [senderId]: [...(state.messagesByUser[senderId] || []), newMessage],
//             },
//           }));
//           get().getConversations();
//         });
//       },

//       unsubscribeFromMessages: () => {
//         const socket = useAuthStore.getState().socket;
//         socket?.off("newMessage");
//       },

//       setSelectedUser: (selectedUser) => {
//         set({ selectedUser });
//       },

//       // Switching conversations now always refetches that conversation's
//       // messages instead of reusing whatever was last loaded.
//       setActiveConversationId: (activeConversationId) => {
//         set((state) => ({
//           activeConversationId,
//           selectedUser:
//             state.users.find((user) => user._id === activeConversationId) ||
//             state.conversations.find(
//               (user) => user._id === activeConversationId,
//             ) ||
//             null,
//         }));

//         if (activeConversationId) {
//           get().getMessages(activeConversationId);
//         }
//       },

//       setSearchQuery: (searchQuery) => set({ searchQuery }),
//       setSidebarTab: (sidebarTab) => set({ sidebarTab }),
//       setComposerText: (composerText) => set({ composerText }),
//       setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),

//       sendTextMessage: async (conversationId) => {
//         const messageText = get().composerText.trim();
//         if (!conversationId || !messageText) return false;
//         return await get().sendMessage({ text: messageText });
//       },

//       sendMediaMessage: async (conversationId, file) => {
//         if (!conversationId || !file) return false;

//         const formData = new FormData();
//         formData.append("media", file);

//         set({ isSendingMedia: true });
//         try {
//           return await get().sendMessage(formData);
//         } finally {
//           set({ isSendingMedia: false });
//         }
//       },
//     }),
//     {
//       name: "imessage-chat-store",
//       partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
//     },
//   ),
// );




import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { upload } from "../middleware/upload.middlewware.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const converstion = await Message.aggregate([
      // 1. Keep only the messages I sent or received.
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // 3. Put the most recent conversation at the top
      { $sort: { lastMessageAt: -1 } },
      // 4. Look up each partner's user profile (comes back as an array).
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 5. Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      // 6. Hide the private clerkId field from the result.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(converstion);
  } catch (error) {
    console.error("Error in getConversationsForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id; // fixed: was req.user_id (undefined)

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res
          .status(500)
          .json({ message: "Media upload is not configured" });
      }
      const url = await uploadChatMedia(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    const reciverSocketId = getReceiverSocketId(receiverId);

    // only send the message in realtime if user is online
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(" Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function checkAuth(req, res) {
  if (!req.user) {
    res.status(401).json({ message: "User is not authenticated" });
    return;
  }
  res.status(200).json(req.user);
}