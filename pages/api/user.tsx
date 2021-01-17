import connect from "../../utils/database";
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
  if (req.method === "POST") {
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      available_hours,
      available_locations,
    }: {
      name: string;
      email: string;
      cellphone: string;
      teacher: Boolean;
      courses: string[];
      available_hours: Record<string, number[]>;
      available_locations: string[];
    } = req.body;

    if (!teacher) {
      if (!name || !email || !cellphone) {
        res.status(400).json({ error: "Missing some parameter" });
        return;
      }
    } else {
      if (
        !name ||
        !email ||
        !cellphone ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        res.status(400).json({ error: "Missing some parameter" });
        return;
      }
    }

    const { db } = await connect();

    const response = await db.insertOne({
      name,
      email,
      cellphone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: [],
    });

    res.status(200).json(response.ops[0]);
  } else {
    res.status(400).json({ error: "Deu ruim" });
  }
};
