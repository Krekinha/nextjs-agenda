import connect from "../../utils/database";
import { NextApiRequest, NextApiResponse } from "next";

interface IAvailableHours {
  monday: number[];
  tuesday: number[];
  wednesday: number[];
  thursday: number[];
  friday: number[];
}

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
  available_hours: IAvailableHours;
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
      available_hours: IAvailableHours;
      available_locations: string[];
    } = req.body;

    let invalidHour = false;
    for (const day in available_hours) {
      available_hours[day].forEach((hour) => {
        if (hour < 7 || hour > 20) {
          invalidHour = true;
          return;
        }
      });
    }
    if (invalidHour) {
      res
        .status(400)
        .json({ error: "Você só pode lecionar entre 07:00 e 20:00 horas" });
      return;
    }

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
