import express from 'express';
import ProductManager from './manager/ProductManager.js';

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./product.json')

app.get('/products', async(req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

app.get('/products/:id', async(req, res) =>{
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(Number(id));
        if(product){
            res.status(200).json({ message: 'producto encontrado', product})
        } else {
            res.status(400).send('producto no encontrado')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.post('/products', async(req, res) =>{
    try {
        console.log( req.body);
        const product = req.body;
        const newProduct = await productManager.createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.put('/products/:id', async(req, res) =>{
    try {
        const { name, price, stock } = req.body;
        const product = req.body;
        const { id } = req.params;
        const productsFile = await productManager.getProductById(Number(id));
        if(productsFile){
            await productManager.updateProduct(product, Number(id));
            res.send('producto actualizado correctamente!!')
        } else {
            res.status(404).send('producto no encontrado')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
}});

app.delete('/products/:id', async(req, res) =>{
    try {
        const { id } = req.params;
        const products = await productManager.getProducts();  
        if(products.length > 0) {
            await productManager.deleteProductById(Number(id));
            res.send(`producto con id ${id} eliminado con exito`);
        } else {
            res.send(`producto con id ${id} no encontrado`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.delete('/products', async(req, res) =>{
    try {
        await productManager.deleteAllProducts();
        res.send('productos eliminados exitosamente')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`server ok en puerto ${PORT}`);
})
