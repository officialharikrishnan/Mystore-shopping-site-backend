var db=require('./connection')
var collections=require('./collections')
module.exports={
    addProduct:(product,callback)=>{
        let myObj={
         product
        }
        db.get().collection(collections.PRODUCT_COLLECTIONS).insertOne(myObj).then((data)=>{
            console.log(data);
        })
        // console.log(product);
    },
    viewProducts:()=>{
        return new Promise(async(resolve,reject)=>{
          let products=await db.get().collection(collections.PRODUCT_COLLECTIONS).find().toArray()
          resolve(products)
          console.log(products);

        })
    }
}