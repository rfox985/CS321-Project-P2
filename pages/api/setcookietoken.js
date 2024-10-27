import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { redirect } from 'next/navigation'

// UNUSED FOR NOW: maybe use cookies to store token after logging in?
export default async function handler(req, res) {
    const { token } = req.query;

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        // const sessionToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        //     expiresIn: '1h',
        // });

        res.setHeader(
            'Set-Cookie',
            serialize('auth', token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV !== 'development',
                // sameSite: 'strict',
                maxAge: 3600,
                path: '/',
            }),
        );

        res.writeHead(302, { Location: '/components/ChangePasswordForm'});
        res.end();
    }

    catch (err) {
        // res.status(401).json({ error: 'Invalid token' });
        // res.redirect(401, '/#');
        // res.end();
        res.status(401).redirect(307, "/");
    }
}