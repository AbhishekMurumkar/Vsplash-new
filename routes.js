const {Router} = require("express");
const allRouters = new Router({mergeParams:true});
const ordersController = require("./controllers/orders");

allRouters
.post("/create",ordersController.createOrder)
.post("/update",ordersController.updateOrder)
.get("/list",ordersController.listOrderGet)
.get("/search/:id",ordersController.searchOrder)
.delete("/delete/:id",ordersController.deleteOrder)
.use('*',(req,resp)=>{
    console.log(req)
    resp.status(404).send("No Such path")
})
module.exports=allRouters