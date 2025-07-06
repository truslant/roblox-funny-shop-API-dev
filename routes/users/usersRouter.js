const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport');

const { User } = require('../../db/database').models

const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
    const { firstname, lastname, email, password, passwordCheck } = req.body;
    if (password != passwordCheck) res.redirect('/register');
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        res.redirect('/')
    } catch (error) {
        next(error);
    }
});

router.put('/update', async (req, res, next) => {

    if (!req.isAuthenticated()) {
        res.redirect('/');
    }

    const { firstname, lastname, email, password, newPassword, newPasswordCheck } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        const match = await bcrypt.compare(password, user.password);

        if (match && newPassword == newPasswordCheck) {

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            const userData = { firstname, lastname, email, password: hashedPassword };

            Object.keys(userData).forEach(key => {
                if (user[key] !== userData[key]) {
                    user[key] = userData[key]
                }
            })

            await user.save();
            res.redirect('/')
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }

});

router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/'
        }
    ),
    (req, res, next) => {
        console.log('Authentication succeded!')
        res.redirect('/');
    }
)

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) res.send(err);
        req.session.destroy();
        res.redirect('/')
    });
});

module.exports = router;



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
