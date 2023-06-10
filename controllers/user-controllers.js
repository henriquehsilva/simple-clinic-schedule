import fs from 'fs';
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = './db/users.json';

class UserController  {
  create = (name, phone) => {
    const lastUser = this.listAll()[this.listAll().length - 1]
    const id = lastUser ? lastUser.id + 1 : 1

    const user = {
      _id: uuid(),
      id: id,
      name: name,
      phone: phone,
    }

    const users = [
      ...this.listAll(),
      user,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      users,
    }, null, 2));
    return user;
  };

  update = (id, partialUser) => { 
    let updatedUser;

    const users = this.listAll();
    users.map((currentUser) => { 
      const isUpdatedUser = currentUser.id === id;
      if (isUpdatedUser) {
       updatedUser = Object.assign(currentUser, partialUser);
      }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      users,
    }, null, 2));

    if (!updatedUser) {
      throw new Error('Please, check the user id and try again.');
    }

    return updatedUser;
  } 

  delete = (id) => {
    const users = this.listAll();

    const usersWithoutOne = users.filter((user) => {
     if (user.id === id) {
       return false;
     }
      return true;
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
      users: usersWithoutOne,
    }, null, 2));
  };

  listAll = () => {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db = JSON.parse(dbString || '{"users": []}');
    if (!db.users) {
      return [];
    }
    return [...db.users];
  };
};

export default new UserController();