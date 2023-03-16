const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'User already exists',
			});
		}

		usuario = new Usuario(req.body);

		// Encrypt password
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		// Generate JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Please talk to the administrator',
		});
	}
};

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'The user does not exist with that email',
			});
		}

		// Confirm the passwords
		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Wrong password',
			});
		}

		// Generate JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Please talk to the administrator',
		});
	}
};

const renewToken = async (req, res = response) => {
	const { uid, name } = req;

	// Generate JWT
	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
		token,
	});
};

module.exports = {
	createUser,
	loginUser,
	renewToken,
};
