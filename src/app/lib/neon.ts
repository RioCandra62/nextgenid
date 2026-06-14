import { Pool } from "@neondatabase/serverless";

// Gunakan Pool agar koneksi dimanage otomatis (buka/tutup sendiri)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;


