import jwt from 'jsonwebtoken'

export const hasCookie = (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) {
        return next()
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY)
    req.userId = decodedToken.userId
    next()
}