import * as Yup from 'yup'
import Category from '../Models/Category'
import User from '../Models/User'
class CategoryController{
  async store(request, response){
    const schema = Yup.object().shape({
      name : Yup.string().required(),
    })

    try{
      await schema.validateSync(request.body, {abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const { admin: isAdmin} = await User.findByPk(request.userId)

    if(!isAdmin){
      return response.status(401).json()
    }

    const { name } = request.body

    const { filename: path } = request.file

    const categoryExist = await Category.findOne({
      where : {name,},
    })

    if(categoryExist){
      return response.status(400).json({erro : 'category already exists'})
    }

    const {id} = await Category.create({ name, path }) 

    return response.json({name, id})
  }

  async index(request, response){
    const category = await Category.findAll()

    return response.json(category)
  }

  async update(request, response){
    const schema = Yup.object().shape({
      name : Yup.string().required(),
    })

    try{
      await schema.validateSync(request.body, {abortEarly: false})
    }catch(err){
      return response.status(400).json({error: err.errors })
    }

    const { admin: isAdmin} = await User.findByPk(request.userId)

    if(!isAdmin){
      return response.status(401).json()
    }

    const { name } = request.body

    const {id} = request.params

    const catergory = await Category.findByPk(id)

    if(!catergory){
      return response.status(401).json({error : 'make sure your category id is correct'})
    }

    let path
    if(request.file){
      path = request.filename
    }

    await Category.update({ name, path },{ where: {id}}) 

    return response.status(200).json()
  }
}

export default new CategoryController()