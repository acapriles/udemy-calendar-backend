/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
	'/new',
	[
		// Middlewares
		check('name', 'Name is required.').not().isEmpty(),
		check('email', 'Email is required.').isEmail(),
		check(
			'password',
			'The Password must contain more than 5 letters.'
		).isLength({ min: 6 }),
		validateFields,
	],
	createUser
);
router.post(
	'/',
	[
		// Middlewares
		check('email', 'Email is required.').isEmail(),
		check(
			'password',
			'The Password must contain more than 5 letters.'
		).isLength({ min: 6 }),
		validateFields,
	],
	loginUser
);
router.get('/renew', validateJWT, renewToken);

module.exports = router;
