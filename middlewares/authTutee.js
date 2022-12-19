const jwt = require('jsonwebtoken');
const Tutee = require('../models/Tutee');
const protectedRouteForTutee = async(req, res, next) => {
    console.log(`PROTECTED ROUTE`)
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) throw new Error('Not authorized to access this route')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.tutee = await Tutee.findById(decoded.id)
        next()
    } catch (err) {
        throw new Error(err.message)
    }

}

module.exports = protectedRouteForTutee;