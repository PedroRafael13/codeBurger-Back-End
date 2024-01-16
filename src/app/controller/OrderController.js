import * as Yup from 'yup'
import Category from '../Models/Category'
import Products from '../Models/Product'

class OrderController{
  async store(request,response){
    const schema = Yup.object().shape({
      products: Yup.array().required().of(
        Yup.object().shape({
          id: Yup.number().required(),
          quantity:Yup.number().required(),
        })
      ),
    })

    try{
      await schema.validateSync(request.body, {abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const productsId = request.body.products.map((product) => product.id)

    const updateProducts = await Products.findAll({
      where : { id: productsId, },
      include : [{ model: Category, as: 'category', attributes:['name'] }]
    })

    const editedProduct = updateProducts.map(product => {

      const newProduct ={
        id: product.id,
        name: product.name,
        prince: product.prince,
        category: product.category?.name,
        url: product.url,
      }

      return newProduct
    })
    
    const order = {
      user:{
        id: request.userId,
        name: request.name,
      },
    }

    return response.status(201).json(editedProduct)
  }
}

export default new OrderController()