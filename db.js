const mongoose = require('mongoose');

// Business Schema
const businessSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    ondcShopId: {
      type: String,
    },
    businessId: {
      type: String,
      required: true
    }
});

const Business = mongoose.model('Business', businessSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  businessId: {
      type: String,
      required: true
  },
  productId: {
      type: String,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  businessId: {
      type: String,
      required: true
  },
  orderId: {
      type: String,
      required: true
  },
  productId: {
      type: String,
      required: true
  },
  quantity: {
      type: Number,
      required: true
  },
  customerName: {
      type: String,
      required: true
  },
  orderStatus: {
      type: String,
      required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
    businessId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

const connectDB = async () => {
    try {
        await mongoose.connect('MongoURI',
         {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const db = {
    connectDB,
    Business,
    Product,
    Order,
    Payment
};

module.exports = db;
