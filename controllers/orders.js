const OrderModal = require("../models/orders");


const createOrder = async(req, resp) => {
    let statusCode=null;
    let message = null;
    try{
        console.log("in create order");
        let orderContent = req.body;
        let newOrderStatus =await OrderModal.createOrder(orderContent);
        console.log("orderstatus",newOrderStatus);
        statusCode = newOrderStatus.status;
        message = newOrderStatus.message;
    }catch(err){
        statusCode = err.status;
        message = err.message||err.toString();
    }finally{
        resp.status(statusCode).send(message)
    }
}

const updateOrder = async(req, resp) => {
    let statusCode=null;
    let message = null;
    try{
        if(!req.body.updatedDelivaryDate){throw {status:400,message:"Received no key 'updatedDelivaryDate'"}}
        let orderId = req.body.order_id;
        let dataToUpdate = req.body.updatedDelivaryDate;
        if(!orderId || !dataToUpdate){throw {status:400,message:"Missing 'order_id' or 'updatedDelivaryDate' key"}}
        let updateStatus =await OrderModal.updateOrder(orderId,dataToUpdate);

        statusCode = updateStatus.status;
        message = updateStatus.message;
    }catch(err){
        console.log(err)
        statusCode = err.status;
        message = err.message||err.toString();
    }finally{
        resp.status(statusCode).send(message)
    }
}
const listOrderGet = async(req, resp) => {
    let statusCode=null;
    let message = null;
    
    try{
        let {fromDate} = req.query;
        if(!fromDate){
            throw {status:400,message:"Found no 'fromDate' query in request"}
        }else{
            console.log(fromDate)
            let data= await OrderModal.getOrdersByDate(fromDate);
            statusCode=data.status;
            message=data.message;
        }
    }catch(err){
        console.log(err)
        statusCode = err.status;
        message = err.message||err.toString();
    }finally{
        resp.status(statusCode).send(message)
    }
}
const searchOrder = async(req, resp) => {
    let statusCode=null;
    let message = null;
    
    try{
        let mydata = await OrderModal.getOrders(req.params.id);
        statusCode = mydata.status;
        message =mydata.message;
    }catch(err){
        console.log(err)
        statusCode = err.status;
        message = err.message||err.toString();
    }finally{
        resp.status(statusCode).send(message)
    }
}
const deleteOrder = async(req, resp) => {
    let statusCode=null;
    let message = null;
    
    try{
        let mydata = await OrderModal.deleteOrder(req.params.id);
        statusCode = mydata.status;
        message =mydata.message;
    }catch(err){
        console.log(err)
        statusCode = err.status;
        message = err.message||err.toString();
    }finally{
        resp.status(statusCode).send(message)
    }
}
module.exports = {
    createOrder,
    updateOrder,
    listOrderGet,
    searchOrder,
    deleteOrder
}