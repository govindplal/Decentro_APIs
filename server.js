const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Importing uuid library to generate unique IDs
const app = express();
const db = require('./db');
app.use(express.json());

// Connect to the database
db.connectDB();

const Business = db.Business;

// Request Payload Example:
// {
//   "business_name": "Example Business"
// }

// Register a new business

app.post('/api/v1/ondc/registration', async (req, res) => {
    try {
        const { business_name: businessName } = req.body;

        if (!businessName) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        const businessId = uuidv4(); // Unique business ID

        // Create a new business instance
        const newBusiness = new Business({
            name: businessName,
            businessId: businessId
        });

        // Saving the new business in the database
        await newBusiness.save();

        res.json({
            status: 'success',
            message: 'Business registered successfully',
            data: {
                business_id: businessId,
                business_name: businessName
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Business registration failed'
        });
    }
});

// Request Payload Example:
// {
//   "business_id": "exampleBusinessId"
// }

//Integrate with ONDC

app.post('/api/v1/ondc/integration', async (req, res) => {
    try {
        const { business_id: businessId } = req.body;

        if (!businessId) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid business_id'
            });
        }

        const business = await Business.findOne({ businessId });
        if (!business) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        const ondcShopId = uuidv4(); // Unique ONDC shop ID

        business.ondcShopId = ondcShopId;
        await business.save();

        res.json({
            status: 'success',
            message: 'ONDC integration successful',
            data: {
                ondc_shop_id: ondcShopId
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'ONDC integration failed'
        });
    }
});

const Product = db.Product;

// Request Payload Example:
// {
//   "business_id": "exampleBusinessId",
//   "product": {
//     "name": "Product Name",
//     "description": "Product Description",
//     "price": 10.99
//   }
// }

//Product listing

app.post('/api/v1/ondc/products', async (req, res) => {
    try {
        const { business_id: businessId, product } = req.body;

        if (!businessId || !product || !product.name || !product.description || !product.price) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        const business = await Business.findOne({ businessId });
        if (!business) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        const productId = uuidv4(); //Unique product ID

        const newProduct = new Product({
            businessId:businessId,
            productId: productId,
            name: product.name,
            description: product.description,
            price: product.price
        });

        await newProduct.save();

        res.json({
            status: 'success',
            message: 'Product listed successfully',
            data: newProduct
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Product listing failed'
        });
    }
});

// Request Payload Example for Getting Product Information:
// {
//   "product_id": "unique_product_id"
// }

//Fetch product details

app.get('/api/v1/ondc/products/:product_id', async (req, res) => {
    try {
        const productId = req.params.product_id;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid product ID'
            });
        }

        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Product found',
            data: {
                product_id: product.productId,
                name: product.name,
                description: product.description,
                price: product.price,
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Product retrieval failed'
        });
    }
});

//Update product
app.put('/api/v1/ondc/products/update/:product_id', async (req, res) => {
    try {
        const productId = req.params.product_id;
        const { name, description, price  } = req.body;

        if (!productId || !name || !description || !price ) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { productId },
            { $set: { name, description, price } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Product update failed'
        });
    }
});

const Order = db.Order;

// Request Payload Example for Order Placement:
// {
//   "business_id": "exampleBusinessId",
//   "product_id": "exampleProductId",
//   "quantity": 2,
//   "customer_name": "John Doe"
// }

//place order
app.post('/api/v1/ondc/orders/place', async (req, res) => {
    try {
        const { business_id: businessId, product_id: productId, quantity, customer_name: customerName } = req.body;

        if (!businessId || !productId || !quantity || !customerName) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        const business = await Business.findOne({ businessId });
        if (!business) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        const product = await Product.findOne({productId});
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const orderId = uuidv4(); //Unique order ID
        const orderStatus = 'Order placed. Payment pending';
        const netAmount = quantity*(product.price);

        const newOrder = new Order({
            businessId,
            orderId,
            productId,
            quantity,
            customerName,
            orderStatus: orderStatus,
            amount: netAmount
        });

        await newOrder.save();
        res.json({
            status: 'success',
            message: 'Order placed successfully',
            data: newOrder
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Order placement failed'
        });
    }
});

const Payment = db.Payment;

// Request Payload Example:
// {
//   "business_id": "exampleBusinessId",
//   "order_id": "exampleOrderId"
// }

//Payment

app.post('/api/v1/ondc/payments', async (req, res) => {
    try {
        const { business_id: businessId, order_id: orderId } = req.body;
        if (!businessId || !orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        const business = await Business.findOne({ businessId });
        const order = await Order.findOne({ orderId });

        if (!business || !order || order.businessId.toString() !== businessId.toString()) {
            return res.status(404).json({
                status: 'error',
                message: 'Business or order not found'
            });
        }

        if (order.orderStatus === "Order placed. Payment Complete") {
            return res.json({
                status: 'success',
                message: 'Payment already completed for this order',
                data: {
                    order_id: orderId,
                    order_status: order.orderStatus
                }
            });
        }

        const paymentAmount = order.amount;

        function simulatePayment() {
            const paymentSuccessful = Math.random() < 0.5;
            return paymentSuccessful ? "Payment successful" : "Payment failed";
        }

        const paymentResult = simulatePayment();
        const paymentId = uuidv4();
        const paymentStatus = paymentResult;

        const newPayment = new Payment({
            businessId: businessId,
            orderId: orderId,
            paymentId: paymentId,
            paymentAmount: paymentAmount,
            paymentStatus: paymentStatus
        });

        await newPayment.save();

        const updateOrderStatus = async () => {
            try {
                const newOrderStatus = "Order placed. Payment Complete";
                order.orderStatus = newOrderStatus;
                await order.save();
                return newOrderStatus;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Order update failed');
            }
        };

        if (paymentResult === "Payment successful") {
            const updatedStatus = await updateOrderStatus();
            return res.json({
                status: 'success',
                message: 'Payment processed successfully',
                data: {
                    businessId: businessId,
                    orderId: orderId,
                    payment_id: paymentId,
                    status: paymentStatus,
                    order_status: updatedStatus
                }
            });
        } else {
            return res.json({
                status: 'failed',
                message: 'Payment processing failed',
                data: {
                    payment_id: paymentId,
                    status: paymentStatus
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Payment processing failed'
        });
    }
});

// Request Payload Example for Order Tracking:
// {
//   "order_id": "unique_order_id"
// }

// Order Tracking

app.get('/api/v1/ondc/orders/track/:order_id', async (req, res) => {
    try {
        const orderId = req.params.order_id;
        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid order ID'
            });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Order found',
            data: {
                order_id: order.orderId,
                orderStatus: order.orderStatus,
                amount: order.amount
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Order tracking failed'
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
