var faker = require('faker');

const User = require('../models/User');
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const Address = require('../models/Address');

exports.userSeeder = async (req,res) => {
    try {

        for (var i = 0; i < 2; i++) {

            const companyData = {
                user: {
                    email: faker.internet.email(),
                    password: "1234",
                    type: "company"
                },
                company: {
                    name: faker.company.companyName(),
                    rtn: faker.random.number(),
                    cellphone: faker.random.number()
                },
                address: {
                    line1: faker.address.streetAddress(),
                    line2: faker.address.streetName(),
                    city: faker.address.city(),
                    department: faker.address.state(),
                    zipcode: faker.random.number()
                }
            }

            const user = new User(companyData.user);
            await user.save();

            companyData.address.user = user._id;
            const address = new Address(companyData.address);
            await address.save();

            user.defaultAddress = address._id;

            companyData.company.address = address._id;
            companyData.company.user = user._id;

            const company = new Company(companyData.company);
            await company.save();

            user.company = company._id;
            await user.save();

            var lock = 1000;

            for (var y = 0; y < 15; y++) {

                const customerdata = {
                    user: {
                        email: faker.internet.email(),
                        password: "1234",
                        type: "customer"
                    },
                    customer: {
                        name: faker.name.firstName(),
                        last_name: faker.name.lastName(),
                        company: company._id,
                        cellphone: faker.random.number(),
                        telephone: faker.random.number(),
                        identification: faker.random.number()
                    },
                    address: {
                        line1: faker.address.streetAddress(),
                        line2: faker.address.streetName(),
                        city: "San Pedro Sula",
                        department: "Cortes",
                        zipcode: 21101
                    }
                }

                const user = new User(customerdata.user);
                await user.save();

                customerdata.address.user = user._id;
                const address = new Address(customerdata.address);
                await address.save();

                customerdata.customer.address = address._id;
                customerdata.customer.user = user._id;
                customerdata.customer.locker = lock;
                lock++;

                user.defaultAddress = address._id;

                const customer = new Customer(customerdata.customer);
                await customer.save();

                user.customer = customer._id;
                user.company = customerdata.customer.company;
                await user.save();
            }
        }

        res.send("SEEDS DONE");

    } catch (error) {
        console.log(error);
    }
}