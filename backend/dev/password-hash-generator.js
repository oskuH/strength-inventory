import { genSaltSync, hashSync } from 'bcrypt-ts';

const password = 'HustleForThatMuscle';
const salt = genSaltSync(10);
const passwordHash = hashSync(password, salt);

console.log(passwordHash);