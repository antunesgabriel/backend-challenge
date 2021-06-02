import * as faker from 'faker';

import { emailIsValid } from './email.validation';

describe('Email validation', () => {
  it('should be return false if email is invalid', () => {
    expect(emailIsValid('')).toBeFalsy();
  });

  it('should be return true if email is valid', () => {
    expect(emailIsValid(faker.internet.email())).toBeTruthy();
  });
});
