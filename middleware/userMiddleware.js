import JWT from 'jsonwebtoken';

export default async(req, res, next) => {
 try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if(err) {
            return res.status(200).send({
                message:"Please Login to access this resource",
                success:false,
            });
        }else{
            req.body.userId = decode.id;
            next();
        }
    });
 } catch (error) {
    res.status(401).send({
        message: 'Please Login to access this resource',
        success: false
    });
 }
};

