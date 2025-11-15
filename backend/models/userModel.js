import { query } from "./db.js";

const TABLE_NAME = "users";
const COLUMN_MAP = {
  name: "name",
  picture: "picture",
  displayName: "display_name",
  workEmail: "work_email",
  phone: "phone",
  dateOfBirth: "date_of_birth",
  nationality: "nationality",
  spokenLanguages: "spoken_languages",
  officeAddress: "office_address",
  allergies: "allergies",
  neurodiversity: "neurodiversity",
};
let ensured = false;
let ensurePromise;

async function ensureColumn(column, ddl) {
  const exists = await query(`SHOW COLUMNS FROM ${TABLE_NAME} LIKE ?`, [column]);
  if (!exists?.length) {
    await query(`ALTER TABLE ${TABLE_NAME} ADD COLUMN ${ddl}`);
  }
}

async function ensureUsersTable() {
  if (ensured) return;
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await query(
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          google_id VARCHAR(255),
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255),
          picture TEXT,
          password_hash VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
      );

      await ensureColumn("password_hash", "password_hash VARCHAR(255) NULL");
      await ensureColumn("created_at", "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
      await ensureColumn(
        "updated_at",
        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      );
      await ensureColumn("display_name", "display_name VARCHAR(255)");
      await ensureColumn("work_email", "work_email VARCHAR(255)");
      await ensureColumn("phone", "phone VARCHAR(50)");
      await ensureColumn("date_of_birth", "date_of_birth VARCHAR(50)");
      await ensureColumn("nationality", "nationality VARCHAR(100)");
      await ensureColumn("spoken_languages", "spoken_languages VARCHAR(255)");
      await ensureColumn("office_address", "office_address VARCHAR(255)");
      await ensureColumn("allergies", "allergies TEXT");
      await ensureColumn("neurodiversity", "neurodiversity VARCHAR(255)");

      ensured = true;
    })().catch((err) => {
      ensurePromise = undefined;
      throw err;
    });
  }
  return ensurePromise;
}

const User = {
  async upsertGoogleUser({ googleId, email, name, picture }) {
    if (!email) throw new Error("Google login no proporcionó email");
    await ensureUsersTable();

    await query(
      `INSERT INTO ${TABLE_NAME} (google_id, email, name, picture)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         google_id = VALUES(google_id),
         name = VALUES(name),
         picture = VALUES(picture),
         updated_at = CURRENT_TIMESTAMP`,
      [googleId, email, name, picture]
    );

    return this.findByEmail(email);
  },

  async findByEmail(email) {
    await ensureUsersTable();
    const rows = await query(
      `SELECT
        id,
        email,
        name,
        picture,
        google_id AS googleId,
        password_hash AS passwordHash,
        display_name AS displayName,
        work_email AS workEmail,
        phone,
        date_of_birth AS dateOfBirth,
        nationality,
        spoken_languages AS spokenLanguages,
        office_address AS officeAddress,
        allergies,
        neurodiversity
      FROM ${TABLE_NAME} WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows?.[0] ?? null;
  },

  async createLocalUser({ name, email, passwordHash }) {
    await ensureUsersTable();
    await query(
      `INSERT INTO ${TABLE_NAME} (name, email, password_hash, display_name, work_email)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, name, email]
    );
    return this.findByEmail(email);
  },

  async updateProfile(email, updates) {
    await ensureUsersTable();
    const fields = [];
    const values = [];
    Object.entries(COLUMN_MAP).forEach(([key, column]) => {
      if (updates[key] !== undefined) {
        fields.push(`${column} = ?`);
        values.push(updates[key] ?? null);
      }
    });

    if (!fields.length) {
      return this.findByEmail(email);
    }

    values.push(email);
    await query(
      `UPDATE ${TABLE_NAME} SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE email = ?`,
      values
    );

    return this.findByEmail(email);
  },
};

export default User;
