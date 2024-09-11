const {sequelize_instance , DataTypes} = require("../lib/index")
/*


Create a model for companies in the folder ./models/company.model.js

Define the Datatypes for each column based on the structure of the dummy data

Don’t define id in the model. Sequelize will automatically assign id’s to each record
'name': 'Tech Innovators',
    'industry': 'Technology',
    'foundedYear': 2010,
    'headquarters': 'San Francisco',
    'revenue': 75000000
     */

const company = sequelize_instance.define("company", {
    name: DataTypes.TEXT,
    industry: DataTypes.TEXT,
    foundedYear: DataTypes.INTEGER,
    headquarters: DataTypes.TEXT,
    revenue: DataTypes.INTEGER
})
module.exports =  company;
