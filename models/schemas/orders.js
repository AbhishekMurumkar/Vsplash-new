const mongoose = require('mongoose');
const customvalidator = require("validator");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    order_id:{
        required:true,
        type:Number
    },
    item_name:{
        type:String,
        required:true
    },
    cost:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>customvalidator.isCurrency(v,{
                require_symbol: false,
                allow_space_after_symbol:true
            })
        }
    },
    order_date:{
        type:Date,
        required:true,
        default:Date.now(),
        validate:{
            validator:(v)=>customvalidator.isDate(v)
        }
    },
    delivary_date:{
        type:Date,
        required:true,
        default:Date.now(),
        validate:{
            validator:(v)=>customvalidator.isDate(v)
        }
    }
});

let OrderModel = mongoose.model('Order',OrderSchema,"Orders");
module.exports= OrderModel;