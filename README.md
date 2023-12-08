# Decentro_APIs

This project is a Node.js application that demonstrates how to use the Decentro APIs for various banking and financial services. Decentro is a platform that provides APIs for banking integrations, such as account opening, KYC verification, money transfer, bill payments, card issuance, and more.

## Features

- This project implements the following Decentro APIs:
-   - **Business Registration API**: This API allows you to your business to register with ONDC. This is a hypothetical API. Actual impleentation of ONDC registartion should follow the documentation provided at [ONDC Developer Guide](https://ondc-issue-logging-cohort1.atlassian.net/wiki/spaces/TG/pages/36339713/ONDC+Developer+Guide).
    - **ONDC Integration API**: This API allows you to your business to integrate with ONDC. This is a hypothetical API. Actual impleentation of ONDC integration should follow the documentation provided at [ONDC Developer Guide](https://ondc-issue-logging-cohort1.atlassian.net/wiki/spaces/TG/pages/36339713/ONDC+Developer+Guide).
    - **Product Listing API**: This API allows you to add product details.
    - **Fetch Product Info API**: This API allows you to provide product information to your customers, on request.
    - **Update Product Details API**: This API allows you to update your product information.
    - **Order Placing API**: This API allows your customers to place orders.
    - **Order Tracking API**: This API allows your customers to track orders.
    - **Payment API**: This API allows your customers to make payments.
- This project uses Express.js as the web framework and MongoDB as the database.

## Installation

- To run this project, you need to have Node.js installed on your system.
- Clone this repository using `git clone https://github.com/govindplal/Decentro_APIs.git`
- Navigate to the project directory and install the dependencies using `npm install`
- Create a `.env` file in the project root and add your MongoDB connection string as follows:

```
MONGO_URI=your_mongo_uri
```

- Start the server using `npm start`
