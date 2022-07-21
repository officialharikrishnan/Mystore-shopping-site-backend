var db=require('./connection')
var collections=require('./collections')
const { ObjectId } = require('mongodb')
module.exports={
    addProduct:(product,callback)=>{
        let myObj={
         product
        }
        db.get().collection(collections.PRODUCT_COLLECTIONS).insertOne(myObj).then((data)=>{
        })
        // console.log(product);
    },
    viewProducts:()=>{
        return new Promise(async(resolve,reject)=>{
          let products=await db.get().collection(collections.PRODUCT_COLLECTIONS).find().toArray()
          resolve(products)

        })
    },
    viewOneProduct:(ProductId)=>{
        console.log("view id",ProductId);
        return new Promise(async(resolve,reject)=>{
            let productDetails=await db.get().collection(collections.PRODUCT_COLLECTIONS).findOne({_id:ObjectId(ProductId)})
            if(productDetails){
                resolve(productDetails);
            }else{
                console.log("an errrorrr");
            }
        })
    },
    deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTIONS).remove({_id:ObjectId(productId)}).then((response)=>{
                resolve(response)
            })
        })
    }
}