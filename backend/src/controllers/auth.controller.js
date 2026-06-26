export async function checkAuth(req,res){
    if(!req.user){
        res.status(401).json({message:"User is not authenticated"})
        return
    }
    res.status(200).json(req.user)
}