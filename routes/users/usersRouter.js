const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport')

const { models, sequelize } = require('../../db/database');


router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/'
        }
    ),
    (req, res, next) => {
        res.json(req.user);
    }
)

// router.get('/',



// const users = await models.User.findAll(
//     {
//         // where: {
//         //     id: 1
//         // }
//     }
// );

// // console.log('User.findAll output: ', users);

// const orders = await users[0].getOrders(
//     {
//         include: [{
//             model: models.User
//         }, {
//             model: models.Product
//         },
//         ]
//     }
// );
// const result = {};

// console.log(`======= Orders ======`)
// orders.forEach(order => {
//     const orderid = order.id;

//     const { firstname, lastname, email } = order.User;
//     console.log(`Order #: `, orderid);
//     console.log(`--------------------`)
//     console.log(`User name: `, firstname);
//     console.log(`User last name: `, lastname);
//     console.log(`User email: `, email);
//     console.log(`----Order Items----`);

//     result[orderid] = {};
//     result[orderid].Products = [];

//     result[orderid].User = {
//         firstname,
//         lastname,
//         email
//     }

//     order.Products.forEach(product => {
//         const { name, description, price } = product;
//         const { qty } = product.OrdersProducts;
//         console.log(`Item name: `, name);
//         console.log(`Item description: `, description);
//         console.log(`Item price: `, price);
//         console.log(`Item Qty: `, qty);
//         console.log(`total: `, price * qty);
//         console.log(`-`);

//         result[orderid].Products.push({
//             name,
//             description,
//             price,
//             qty,
//             total: price * qty
//         })
//     })
// })

// res.json(orders);
// })

module.exports = router;