const fs = require('fs');

class ProductManager 
{
    constructor() 
    {
        this.idCounter = 0;
        this.path = "./products.json";
    }

    async getProducts() 
    {
        try 
        {
            if(fs.existsSync(this.path)) 
            {
                const products = await fs.promises.readFile(productFiles.path, 'utf8');
                const productsJS = JSON.parse(products);
                return productsJS;
            } 
            else 
            {
                return [];
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) 
    {
        try 
        {
            const productsFile=await this.getProducts();
            const duplicateCode = productsFile.find
            (
                (product) => product.code === code
            );
            if (duplicateCode) 
            {
                console.log(`El codigo ${code} ya existe`);
            } 
            else 
            {
                const lastProduct = producstFile[productsFile.length - 1];
                const newId = lastProduct ? lastProduct.id + 1 : 1;
                const product = 
                {
                    id: newId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                };
                productsFile.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async deleteProduct(idProduct) 
    {
        try 
        {
            const productsFile = await this.getProducts();
            const productIndex = productsFile.findIndex((product) => product.id === idProduct);  
            if (productIndex === -1) 
            {
                console.log('No se encontró el producto con el ID indicado');
            } 
            else 
            {
                productsFile.splice(productIndex, 1);
                await fs.promises.writeFile(productFiles.path, JSON.stringify(productsFile));
                console.log(`El producto con el ID ${idProduct} fue eliminado exitosamente`);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async updateProduct(idProduct, updatedFields) 
    {
        try 
        {
            const productsFile = await this.getProducts();
            const productIndex = productsFile.findIndex((product) => product.id === idProduct);  
            if (productIndex === -1) 
            {
                console.log('No se encontró el producto con el ID especificado');
            } 
            else 
            {
                const updatedProduct = 
                {
                ...productsFile[productIndex],
                ...updatedFields,
                id: idProduct, 
                };
                productsFile[productIndex] = updatedProduct;
                await fs.promises.writeFile(productFiles.path, JSON.stringify(productsFile));
                console.log(`Producto actualizado correctamente`);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async #existingProduct(idProduct) 
    {
        try 
        {
            const productsFile = await this.getProducts();
            return productsFile.find((products) => products.id === idProduct);
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async getProductById(idProduct) 
    {
        try 
        {
            const product = this.#existingProduct(idProduct);
            if (!product) 
            {
                console.log('No encontrado');
            } 
            else 
            {
                return product;
            }
        }
        catch (error) 
        {
            console.log(error);
        }
    }
}