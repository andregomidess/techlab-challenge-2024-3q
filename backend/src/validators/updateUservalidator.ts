
import { Joi, Segments } from 'celebrate';

export const updateUserValidator = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    profile: Joi.string(),
    password: Joi.string(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).when('password', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
  }).min(1),
};

