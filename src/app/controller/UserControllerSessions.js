import * as Yup from 'yup'
import User from '../Models/User'
import  Jwt  from 'jsonwebtoken'
import AuthConfig from '../../config/auth'

class SessionController{
  async store(request,response){

    const schema = Yup.object().shape({
      email : Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPasswordIncorrect = () => {
      return response.status(401).json({erro : "make your password or email are correct"})
    }
    
    if(!(await schema.isValid(request.body))) userEmailOrPasswordIncorrect()

    const {email, password} = request.body

    const user = await User.findOne({
      where : {email},
    })

    if(!user) userEmailOrPasswordIncorrect()

    if(!(await user.checkPassword(password)))userEmailOrPasswordIncorrect()
  
    return response.json({
      id: user.id, 
      email, 
      admin: user.admin, 
      token: Jwt.sign({id: user.id, name : user.name}, AuthConfig.secret, {
        expiresIn: AuthConfig.expiresIn
      }),
  }) 
  }
}


export default new SessionController()