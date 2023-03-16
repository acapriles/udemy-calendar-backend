/* 
    Events' routes
    host + /api/events
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { validateJWT } = require('../middlewares/validate-jwt');
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require('../controllers/events');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');

router.use(validateJWT);

//Get events
router.get('/', getEvents);

//Create event
router.post(
	'/',
	[
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalización es obligatoria').custom(isDate),
		validateFields,
	],
	createEvent
);

//Update event
router.put(
	'/:id',
	[
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalización es obligatoria').custom(isDate),
		validateFields,
	],
	updateEvent
);

//Delete event
router.delete('/:id', deleteEvent);

module.exports = router;
