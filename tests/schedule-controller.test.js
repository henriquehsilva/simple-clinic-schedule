import ScheduleControllers from '../controllers/schedule-controllers';
import fs from 'fs';
const DB_FILE_PATH = './db/schedules.json';

describe('ScheduleControllers', () => {

  let schedule;
  
  const initializeScheduleDatabase = () => {
    schedule = {
        date: '10/06/2023',
        time: '14:22:43',
        specialty: 'Cardiologista'
    };
  };

  const clearScheduleDatabase = () => {
    fs.writeFileSync(DB_FILE_PATH, "");
  };

  beforeEach(() => {
    initializeScheduleDatabase();
  });
  
  afterEach(() => {
    clearScheduleDatabase();
  });

  test ('should created new schedule', () => {  
    const createSchedule = ScheduleControllers.create(schedule);
    
    expect(createSchedule).toHaveProperty('_id');
  });

  test ('should updated schedule', () => {
    const createSchedule = ScheduleControllers.create(schedule);
    const updateSchedule = ScheduleControllers.update(createSchedule.id, {specialty: 'Clinico Geral'});
    
    expect(updateSchedule.specialty).toBe('Clinico Geral');
  });

  test ('should deleted schedule', () => {
    const createSchedule = ScheduleControllers.create(schedule);
    const deleteSchedule = ScheduleControllers.delete(createSchedule.id);

    expect(deleteSchedule).toBe(undefined);
  });

  test ('should not delete schedule', () => {
    ScheduleControllers.create(schedule);
    const deleteSchedule = ScheduleControllers.delete(2);

    expect(deleteSchedule).toBe(undefined);
   });

  test ('should list all schedules', () => {
    ScheduleControllers.create(schedule);
    const listAllSchedules = ScheduleControllers.listAll();

    expect(listAllSchedules.length).toBe(1);
  });
});