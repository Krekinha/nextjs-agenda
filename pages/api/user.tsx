import connect from '../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponseType {
    error: string
}

interface SuccessResponseType {
    _id: string;
    name: string;
    email: string;
    cellphone: string;
    teacher: string;
}
export default async (
    req: NextApiRequest, 
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
    ): Promise<void> => {

    if (req.method === 'POST') {
        
        const { name, email, cellphone, teacher} = req.body;
        
        if (!name || !email || !cellphone || !teacher) {
            res.status(400).json({ error: 'Missing some parameter' });
            return;
        }
        
        const { db } = await connect();
        
        const response = await db.collection('users').insertOne ({  
            name, 
            email, 
            cellphone, 
            teacher 
        });
        
        res.status(200).json(response.ops[0]);
    } else {
        res.status(400).json({ error: req.body });
    }
}

