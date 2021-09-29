const OrderModal                = require("./schemas/orders");
const dateFormatRegex = /^\d{4}\/\d{2}\/\d{2}$/;

const fieldsToBeShown = {
    _id     : 0,
    __v     : 0,
};

const getOrders=async(id)=>{
    let success=false;
    let message="null";
    let status=500;
    try{
        let myrecords = await OrderModal.findOne({"order_id":id},fieldsToBeShown);
        console.log(myrecords);
        success=true;
        status=200;
        message = myrecords;
    }catch(err){
        success=false;
        message=(err.message)?(err.message):("Error")
        status=(err.name=="ValidationError")?(400):(err.status||500);
    }finally{
        return {
            success,
            message,
            status
        }
    }
}

const getOrdersByDate = async(data)=>{
    let success=false;
    let message="null";
    let status=500;
    try{
        console.log("data",data)
        if(!data.match(dateFormatRegex)){
            throw {status:400,message:"Not a valid format for a date, required:'YYYY/MM/DD' "}
        }else if( new Date(data)=="Invalid Date"){
            throw {status:400,message:"Not a valid date"}
        }
        else{
            let myrecords = await OrderModal.find({"delivary_date":{
                $gte:new Date(data).setHours(0,0,0,0),
                $lte:new Date(data).setHours(23,59,59,1000)
            }},fieldsToBeShown).sort({"delivary_date":1});
            console.log(myrecords);
            success=true;
            status=200;
            message = myrecords;
        }
    }catch(err){
        success=false;
        message=(err.message)?(err.message):("Error")
        status=(err.name=="ValidationError")?(400):(err.status||500);
    }finally{
        return {
            success,
            message,
            status
        }
    }
}

const updateOrder = async(id,data)=> {
    let success=false;
    let message=null;
    let status=500;
    try{
        console.log(id,data);
        if(!id){
            throw {"status":400,"message":"No order id was found in data"} 
        }
        else if(!data.match(dateFormatRegex)){
            throw {status:400,message:"Not a valid format for request query"}
        }else if( new Date(data)=="Invalid Date"){
            throw {status:400,message:"Not a valid date"}
        }else{
            let saveStatus = await OrderModal.updateOne({"order_id":id},{$set:{"delivary_date":data}});
            if( saveStatus.matchedCount==0){
                throw {status:404,message:"No Order id was matched"}
            }
            success=true;
            status=200;
            message = (saveStatus.modifiedCount > 0)?("Updation Successful"):("No change")
        }
    }catch(err){
        success=false;
        message=(err.message)?(err.message):("Error")
        status=(err.name=="ValidationError")?(400):(err.status||500);
    }finally{
        return {
            success,
            message,
            status
        }
    }
}

const checkOrder = (id)=>{
    return new Promise((resolve,reject)=>{
        OrderModal
        .find({"order_id":id})
        .catch(err=>{reject({status:500,message:err.toString()})})
        .then((resp)=>{resolve({status:200,message:(resp)})})
    })
}

const createOrder = async(orderData)=>{
    let success=null;
    let message=null;
    let status=500;
    try{
        if(!orderData.order_id){throw {"status":400,"message":"No order id was found in data"} }
        let orderIdFound = await checkOrder(orderData.order_id)
        if(orderIdFound.message.length>1){
            throw {status:400,message:"Order Id already exists"}
        }else if(!orderData.delivary_date.match(dateFormatRegex)||!orderData.order_date.match(dateFormatRegex)){
            throw {status:400,message:"Got Invalid date format, required:'YYYY/MM/DD' "}
        }else{
            let newOrder = new OrderModal(orderData);
            console.log("new order",orderData,newOrder)
            await newOrder.save();
            success=true;
            message='order saved';
            status=200;
        }
    }catch(err){
        success=false;
        message=(err.message)?(err.message):("Error")
        status=(err.name=="ValidationError")?(400):(err.status||500);
    }finally{
        return {
            success,
            message,
            status
        }
    }
}

const deleteOrder = async(id)=>{
    let success=false;
    let message="null";
    let status=500;
    try{
        let myrecords = await OrderModal.deleteOne({"order_id":id},fieldsToBeShown);
        console.log(myrecords);
        success=true;
        status=200;
        message = myrecords;
    }catch(err){
        success=false;
        message=(err.message)?(err.message):("Error")
        status=(err.name=="ValidationError")?(400):(err.status||500);
    }finally{
        return {
            success,
            message,
            status
        }
    }
}
module.exports={
    createOrder,
    updateOrder,
    getOrders,
    getOrdersByDate,
    deleteOrder
}