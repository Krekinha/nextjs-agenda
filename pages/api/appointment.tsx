import { NextApiRequest, NextApiResponse } from "next";
import { ObjectID } from "mongodb";
import connect from "../../utils/database";
//import { getSession } from "next-auth/client";

interface User {
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: {
    date: string;
  }[];
  _id: string;
}

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date: string;
  teacher_name: string;
  teacher_id: string;
  student_name: string;
  student_id: string;
  course: string;
  location: string;
  appointment_link: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === "POST") {
    // const session = await getSession({ req });

    // if (!session) {
    //   res.status(400).json({ error: `voce nao esta logado` });
    //   return;
    // }

    const {
      date,
      teacher_id,
      teacher_name,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    }: {
      date: string;
      teacher_name: string;
      teacher_id: string;
      student_name: string;
      student_id: string;
      course: string;
      location: string;
      appointment_link: string;
    } = req.body;

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      res.status(400).json({ error: "Missing parameter" });
      return;
    }

    let testTeacherID: ObjectID;
    let testStudentID: ObjectID;
    try {
      testTeacherID = new ObjectID(teacher_id);
      testStudentID = new ObjectID(student_id);
    } catch (tes) {
      res.status(400).json({ error: "Missing ObjectID" });
      return;
    }

    const parsedDate = new Date(date);
    const now = new Date();
    const today = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
    const fullDate = {
      day: parsedDate.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };

    // check if requested date is on the past
    if (
      fullDate.year < today.year ||
      fullDate.year < today.year ||
      fullDate.day < today.day
    ) {
      res.status(400).json({
        error: "You cant create appointment on the past",
      });
      return;
    }

    const { db } = await connect();

    // check if teacher exists
    const teacherExists: User = await db.findOne({ _id: testTeacherID });

    if (!teacherExists) {
      res.status(400).json({ error: `teacher ${teacher_id} não encontrado` });
      return;
    }

    // check if student exists
    const studentExists: User = await db.findOne({ _id: testStudentID });

    if (!studentExists) {
      res.status(400).json({ error: `student ${student_id} não encontrado` });
      return;
    }

    if (studentExists.coins === 0) {
      res.status(400).json({ error: `${student_name} não tem nenhuma moeda` });
      return;
    }

    // verifica se o dia/hora esta disponivel para o professor
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const requestedDay = weekdays[parsedDate.getDay()];
    const requestedHour = parsedDate.getHours();
    if (!teacherExists.available_hours[requestedDay]?.includes(requestedHour)) {
      res.status(400).json({
        error: `${teacher_name} não esta disponível em ${requestedDay} ${requestedHour}:00`,
      });
      return;
    }

    //check if texher already have an appointment on the requested day of the month
    teacherExists.appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);

      if (appointmentDate.getTime() === parsedDate.getTime()) {
        res
          .status(400)
          .json({ error: `${teacher_name} já tem um agendamento nesta data` });
        return;
      }
    });

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || "",
    };

    // update teacher appointments
    await db.updateOne(
      { _id: new ObjectID(teacher_id) },
      { $push: { appointments: appointment }, $inc: { coins: 1 } }
    );

    // update teacher appointments
    await db.updateOne(
      { _id: new ObjectID(student_id) },
      { $push: { appointments: appointment }, $inc: { coins: -1 } }
    );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ error: "Deu ruim" });
  }
};
