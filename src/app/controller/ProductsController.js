import * as Yup from 'yup'
import Products from '../Models/Product'
import Category from '../Models/Category'
class ProductController{
  async store(request, response){
      const schema = Yup.object().shape({
        name : Yup.string().required(),
        prince: Yup.number().required(),
        category_id: Yup.number().required(),
      })

    try{
      await schema.validateSync(request.body, { abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const { filename: path } = request.file
    const {name, prince, category_id} = request.body

    const product = await Products.create({
      name,
      prince,
      category_id,
      path,
    })
    return response.json(product)
  }

  async index(request, response){
    const products = await Products.findAll({
     include : [
      {
        model : Category,
        as: 'category',
        attributes : ['id', 'name'],
      },
     ],
    })

    return response.json(products)
  }
}

export default new ProductController()