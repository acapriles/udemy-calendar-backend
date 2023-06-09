// {
//     ok:true,
//     msg: 'Get events'
// }

const { response } = require('express');
const Evento = require('../models/Evento');

const getEvents = async (req, res = response) => {
	const eventos = await Evento.find().populate('user', 'name');

	res.json({
		ok: true,
		eventos,
	});
};

const createEvent = async (req, res = response) => {
	const evento = new Evento(req.body);

	try {
		evento.user = req.uid;

		const eventoGuardado = await evento.save();

		res.json({
			ok: true,
			evento: eventoGuardado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Talk to the administrator',
		});
	}
};

const updateEvent = async (req, res = response) => {
	const eventoId = req.params.id;
	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'Event does not exist for that id',
			});
		}

		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'You do not have privilege to edit this event',
			});
		}

		const nuevoEvento = {
			...req.body,
			user: uid,
		};

		const eventoActualizado = await Evento.findByIdAndUpdate(
			eventoId,
			nuevoEvento,
			{ new: true }
		);

		res.json({
			ok: true,
			evento: eventoActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Talk to the administrator',
		});
	}
};

const deleteEvent = async (req, res = response) => {
	const eventoId = req.params.id;
	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'Event does not exist for that id',
			});
		}

		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'You do not have privilege to delete this event',
			});
		}

		await Evento.findByIdAndDelete(eventoId);

		res.json({ ok: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Talk to the administrator',
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
