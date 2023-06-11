import UserControllers from '../controllers/user-controllers';
import fs from 'fs';
const DB_FILE_PATH = './db/users.json';

describe('UserControllers', () => {

  let user;
  
  const initializeUserDatabase = () => {
    user = {
      name: 'Henrique',
      phone: '11999999999'
    };
  };

  const clearUserDatabase = () => {
    fs.writeFileSync(DB_FILE_PATH, "");
  };

  beforeEach(() => {
    initializeUserDatabase();
  });
  
  afterEach(() => {
    clearUserDatabase();
  });

  test ('should created new user', () => {  
    const createUser = UserControllers.create(user);
    
    expect(createUser).toHaveProperty('_id');
  });

  test ('should updated user', () => {
    const createUser = UserControllers.create(user);
    const updateUser = UserControllers.update(createUser.id, {name: 'Pedro'});
    
    expect(updateUser.name).toBe('Pedro');
  });

  test ('should deleted user', () => {
    const createUser = UserControllers.create(user);
    const deleteUser = UserControllers.delete(createUser.id);

    expect(deleteUser).toBe(undefined);
  });

  test ('should not delete user', () => {
    UserControllers.create(user);
    const deleteUser = UserControllers.delete(2);

    expect(deleteUser).toBe(undefined);
   });

  test ('should list all users', () => {
    UserControllers.create(user);
    const listAllUsers = UserControllers.listAll();

    expect(listAllUsers.length).toBe(1);
  });
});