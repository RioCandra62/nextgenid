"use server"

import pool from "../neon";

export async function getDataPenjualan(){
  try {
    const res = await pool.query(
      `SELECT * FROM sales 
       JOIN transactions ON sales.member_id = transactions.member_id 
       JOIN product ON transactions.product_id = product.product_id
       ORDER BY transactions.date DESC`
    );
    return res.rows;
  } catch (err) {
    console.error("getDataPenjualan error:", err);
    throw err;
  }
}

export async function getMembersAndProducts() {
  try {
    const membersRes = await pool.query("SELECT member_id, member_name FROM sales ORDER BY member_name ASC");
    const productsRes = await pool.query("SELECT product_id, product_name, price FROM product ORDER BY product_name ASC");
    return {
      members: membersRes.rows,
      products: productsRes.rows
    };
  } catch (err) {
    console.error("getMembersAndProducts error:", err);
    throw err;
  }
}

export async function AddDataPenjualan(form: FormData) {
  const member_id = form.get("member_id") as string;
  const product_id = form.get("product_id") as string;
  const qts = Number(form.get("qts"));
  const date = form.get("date") as string;

  // Basic validation
  if (!member_id) throw new Error("Sales Agent wajib dipilih");
  if (!product_id) throw new Error("Produk wajib dipilih");
  if (!qts || qts <= 0) throw new Error("Jumlah (Qty) tidak valid");
  if (!date) throw new Error("Tanggal transaksi wajib diisi");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Periksa ketersediaan stok produk
    const productRes = await client.query(
      "SELECT stock, product_name FROM product WHERE product_id = $1 FOR UPDATE",
      [product_id]
    );

    if (productRes.rows.length === 0) {
      throw new Error("Produk tidak ditemukan di database");
    }

    const { stock, product_name } = productRes.rows[0];
    if (stock < qts) {
      throw new Error(`Stok produk "${product_name}" tidak mencukupi (Sisa stok: ${stock})`);
    }

    // 2. Kurangi stok produk
    await client.query(
      "UPDATE product SET stock = stock - $1 WHERE product_id = $2",
      [qts, product_id]
    );

    // 3. Masukkan data transaksi penjualan
    const result = await client.query(
      `INSERT INTO transactions (member_id, product_id, qts, date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [member_id, product_id, qts, date]
    );

    await client.query("COMMIT");

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("AddDataPenjualan error:", err);
    throw new Error(err.message || "Gagal menyimpan transaksi");
  } finally {
    client.release();
  }
}