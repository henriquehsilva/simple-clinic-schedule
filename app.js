import UserControllers from './controllers/user-controllers.js';
import ScheduleControllers from './controllers/schedule-controllers.js';
import inquirer from 'inquirer';

const showMenu = () => {
  const menu = "\tAgendamento de Consultas Clinicas\n\n" +
    "\t1. Cadastrar paciente\n" +
    "\t2. Marcar consulta\n" +
    "\t3. Cancelar consulta\n" +
    "\t4. Sair\n" +
    "\t----------------------------------\n";
  console.log(menu);
  inputFunc();
}

const user = {
  id: 0,
  name: '',
  phone: ''
}

const schedule = {
  id: 0,
  date: '',
  time: '',
  specialty: '',
  userId: 0
}

// Created input methods for application
const inputFunc = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'func',
        message: 'Escolha uma funcionalidade dentre as apresentadas:'
      },
    ])
    .then(answers => {
      switch(answers.func) {
        case '1': inputUser(); break;
        case '2': listUsers(); break;
        case '3': listSchedules(); break;
        case '4': process.exit(1); break;
      }; 
    });
}

const inputUser = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Qual o nome do paciente?'
      },
    ])
    .then(answers => {
      user.name = answers.name;
      if (user.name != '') {
        inputUserPhone();
      }
    });
}

const inputUserPhone = () => { 
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'phone',
        message: 'Qual o número de telefone?'
      },
    ])
    .then(answers => {
      user.phone = answers.phone;
      if (user.phone != '') {
        const hasPhone = UserControllers.listAll().filter((userFilter) => { 
          if (userFilter.phone === user.phone) {
            return true;
          }
          return false;
        });
        
        if(hasPhone.length > 0) {    
          console.info('\n\t\x1b[33m Paciente já cadastrado! \x1b[0m\n');
        } else {
          UserControllers.create(user.name, user.phone);
          console.info('\n\t\x1b[32m Paciente cadastrado com sucesso!\x1b[0m\n');      
        } 
        showMenu();
      }
    });
}

const inputSchedule = (userId) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'date',
        message: 'Qual o dia da consulta?',
        default: new Date().toLocaleDateString()
      },
    ])
    .then(answers => {
      schedule.date = answers.date;
      schedule.userId = userId;
      if (schedule.date != '') {
        inputScheduleTime();
      }
    });
}

const inputScheduleTime = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'time',
        message: 'Qual o horário da consulta?',
        default: new Date().toLocaleTimeString()
      },
    ])
    .then(answers => {
      schedule.time = answers.time;
      if (schedule.time != '') {
        inputScheduleSpecialty();
      }
    });
}

const inputScheduleSpecialty = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'specialty',
        message: 'Qual a especialidade?',
        default: 'Clinico Geral'
      },
    ])
    .then(answers => {
      schedule.specialty = answers.specialty;
      if (schedule.date < new Date().toLocaleDateString() || schedule.time < new Date().toLocaleTimeString()) {
        console.log('\n\t\x1b[33m Horário inválido! \x1b[0m\n');
      } else {
        const scheduleFilter = ScheduleControllers.listAll().filter((scheduleFilter) => {
          if (scheduleFilter.date === schedule.date && scheduleFilter.time === schedule.time) {
            return true;
          }
          return false;
        });

        if (scheduleFilter.length > 0) {
          console.log('\n\t\x1b[33m Horário indisponível! \x1b[0m\n');
        } else {         
          ScheduleControllers.create(schedule.date, 
            schedule.time, 
            schedule.specialty, 
            schedule.userId
          );
          console.info('\n\t\x1b[32m Consulta marcada com sucesso!\x1b[0m\n');
        }  
      }
      showMenu();
    });
}

// Created mask for phone
const maskPhone = (phone) => {
  let maskedPhone = '';
  let count = 0;
  for (let i = 0; i < phone.length; i++) {
    if (count == 0) {
      maskedPhone += '(' + phone[i];
    } else if (count == 1) {
      maskedPhone += phone[i] + ') ';
    } else if (count == 6) {
      maskedPhone += phone[i] + '-';
    } else {
      maskedPhone += phone[i];
    }
    count++;
  }
  return maskedPhone;
}

// Created list methods for application
const listUsers = () => {
  const title = "\n\tLista de Pacientes Cadastrados\n";
  console.info(title);
  
  UserControllers.listAll().forEach((user) => {
    console.info("\t" + user.id + " | " + user.name + "\t | " + maskPhone(user.phone));
  });
    
  console.info("\t----------------------------------\n");
  selectUser();

}

const listSchedules = () => {
  const title = "\n\tLista de Agendamentos Cadastrados\n";
  console.info(title);
  
  ScheduleControllers.listAll().forEach((schedule) => {
    console.info("\t" + schedule.id + " | " + schedule.date + "\t | " + schedule.time + "\t | " + schedule.specialty);
  });
    
  console.info("\t----------------------------------\n");
  selectSchedule();

}

// Created select methods for application
const selectUser = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'userId',
        message: 'Escolha o número correspondente a um paciente:'
      },
    ])
    .then(answers => {
      UserControllers.listAll().filter((user) => {
        if (user.id == answers.userId) {
          console.info("\n\t" + user.id + " | " + user.name + "\t | " + maskPhone(user.phone));
          console.info("\t----------------------------------\n");
          inputSchedule(user.id);
        }
      });
    });
}

const selectSchedule = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'scheduleId',
        message: 'Deseja remarcar qual agendamento:'
      },
    ])
    .then(answers => {
      ScheduleControllers.listAll().filter((schedule) => {
        if (schedule.id == answers.scheduleId) {
          console.info("\n\t" + schedule.id + " | " + schedule.date + "\t | " + schedule.time + "\t | " + schedule.specialty);
          console.info("\t----------------------------------\n");
          deleteSchedule(schedule.id);
        }
    });
  });
}

const deleteSchedule = (scheduleId) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'validation',
        message: 'Deseja realmente cancelar o agendamento? (digite Sim ou Não)',
        default: 'Sim'
      },
    ])
    .then(answers => {
      if (answers.validation != 'Sim') { showMenu(); }
      ScheduleControllers.delete(scheduleId);
      console.info('\n\t\x1b[32m Consulta cancelada com sucesso!\x1b[0m\n');
      showMenu();
    });
}


showMenu();