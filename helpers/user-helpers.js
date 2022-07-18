var db=require('./connection')
var collections=require('./collections')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
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
        let result;
        let i=1;
        return new Promise(async(resolve,reject)=>{
         await   db.get().collection(collections.USER_SESSIONS).insertOne({sessionData,"DateTime": new Date()}).then((res)=>{
                if(res){
                    i++;
                    db.get().collection(collections.USER_SESSIONS).createIndex( { "DateTime": i }, { expireAfterSeconds: 120 } )
                    result=res.insertedId.toString()
                    resolve(result)
                } 
            })
        })
    },
    getSession:(sessionId)=>{
        let sessionResult={status:false}

        return new Promise(async(resolve,reject)=>{
              sessionResult =await db.get().collection(collections.USER_SESSIONS).findOne({_id:ObjectId(sessionId)})
            if(sessionResult){
                sessionResult.status=true,
                resolve(sessionResult)
            }else{
                resolve(sessionResult)
            }
        })
    },
    deleteSession:(sessionId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_SESSIONS).remove({_id:ObjectId(sessionId)}).then((response)=>{
                resolve(response)
            })
        })

    },
    addToCart:(proId,userId)=>{
        // console.log(">>>>",proId,userId);
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collections.CART_COLLECTIONS).findOne({user:ObjectId(userId)})
            if(userCart){
                db.get().collection(collections.CART_COLLECTIONS).updateOne({user:ObjectId(userId)},
                {
                    $push:{product:ObjectId(proId)}
                }
                ).then((response)=>{
                    console.log(response);
                    resolve()
                })
                
            }else{
                let cartObj={
                    user:ObjectId(userId),
                    product:[ObjectId(proId)]
                }
                db.get().collection(collections.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
        })
    },
    getCartItems:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collections.CART_COLLECTIONS).aggregate([
                {
                    $match:{user:userId}
                },
                {
                    $lookup:{
                        from:collections.PRODUCT_COLLECTIONS,
                        let:{proList:'$product'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$proList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}