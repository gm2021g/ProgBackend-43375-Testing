import { faker } from "@faker-js/faker";

export const newFakerUser = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 1, max: 100 }),
    password: faker.datatype.password,
  };
};
