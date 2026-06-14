"use server"

import pool from "../neon"

export async function getMember() {
    try {
        const res = await pool.query(
            `SELECT * FROM sales ORDER BY member_name ASC`
        );
        return res.rows;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
}

export async function addMember(form: FormData) {
    const member_name = (form.get("member_name") as string || "").trim();
    const username = (form.get("username") as string || "").trim();
    const password = (form.get("password") as string || "").trim();
    const status = (form.get("status") as string || "active").trim();

    if (!member_name) throw new Error("Nama Sales Agent wajib diisi");
    if (!username) throw new Error("Username wajib diisi");
    if (!password) throw new Error("Password wajib diisi");

    try {
        // Check if username already exists
        const checkUser = await pool.query(
            "SELECT 1 FROM sales WHERE LOWER(username) = LOWER($1)",
            [username]
        );
        if (checkUser.rows.length > 0) {
            throw new Error(`Username "${username}" sudah digunakan`);
        }

        const result = await pool.query(
            `INSERT INTO sales (member_name, username, password, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [member_name, username, password, status]
        );

        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error: any) {
        console.error("Error adding member:", error);
        throw new Error(error.message || "Gagal menambahkan akun");
    }
}

export async function editMember(form: FormData) {
    const member_id = form.get("member_id") as string;
    const member_name = (form.get("member_name") as string || "").trim();
    const username = (form.get("username") as string || "").trim();
    const password = (form.get("password") as string || "").trim();
    const status = (form.get("status") as string || "active").trim();

    if (!member_id) throw new Error("ID Member tidak ditemukan");
    if (!member_name) throw new Error("Nama Sales Agent wajib diisi");
    if (!username) throw new Error("Username wajib diisi");

    try {
        // Check if username is taken by another member
        const checkUser = await pool.query(
            "SELECT 1 FROM sales WHERE LOWER(username) = LOWER($1) AND member_id <> $2",
            [username, member_id]
        );
        if (checkUser.rows.length > 0) {
            throw new Error(`Username "${username}" sudah digunakan oleh akun lain`);
        }

        let result;
        if (password) {
            // Update including password
            result = await pool.query(
                `UPDATE sales
                 SET member_name = $1, username = $2, password = $3, status = $4
                 WHERE member_id = $5
                 RETURNING *`,
                [member_name, username, password, status, member_id]
            );
        } else {
            // Update excluding password
            result = await pool.query(
                `UPDATE sales
                 SET member_name = $1, username = $2, status = $3
                 WHERE member_id = $4
                 RETURNING *`,
                [member_name, username, status, member_id]
            );
        }

        if (result.rows.length === 0) {
            throw new Error("Akun member tidak ditemukan");
        }

        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error: any) {
        console.error("Error editing member:", error);
        throw new Error(error.message || "Gagal memperbarui akun");
    }
}

export async function deleteMember(member_id: string) {
    if (!member_id) throw new Error("ID Member tidak ditemukan");

    try {
        // Check if the member has existing transactions
        const checkTx = await pool.query(
            "SELECT 1 FROM transactions WHERE member_id = $1 LIMIT 1",
            [member_id]
        );

        if (checkTx.rows.length > 0) {
            throw new Error(
                "Gagal menghapus: Akun Sales Agent ini memiliki data transaksi penjualan. Silakan nonaktifkan akun sebagai gantinya."
            );
        }

        const result = await pool.query(
            "DELETE FROM sales WHERE member_id = $1 RETURNING *",
            [member_id]
        );

        if (result.rows.length === 0) {
            throw new Error("Akun member tidak ditemukan");
        }

        return {
            success: true,
            message: "Akun berhasil dihapus"
        };
    } catch (error: any) {
        console.error("Error deleting member:", error);
        throw new Error(error.message || "Gagal menghapus akun");
    }
}