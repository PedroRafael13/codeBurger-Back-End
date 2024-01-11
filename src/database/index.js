import Sequelize from 'sequelize'
import Category from '../app/Models/Category'
import Products from '../app/Models/Product'
import mongoose from 'mongoose'

import User from '../app/Models/User'

import configDatabase from "../config/database"

const models = [User, Products, Category]

class Database{
  constructor(){
    this.init()
    this.mongo()
  }

  init(){
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection)).map(model => model.associate && 
      model.associate(this.connection.models))
  }

  mongo(){
    this.mongoConnection = mongoose.connect(
      'mongo1db://localhost:27017/codeburger',
      {
        useNewUrlParser:true,
        useUnifieldTopology:true,
      }
    )
  }
}

export default new Database()