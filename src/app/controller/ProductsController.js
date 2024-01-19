import * as Yup from 'yup'
import Products from '../Models/Product'
import Category from '../Models/Category'
import User from '../Models/User'
class ProductController{
  async store(request, response){
      const schema = Yup.object().shape({
        name : Yup.string().required(),
        prince: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
      })

    try{
      await schema.validateSync(request.body, { abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const { admin: isAdmin} = await User.findByPk(request.userId)

    if(!isAdmin){
      return response.status(401).json()
    }

    const { filename: path } = request.file
    const {name, prince, category_id, offer} = request.body

    const product = await Products.create({
      name,
      prince,
      category_id,
      path,
      offer,
    })
    return response.json(product)
  }

  async index(request, response){
    const products = await Products.findAll({
     include : [
      {
        model : Category,
        as: 'category',
        attributes :['id', 'name'],
      },
     ],
    })

    return response.json(products)
  }

  async update(request, response){
    const schema = Yup.object().shape({
      name : Yup.string(),
      prince: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

  try{
    await schema.validateSync(request.body, { abortEarly: false})
  }catch(err){
    return response.status(400).json({error: err.errors })
  }

  const { admin: isAdmin} = await User.findByPk(request.userId)

  if(!isAdmin){
    return response.status(401).json()
  }

    const {id} = request.params
    const product = await Products.findByPk(id)

    if(!product){
      return response.status(401).json({error: 'make sure your product is correct'})
    }

    let path
    if(request.file){
      path = request.file.filename
    }

  const {name, prince, category_id, offer} = request.body

   await Products.update(
    {
    name,
    prince,
    category_id,
    path,
    offer,
  },
    { where:{id} }
  )
  return response.status(200).json()
}
}

export default new ProductController()