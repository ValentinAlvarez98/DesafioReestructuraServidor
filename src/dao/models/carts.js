import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({
      products: [{
            product: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "products",
                  required: true,
            },
            quantity: {
                  type: Number,
                  required: true,
                  default: 1,
            },
      }, ],
      id: {
            type: Number,
            required: true,
      },

      date_created: {
            type: Date,
            default: Date.now(),
      },

});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;