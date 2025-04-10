const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../models/listing.js')



main().then((res) => {
    console.log("Database Connected Successfully..!")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect("mongodb+srv://CodeIt06:191204@cluster0.xsrfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}

const initDB = async () => {
    // Clear Existing Data
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner:"67f6ab7c1d3aeb5d4f915395"}))
    await Listing.insertMany(initData.data)

    console.log("Data Initialize Successfully")
}

initDB();