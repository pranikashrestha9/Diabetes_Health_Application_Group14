import crypto from 'crypto';

export const uniqueKey = () =>{
    return crypto.randomBytes(16).toString('hex');
}

