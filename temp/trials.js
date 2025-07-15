const reduceOrRemoveProduct = async (
    product, container,
    productId,
    JointTableModel

) => {

    let curQty = 0;

    const targetProduct = container.Products.find(product => productId === product.id)
    curQty = targetProduct[JointTableModel.name].qty;

    if (curQty === 0) {
        throw createError(`No product with product ID# ${productId} found in the ${JointTableModel.name}.`);
    }

    curQty--;
    console.log('curQty:', curQty);
    try {
        if (curQty < 1) {
            await container.removeProduct(product)
        } else {
            await JointTableModel.update(
                { qty: curQty },
                {
                    where:
                    {
                        [Op.and]:
                            [
                                {
                                    [Op.or]:
                                        [
                                            { cartid: container.id },
                                            { orderid: container.id }
                                        ]
                                },
                                { productid: productId }
                            ]
                    }
                }
            )
        }
    } catch (error) {
        throw createError(500, `Unable to reduce/remove product ID ${productId} from ${JointTableModel.name}`);
    }
};