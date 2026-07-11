import express from "express"
import {getUsersForSidebar} from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getConversationForSidebar } from "../controllers/message.controller.js"
import { getMessages } from "../controllers/message.controller.js"
import { upload } from "../middleware/upload.middlewware.js"
import { sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

// if you use this so no need to add protectRoute in router and if you not use router.use so have to add this 
router.use(protectRoute)

// router.get("/users",protectRoute,getUsersForSidebar)
// router.get("/conversation",protectRoute,getConversationForSidebar)
// router.get("/:id",protectRoute,getMessages)
// router.post("/send/:id",protectRoute,getMessages)

router.get("/users",getUsersForSidebar)
router.get("/conversation",getConversationForSidebar)
router.get("/:id",getMessages)
router.post("/send/:id",upload.single("media"),sendMessage)

export default router