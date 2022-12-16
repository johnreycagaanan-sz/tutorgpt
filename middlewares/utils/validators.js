const tutorValidator = (req, res, next) => {
    if (req.body){
        if(!req.body.tutorName ||
           !req.body.email ||
           !req.body.phoneNumber){
            res
            .status(400)
            .setHeader('Content-Type', 'text/plain')
            .end('Missing required fields')
           }
           else{
            next();
           }
    }
    else{
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
    }
}

const tuteeValidator = (req, res, next) => {
    if (req.body){
        if(!req.body.tuteeName ||
           !req.body.userName ||
           !req.body.gender ||
           !req.body.age){
            res
            .status(400)
            .setHeader('Content-Type', 'text/plain')
            .end('Missing required fields')
           }
           else{
            next();
           }
    }
    else{
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
    }
}

const sessionValidator = (req, res, next) => {
    if (req.body){
        if(!req.body.startTime ||
           !req.body.endTime ||
           !req.body.subject){
            res
            .status(400)
            .setHeader('Content-Type', 'text/plain')
            .end('Missing required fields')
           }
           else{
            next();
           }
    }
    else{
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
    }
}

const adminValidator =(req, res, next) => {
    if(req.user.admin){
        next();
    } else{
        res
            .status(403)
            .setHeader('Content-Type', 'application/json')
            .json(`Unauthorized access to this resource!`)
    }
}
module.exports = {
    tutorValidator,
    tuteeValidator,
    sessionValidator,
    adminValidator
}