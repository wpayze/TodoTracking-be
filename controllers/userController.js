const User = require('../models/User');
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const Address = require('../models/Address');

exports.getUserByToken = async (req,res) => {
    let { user } = req; 
    res.send(user);
}

exports.registerUser = async (req,res) => {
    // Create a new user
    try {

        let { user: userData, address: addressData, customer: customerData = {}, company: companyData = {} } = req.body;

        const user = new User(userData);
        await user.save();

        addressData.user = user._id;
        const address = new Address(addressData);
        await address.save();

        user.defaultAddress = address._id;

        switch (userData.type) {
            case "customer":
                customerData.address = address._id;
                customerData.user = user._id;
                customerData.locker = await getNewLocker(customerData.company);

                const customer = new Customer(customerData);
                await customer.save();

                user.customer = customer._id;
                user.company = customerData.company;
                await user.save();
                break;
            case "company":
                companyData.address = address._id;
                companyData.user = user._id;
                companyData.configs.states = [
                    {
                        text: "Recibido",
                        color: "#2196F3"
                    },
                    {
                        text: "Entregado",
                        color: "#4CAF50"
                    }
                ]

                const company = new Company(companyData);
                await company.save();

                user.company = company._id;
                await user.save();
                break;
        }
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}

exports.getAllUsers = async (req,res) => {

    try {
        let users = await User.find( {company: req.user.company._id, type: "customer" } ).populate("company").populate("customer").populate("defaultAddress");
        res.send(users);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }

}

exports.updateInfo = async (req,res) => {
    try {

        let address = {};
        let {user: userdata, customer: customerdata, company: companydata, address: addressdata } = req.body;

        if (customerdata) {
            await Customer.findByIdAndUpdate(customerdata._id, customerdata, {new: true});
        }

        if (companydata) {
            await Company.findByIdAndUpdate(companydata._id, companydata, {new: true});
        }

        if (addressdata) {
            address = await Address.findByIdAndUpdate(addressdata._id, addressdata, {new: true});
        }

        if  (userdata) {
            await User.findByIdAndUpdate(userdata._id, userdata, {new: true});
        }

        var user_id = (userdata && userdata._id) ? userdata._id : req.user._id;
        var user = await User.findById(user_id).populate("company").populate("customer");
        user._doc.address = address;

        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}

let getNewLocker = async (company) => {
    let latest_customer = await Customer.findOne( {company}, {}, { sort: { 'createdAt' : -1 } });
    return latest_customer ?  latest_customer.locker + 1 : 1000;
}

exports.loginUser = async (req,res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.logout = async (req,res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.logoutAll = async (req,res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}