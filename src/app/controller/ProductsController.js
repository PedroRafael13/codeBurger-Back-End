import * as Yup from 'yup'
import Products from '../Models/Product'

class ProductController{
  async store(request, response){
    const schema = Yup.object().shape({
      name : Yup.string().required(),
      prince: Yup.number().required(),
      category: Yup.string().required(),
    })

    try{
      await schema.validateSync(request.body, {abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const { filename: path } = request.file
    const {name, prince, category} = request.body

    const product = await Products.create({
      name,
      prince,
      category,
      path,
    }) 
    return response.json(product)
  }

  async index(request, response){
    const products = await Products.findAll()

    return response.json(products)
  }
}

export default new ProductController()