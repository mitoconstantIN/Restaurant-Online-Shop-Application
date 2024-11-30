import { Router } from "express";
import jwt from 'jsonwebtoken';
import asynceHandeler from 'express-async-handler';
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';
import { sample_users } from "../data";

const router = Router();

// Ruta pentru seed
router.get("/seed", asynceHandeler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0) {
            res.send("Seed is already done!");
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seed is done!");
    }
));

// Ruta de login
router.post("/login", asynceHandeler(
    async (req, res) => {
        const { email, password } = req.body;

        // Caută utilizatorul după email
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(HTTP_BAD_REQUEST).send("Username or password is not valid!");
            return;
        }

        // Compară parola criptată
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(HTTP_BAD_REQUEST).send("Username or password is not valid!");
            return;
        }

        // Trimite răspunsul cu token și datele utilizatorului
        res.send(generateTokenResponse(user));
    }
));

// Ruta de înregistrare
router.post('/register', asynceHandeler(
    async (req, res) => {
        const { name, email, password, address } = req.body;

        // Verifică dacă utilizatorul există deja
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST).send('User already exists, please login!');
            return;
        }

        // Criptează parola
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Creează noul utilizator
        const newUser: User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        };

        // Salvează utilizatorul în baza de date
        const dbUser = await UserModel.create(newUser);

        // Trimite răspunsul cu token și datele utilizatorului
        res.send(generateTokenResponse(dbUser));
    }
));

// Funcție pentru generarea token-ului JWT
const generateTokenResponse = (user: any) => {
    const token = jwt.sign({
        id: user._id,  // Include id-ul utilizatorului în token
        email: user.email,
        isAdmin: user.isAdmin
    }, "SomeRandomText", {
        expiresIn: "30d"  // Token-ul expiră în 30 de zile
    });

    // Returnează token-ul împreună cu obiectul utilizator
    return {
        ...user.toObject(),  // Include toate proprietățile utilizatorului
        token: token         // Adaugă token-ul în răspuns
    };
}


export default router;
