import Sequelize from 'sequelize'
import Category from '../app/Models/Category'
import Products from '../app/Models/Product'

import User from '../app/Models/User'

import configDatabase from "../config/database"

const models = [User, Products, Category]

class Database{
  constructor(){
    this.init()
  }

  init(){
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()