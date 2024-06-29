
import { Joi, Segments } from 'celebrate';

export const registerUserValidator = {
  [Segments.BODY]: {
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    profile: Joi.string().required(),
    password: Joi.string().optional(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).when('password', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
  },
};
