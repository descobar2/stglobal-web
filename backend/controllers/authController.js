import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const gclient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req, res) => {
  try {
    const { id_token } = req.body;
    // Never write OAuth credentials or user-controlled fragments to application logs.
    console.info("Google login attempt received");
    
    if (!id_token) {
      console.error("❌ Missing id_token in request body");
      return res.status(400).json({ error: "Missing id_token" });
    }

    console.log("🔍 Verifying id_token with Google...");
    const ticket = await gclient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      console.error("❌ Invalid token payload");
      return res.status(401).json({ error: "Invalid token" });
    }

    const { sub, email, name, picture } = payload;
    console.info("Google token verified");

    // Upsert en tu DB (implementa dentro de userModel.js)
    const user = await User.upsertGoogleUser({
      googleId: sub,
      email,
      name,
      picture,
    });
    console.info("Google user upserted");

    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("✅ Login successful. Sending response.");
    return res.json({ ok: true, user: serializeUser(user) });
  } catch {
    // Error details from external identity providers can contain untrusted input.
    console.error("Google login failed");
    return res.status(401).json({ error: "Unauthorized" });
  }
};

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    displayName: user.displayName,
    workEmail: user.workEmail,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    nationality: user.nationality,
    spokenLanguages: user.spokenLanguages,
    officeAddress: user.officeAddress,
    allergies: user.allergies,
    neurodiversity: user.neurodiversity,
  };
}

export const me = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user?.email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.json({ user: serializeUser(user) });
  } catch (err) {
    console.error("Me endpoint error:", err);
    return res.status(500).json({ error: "No se pudo obtener el perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.updateProfile(req.user?.email, req.body || {});
    return res.json({ user: serializeUser(user) });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "No se pudo actualizar el perfil" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const user = await User.findByEmail(email);
    if (!user?.passwordHash) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ ok: true, user: serializeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "No se pudo iniciar sesión" });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const existing = await User.findByEmail(email);
    if (existing?.passwordHash) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }
    if (existing?.googleId) {
      return res.status(409).json({ error: "Este correo ya fue usado con Google. Inicia sesión con Google." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.createLocalUser({ name, email, passwordHash });

    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({ ok: true, user: serializeUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "No se pudo crear la cuenta" });
  }
};
