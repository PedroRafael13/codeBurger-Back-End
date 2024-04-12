import Sequelize from 'sequelize'
import Category from '../app/Models/Category'
import Products from '../app/Models/Product'

import User from '../app/Models/User'

import configDatabase from "../config/database"
import mongoose from 'mongoose'

const models = [User, Products, Category]

class Database{
  constructor(){
    this.init()
    this.mongo()
  }

  init(){
    this.connection = new Sequelize(
      'postgresql://postgres:QsLQBmAxLKMkIcZvJGhmIGqgEOeyiUPH@viaduct.proxy.rlwy.net:47912/railway'
    )
    models.map((model) => model.init(this.connection)).map(model => model.associate && 
      model.associate(this.connection.models))
  }  

  mongo(){
    this.mongoConnection = mongoose.connect('mongodb://mongo:fnorvPAooCMSxgyxyZEnfdxoPsOQhZbj@viaduct.proxy.rlwy.net:11644', {
      useNewUrlParser:true,
      useUnifiedTopology:true,
    }
  )
  }
}

export default new Database()