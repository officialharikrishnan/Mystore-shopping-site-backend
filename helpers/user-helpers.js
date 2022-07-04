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
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=null
            let response={}
            let user=await db.get().collection(collections.USER_COLLECTIONS).findOne({phone:userData.phone})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        response.status=false
                        resolve({status:false})
                    }
                })
            }else{
                response.status=false
                resolve({status:false})

            }
        })
    },
    sessionCreate:(sessionData)=>{
        console.log(sessionData);
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_SESSIONS).insertOne({sessionData,"DateTime": new Date()}).then((res)=>{
                resolve(res)
            })
        }),
        db.get().collection(collections.USER_SESSIONS).createIndex( { "DateTime": 1 }, { expireAfterSeconds: 60 } )
    }
}
