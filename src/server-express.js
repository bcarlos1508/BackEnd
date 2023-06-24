import express from 'express';
import handlebars from 'express-handlebars';
import cartsRouter from './routes/carts-router.js';
import viewsRouter from './routes/views-router.js';
import productsRouter from './routes/products-router.js';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import { productManager } from "../manager/ProductManager.js";

const productManager = new productManager();
const app=express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = app.listen(port, () => {
    try {
        console.log(`Listening on port ${port}`);
    } catch (err) {
        res.status(400).json({ message: err.message })
        console.log(err)
    }
})

const io = new Server(http)

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/views', viewsRouter)

io.on('connection', async (socket) => {
    console.log('User connected (ID: ', socket.id, ')');
    socket.on('disconnect', () => {
        console.log('User disconnected (ID:', socket.id, ')');
    })
    socket.on('message', (message) => {
        console.log(message)
    })
    socket.emit('productsArray', await productManager.getProducts());
    socket.on('newProduct', async (prod) => {
        await productManager.addProduct(prod);
        const arrayUpdate = await productManager.getProducts();
        socket.emit('arrayUpdate', arrayUpdate);
        socket.on('update', (update) => {
            console.log(update);
        })
    })
})
