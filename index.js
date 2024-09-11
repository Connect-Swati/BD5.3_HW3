let express = require("express");
let app = express();
app.use(express.json());
let Company = require("./models/company.model")
let { sequelize_instance } = require("./lib/index")
let port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
app.get("/", (req, res) => {
    res.status(200).json({ message: "BD5.3 - HW3" });
})
let CompanyData = [
    {
        'id': 1,
        'name': 'Tech Innovators',
        'industry': 'Technology',
        'foundedYear': 2010,
        'headquarters': 'San Francisco',
        'revenue': 75000000
    },
    {
        'id': 2,
        'name': 'Green Earth',
        'industry': 'Renewable Energy',
        'foundedYear': 2015,
        'headquarters': 'Portland',
        'revenue': 50000000
    },
    {
        'id': 3,
        'name': 'Innovatech',
        'industry': 'Technology',
        'foundedYear': 2012,
        'headquarters': 'Los Angeles',
        'revenue': 65000000
    },
    {
        'id': 4,
        'name': 'Solar Solutions',
        'industry': 'Renewable Energy',
        'foundedYear': 2015,
        'headquarters': 'Austin',
        'revenue': 60000000
    },
    {
        'id': 5,
        'name': 'HealthFirst',
        'industry': 'Healthcare',
        'foundedYear': 2008,
        'headquarters': 'New York',
        'revenue': 80000000
    },
    {
        'id': 6,
        'name': 'EcoPower',
        'industry': 'Renewable Energy',
        'foundedYear': 2018,
        'headquarters': 'Seattle',
        'revenue': 55000000
    },
    {
        'id': 7,
        'name': 'MediCare',
        'industry': 'Healthcare',
        'foundedYear': 2012,
        'headquarters': 'Boston',
        'revenue': 70000000
    },
    {
        'id': 8,
        'name': 'NextGen Tech',
        'industry': 'Technology',
        'foundedYear': 2018,
        'headquarters': 'Chicago',
        'revenue': 72000000
    },
    {
        'id': 9,
        'name': 'LifeWell',
        'industry': 'Healthcare',
        'foundedYear': 2010,
        'headquarters': 'Houston',
        'revenue': 75000000
    },
    {
        'id': 10,
        'name': 'CleanTech',
        'industry': 'Renewable Energy',
        'foundedYear': 2008,
        'headquarters': 'Denver',
        'revenue': 62000000
    }
]

// endpoint to seed db

app.get("/seed_db", async (req, res) => {
    try {
        await sequelize_instance.sync({ force: true });
        let comanyDataInserted = await Company.bulkCreate(CompanyData);
        res.status(200).json({
            message: "database seeding successfull",
            recordInsert: comanyDataInserted
        });

    } catch (error) {
        console.log("Error in seeding db", error.message);
        return res.status(500).json({
            code: 500,
            message: "Error in seeding db",
            error: error.message,
        });
    }
});

/*
Exercise 1: Fetch all companies

Create an endpoint /companies that’ll return all the companies in the database.

Create a function named fetchAllCompanies to query the database using the sequelize instance.

API Call

http://localhost:3000/companies

Expected Output:

{
  'companies' : [
    // All the companies  in the database
  ],
}


*/
// fucntion to fetch all companies
async function fetchAllCompanies() {
    try {
        const companies = await Company.findAll();
        if (!companies) {
            throw new Error("No companies data found");
        }
        return { companies: companies };
    } catch (error) {
        console.log("error in fetching all companies data ", error.message);
        throw error;
    }
}

//endpoint to  fetch all companies
app.get("/companies", async (req, res) => {
    try {
        const result = await fetchAllCompanies();
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "No companies data found") {
            res.status(404).json({
                code: 404,
                message: "No companies data found",
                error: error.message,
            });
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
});
/*
Exercise 2: Add a new company in the database

Create a POST endpoint /companies/new that’ll return the newly inserted employee details.

Declare a variable named newCompany to store the request body data AKA req.body.newCompany .

Create a function named addNewCompany that’ll insert the new company into the database and return the new employee record from the database.

API Call

http://localhost:3000/companies/new

Request Body:

{
'newCompany': {
  'name': 'New Life Care',
  'industry': 'Healthcare',
  'foundedYear': 2012,
  'headquarters': 'India',
  'revenue': 55000000
}
}

Expected Output:

{
  'newCompany': {
    'id': 11,
  'name': 'New Life Care',
  'industry': 'Healthcare',
  'foundedYear': 2012,
  'headquarters': 'India',
  'revenue': 55000000
}
}


*/
// fucntion to  add new company
async function addNewCompany(newCompany) {
    try {
        let result = await Company.create(newCompany);
        if (!result) {
            throw new Error("Failed to add new company");

        }
        return { newCompany: result }
    } catch (error) {
        console.log("error in adding new company  ", error.message)
        throw error;
    }

}
// endpoint to add new company
app.post("/companies/new", async (req, res) => {
    try {
        let newCompany = req.body.newCompany;
        let result = await addNewCompany(newCompany);
        return res.status(200).json(result)
    } catch (error) {
        if (error.message === "Failed to add new company") {
            return res.status(400).json({
                code: 404,
                "message": "Failed to add new company",
                error: error.message
            });

        } else {
            return res.status(500).json({
                code: 500,
                "message": "Internal Server Error",
                error: error.message
            });
        }
    }
})

/*
Exercise 3: Update companies information

Create a POST endpoint /companies/update/:id that’ll return the updated company details.

Declare a variable named id to store the path parameter passed by the user.

Declare a variable named newCompanyData to store the request body data.

Create a function named updateCompanyById that’ll update the company in the database and return the updated company record from the database.

API Call

http://localhost:3000/companies/update/11

Request Body:

{
  'name': 'Life Care'
}

Expected Output:

{
    'message': 'Company updated successfully',
    'updatedCompany': {
      'id': 11,
    'name': 'Life Care',
    'industry': 'Healthcare',
    'foundedYear': 2012,
    'headquarters': 'India',
    'revenue': 55000000
  }
}


*/

// fucntion to update companies info
async function updateCompanyById(id, newCompanyData) {
    try {
        let result = await Company.update(newCompanyData, { where: { id: id } });
        if (result[0] == 0) {
            throw new Error('Company not found');

        }
        let updatedData = await Company.findByPk(id);
        return {
            message: 'Company updated successfully',
            updatedCompany: updatedData
        };

    } catch (error) {
        console.log("error in updating companydata ", error.message);
        throw error;

    }
}

// endpoint to update company data
app.post("/companies/update/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let newCompanyData = req.body;
        let result = await updateCompanyById(id, newCompanyData);
        return res.status(200).json(result);

    } catch (error) {
        if (error.message === 'Company not found') {
            return res.status(404).json({
                code: 404,
                message: 'Company not found',
                error: error.message
            });

        } else {
            return res.status(500).json({
                code: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
})

/*
Exercise 4: Delete an company from the database

Create a POST endpoint /companies/delete that’ll delete the company record from the database.

Declare a variable named id to store the parameter from request body.

Create a function named deleteCompanyById that’ll delete the company record from the database based on the company id.

API Call

http://localhost:3000/companies/delete

Request Body:

{
    'id': 11
}

Expected Output:

{
  'message' :'Company record deleted successfully'
}
   */

// fucntion to delete  company by id
async function deleteCompanyById(id) {
    try {

        let result = await Company.destroy({ where: { id: id } });
        if (result == 0) {
            throw new Error('Company not found');

        }
        return { message: 'Company record deleted successfully' }

    } catch (error) {
        console.log("error in deleting company ," + error).message;
        throw error;


    }

}

//  delete company by id
app.post("/companies/delete", async (req, res) => {
    try {
        let id = req.body.id;
        let result = await deleteCompanyById(id);
        res.json(result);

    } catch (error) {
        if (error.message === "Company not found") {
            res.status(404).json({
                code: 404,
                message: 'Company not found',
                error: error.message
            });


        } else {
            res.status(500).json({
                code: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
})


