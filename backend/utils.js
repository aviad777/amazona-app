import jwt from "jsonwebtoken";



// gets user info and generate a token than gets decoded with isAuth function in the decode variable
export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
    },
        // in production delete something secret which is the password....
        process.env.JWT_SECRET || 'somethingsecret',
        {
            expiresIn: '30d'
        });
}

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        // the first 7 letters says 'bearer ' than the token
        jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret', (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' })
            } else {
                req.user = decode;
                next();
            }
        });

    } else {
        res.status(401).send({ message: 'No Token' });
    }
}


export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'invalid Admin Token' });
    }
}



export const isSeller = (req, res, next) => {
    if (req.user && req.user.isSeller) {
        next();
    } else {
        res.status(401).send({ message: 'invalid Seller Token' });
    }
}

export const isSellerOrAdmin = (req, res, next) => {
    console.log('is seller or admin check');
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
        console.log('is seller or admin');
        next();
    } else {
        res.status(401).send({ message: 'invalid Seller/admin Token' });
    }
}