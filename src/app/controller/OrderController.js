import * as Yup from 'yup'
import Category from '../Models/Category'
import Products from '../Models/Product'
import Order from '../schemas/Order'
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
      where : { id: productsId },
      include : [{ model: Category, as: 'category', attributes:['name'] }]
    })

    const editedProduct = updateProducts.map(product => {
      const productIndex = request.body.products.findIndex(requestProduct => requestProduct.id === product.id)

      const newProduct ={
        id: product.id,
        name: product.name,
        prince: product.prince,
        category: product.category.name,
        url:product.url,
        quantity:request.body.products[productIndex].quantity,
      }

      console.log(product.category.name)
      return newProduct
    })
    
    
    const order = {
      user:{
        id: request.userId,
        name: request.userName
      },
      products: editedProduct,
      status: 'pedido relizado'
    }

    const orderResponse = await Order.create(order)

    return response.status(201).json(orderResponse)
  }

  async index(request, response){
    const orders = await Order.find()

    return response.json(orders)
  }

  async update(request, response){
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })

    try{
      await schema.validateSync(request.body, {abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }


    const {id} = request.params
    const {status} = request.body

    try{
      await Order.updateOne({_id:id}, {status})
    } catch(error){
      return response.status(400).json({error: error.message})
    }

    return response.json({message : 'O status updated sucessfuly'})
  }

}

export default new OrderController()