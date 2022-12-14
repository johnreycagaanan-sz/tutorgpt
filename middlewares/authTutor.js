const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor');
const protectedRouteForTutor = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) throw new Error(`Not authorized to access this route`);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.tutor = await Tutor.findById(decoded.id)

        next();
    } catch (err) {
        throw new Error(`Not authorized to access this route:${err.message}`)
    }
}

module.exports = protectedRouteForTutor;