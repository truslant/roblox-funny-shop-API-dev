INSERT INTO
    users (firstName, lastName, email)
VALUES
    ('August', 'Octavian', 'augusus.octavian@rome.rep'),
    ('Julius', 'Ceaser', 'julius.ceaser@rome.rep'),
    ('Jengiz', 'Khan', 'jengiz.khan@mongolia.emp');

INSERT INTO
    products (name, description, price)
VALUES
    (
        'Taylor Swift T-Shirt',
        'Great T-Shirt made with love from fans of Taylor Swift',
        19.99
    ),
    (
        'Lady Gaga Pants',
        'Pants that will definitely make you standing out',
        12.45
    ),
    (
        'Tom Cruise Sunglasses',
        'Glasses that will make you look so cool that you could fly a Jet',
        59.99
    );

INSERT INTO
    carts (userId)
VALUES
    (1),
    (2),
    (3);

INSERT INTO
    carts_products (cartid, productid, qty)
VALUES
    (1, 1, 3),
    (1, 2, 2),
    (2, 3, 1);

INSERT INTO
    orders (userid)
VALUES
    (1),
    (1),
    (2),
    (3),
    (2);

INSERT INTO
    orders_products (orderid, productid, qty)
VALUES
    (1, 1, 2),
    (1, 2, 3),
    (2, 3, 5),
    (3, 2, 3),
    (3, 1, 4),
    (4, 2, 1),
    (5, 1, 7),
    (5, 2, 3),
    (5, 3, 1)