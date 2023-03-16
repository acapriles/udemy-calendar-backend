const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const createUserValidations = (e) => {
	return [
		// Middlewares
		check('name', 'Name is required.').not().isEmpty(),
		check('email', 'Email is required.').isEmail(),
		check(
			'password',
			'The Password must contain more than 5 letters.'
		).isLength({ min: 6 }),
		validateFields,
	];
};

const loginUserValidations = (e) => {
	return [
		// Middlewares
		check('email', 'Email is required.').isEmail(),
		check(
			'password',
			'The Password must contain more than 5 letters.'
		).isLength({ min: 6 }),
		validateFields,
	];
};

module.exports = {
	createUserValidations,
	loginUserValidations,
};
