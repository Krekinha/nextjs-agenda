import connect from "../../../utils/database";
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
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  // show user profile
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ error: "Missing e-mail" });
      return;
    }

    const { db } = await connect();

    const response = await db.findOne({ email });

    if (!response) {
      res.status(400).json({ error: "e-mail não encontrado" });
      return;
    }
    res.status(200).json(response);
  } else {
    res.status(400).json({ error: "Deu ruim" });
  }
};
