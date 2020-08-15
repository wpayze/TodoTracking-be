const User = require('../models/User');
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const Address = require('../models/Address');

exports.getUserByToken = async (req,res) => {
    res.send(req.user);
}

exports.registerUser = async (req,res) => {
    // Create a new user
    try {
        const user = new User(req.body.user);
        await user.save();

        req.body.address.user = user._id;
        const address = new Address(req.body.address);
        await address.save();

        switch (req.body.user.type) {
            case "customer":
                req.body.customer.address = address._id;
                req.body.customer.user = user._id;
                req.body.customer.locker = await getNewLocker(req.body.customer.company);

                const customer = new Customer(req.body.customer);
                await customer.save();

                user.customer = customer._id;
                user.company = req.body.customer.company;
                await user.save();
                break;
            case "company":
                req.body.company.address = address._id;
                req.body.company.user = user._id;

                const company = new Company(req.body.company);
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