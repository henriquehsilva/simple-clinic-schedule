import fs from 'fs';
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = './db/schedules.json';

class ScheduleController  {
  create = (date, time, specialty, userId ) => {
    const lastSchedule = this.listAll()[this.listAll().length - 1]
    const id = lastSchedule ? lastSchedule.id + 1 : 1

    const schedule = {
      _id: uuid(),
      id: id,
      date: date,
      time: time,
      specialty: specialty,
      userId: userId,
    }

    const schedules = [
      ...this.listAll(),
      schedule,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      schedules,
    }, null, 2));
    return schedule;
  };

  update = (id, partialSchedule) => { 
    let updatedSchedule;

    const schedules = this.listAll();
    schedules.map((currentSchedule) => { 
      const isUpdatedSchedule = currentSchedule.id === id;
      if (isUpdatedSchedule) {
        updatedSchedule = Object.assign(currentSchedule, partialSchedule);
      }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      schedules,
    }, null, 2));

    if (!updatedSchedule) {
      throw new Error('Please, check the user id and try again.');
    }

    return updatedSchedule;
  } 

  delete = (id) => {
    const schedules = this.listAll();

    const schedulesWithoutOne = schedules.filter((user) => {
     if (user.id === id) {
       return false;
     }
      return true;
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      schedules: schedulesWithoutOne,
    }, null, 2));
  };

  listAll = () => {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db = JSON.parse(dbString || '{"schedules": []}');
    if (!db.schedules) {
      return [];
    } 
    return [...db.schedules] ;
  };
};

export default new ScheduleController();