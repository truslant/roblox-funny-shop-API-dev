SELECT
    users.firstname AS "Name",
    users.lastname AS "Last_name",
    products.name AS "product",
    products.price AS "price",
    carts_products.qty AS "qty",
    ROUND(products.price * carts_products.qty, 2) AS "total"
FROM
    users
    INNER JOIN carts ON carts.userid = users.id
    INNER JOIN carts_products ON carts_products.cartid = carts.id
    INNER JOIN products ON carts_products.productid = products.id

SELECT
    orders.id AS "order_id",
    users.id AS "user_id",
    users.firstname AS "name",
    users.lastname AS "last_name"
FROM
    users
    INNER JOIN orders ON users.id = orders.userid


SELECT
    users.firstname AS "name",
    users.lastname AS "last_name",
    orders.id AS "order_number",
    products.name AS "item",
    products.price AS "price",
    orders_products.qty AS "qty",
    ROUND(products.price * orders_products.qty, 2) AS "total"
FROM
    users
    INNER JOIN orders ON users.id = orders.userid
    INNER JOIN orders_products ON orders_products.orderid = orders.id
    INNER JOIN products ON orders_products.productid = products.id

