
import multer from "multer"

const MAX_FILE_SIZE = 25*1024*1024  //25MB

export const upload = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:MAX_FILE_SIZE},
    fileFilter:(req,file,cb)=>{
        const isImage = file.mimetype.startsWith("image/")
        const isVideo = file.mimetype.startsWith("video/")
        const isAudio = file.mimetype.startsWith("audio/")
        const isDoc = file.mimetype.startsWith("application/") || file.mimetype.startsWith("text/")
    
    if(!isImage && !isVideo && !isAudio && !isDoc){
        cb(new Error("File type not supported"))
        return
    }
    cb(null,true)
    }
})