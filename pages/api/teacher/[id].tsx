import connect from "../../../utils/database";
import { ObjectID } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: true;
  coins: 1;
  courses: string[];
  available_hours: object;
  available_locations: string[];
  reviews: object[];
  appointments: object[];
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === "GET") {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: "Missing id" });
      return;
    }

    const { db } = await connect();

    const response = await db.findOne({ _id: new ObjectID(id) });

    if (!response) {
      res.status(400).json({ error: "id não encontrado" });
      return;
    }
    res.status(200).json(response);
  } else {
    res.status(400).json({ error: "Deu ruim" });
  }
};
