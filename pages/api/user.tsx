import connect from '../../utils/database';

export default function handler(req, res) {
    res.status(200).json({msg: 'eh nois'});
}

const { db } = await connect();
