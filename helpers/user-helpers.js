var db=require('./connection')
var collections=require('./collections')
const bcrypt=require('bcrypt')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                resolve(data)
            })

        })
    }
}
