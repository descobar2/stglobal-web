import { query } from "./db.js";

const TABLE_NAME = "consultations";
let ensured = false;
let ensurePromise;

async function ensureConsultationsTable() {
  if (ensured) return;
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await query(
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          start_at DATETIME NOT NULL,
          end_at DATETIME NOT NULL,
          duration INT NOT NULL,
          status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'confirmed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_consult_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
      );
      ensured = true;
    })().catch((err) => {
      ensurePromise = undefined;
      throw err;
    });
  }
  return ensurePromise;
}

const ConsultationModel = {
  async create({ userId, startAt, endAt, duration, status = "confirmed" }) {
    await ensureConsultationsTable();
    const result = await query(
      `INSERT INTO ${TABLE_NAME} (user_id, start_at, end_at, duration, status)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, startAt, endAt, duration, status]
    );
    const insertId = result?.insertId ?? result?.[0]?.insertId;
    return this.findById(insertId);
  },

  async findById(id, userId = null) {
    if (!id) return null;
    await ensureConsultationsTable();
    const rows = await query(
      `SELECT id, user_id AS userId, start_at AS startAt, end_at AS endAt, duration, status, created_at AS createdAt
       FROM ${TABLE_NAME}
       WHERE id = ? AND (? IS NULL OR user_id = ?)
       LIMIT 1`,
      [id, userId, userId]
    );
    return rows?.[0] ?? null;
  },

  async listByUser(userId) {
    await ensureConsultationsTable();
    return query(
      `SELECT id, user_id AS userId, start_at AS startAt, end_at AS endAt, duration, status, created_at AS createdAt
       FROM ${TABLE_NAME}
       WHERE user_id = ?
       ORDER BY start_at DESC`,
      [userId]
    );
  },

  async markCompleted(userId) {
    await ensureConsultationsTable();
    await query(
      `UPDATE ${TABLE_NAME}
       SET status = 'completed'
       WHERE user_id = ? AND status = 'confirmed' AND end_at < NOW()`,
      [userId]
    );
  },

  async updateById({ id, userId, startAt, endAt, duration, status = "confirmed" }) {
    await ensureConsultationsTable();
    const result = await query(
      `UPDATE ${TABLE_NAME}
       SET start_at = ?, end_at = ?, duration = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [startAt, endAt, duration, status, id, userId]
    );
    if (!result?.affectedRows) return null;
    return this.findById(id, userId);
  },
};

export default ConsultationModel;
