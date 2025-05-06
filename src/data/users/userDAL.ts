
import { User } from '@/lib/validate/users';

const users = require('@/dummy.json').users;

export async function getUserByEmail(email: string) {
  return users.find((user: User) => user.email === email);
}

export async function getUserById(id: number) {
  return users.find((user: User) => user.id === id);
}

export async function createUser(user: User) {
  return users.push(user);
}

export async function updateUser(user: User) {
  const userToUpdate = users.find((user: User) => user.id === user.id);
  if (!userToUpdate) {
    return null;
  }
  userToUpdate.name = user.name;
  return userToUpdate;
}




