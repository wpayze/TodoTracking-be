const Parcel = require('../models/Parcel');

let getNewNumber = async (company) => {
    let latest_parcel = await Parcel.findOne( {company}, {}, { sort: { 'createdAt' : -1 } });
    console.log(latest_parcel);
    return latest_parcel ?  latest_parcel.number + 1 : 1;
}

exports.getParcel = async (req,res) => {
    try {
        
        const parcelID = req.params.id;
        const parcel = await Parcel.findById(parcelID);
        res.status(201).send(parcel);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}

exports.getParcels = async (req,res) => {
    try {
        
        const user = req.user;
        let statement = {};

        if (user.type == "customer") 
            statement = { customer: user.customer._id }    
        else if (user.type == "company") 
            statement = { company: user.company._id }   

        console.log(statement);

        const parcels = await Parcel.find(statement).populate("company").populate("customer");
        res.status(201).send(parcels);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}

exports.addParcel = async (req,res) => {
    try {
        
        let parceldata = req.body;
        parceldata.number = await getNewNumber(req.user.company._id);
        const parcel = new Parcel(parceldata);
        await parcel.save();

        res.status(201).send(parcel);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}

exports.editParcel = async (req,res) => {
    try {
        
        const parceldata = req.body;
        const parcel = await Parcel.findByIdAndUpdate(parceldata._id, parceldata, {new:true});
        res.status(201).send(parcel);

    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }
}