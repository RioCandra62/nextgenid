"use server"

import pool from "../neon"

export async function getDataPenjualan() {
    try {
        const result = await pool.query("SELECT * FROM product ORDER BY product_name ASC");
        return result.rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function addProduct(form: FormData) {
    const product_name = form.get("product_name") as string;
    const price = Number(form.get("price"));
    const stock = Number(form.get("stock"));

    if (!product_name) throw new Error("Nama produk wajib diisi");
    if (isNaN(price) || price <= 0) throw new Error("Harga produk tidak valid");
    if (isNaN(stock) || stock < 0) throw new Error("Jumlah stok awal tidak valid");

    try {
        const result = await pool.query(
            `INSERT INTO product (product_name, price, stock)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [product_name, price, stock]
        );
        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error: any) {
        console.error("Error adding product:", error);
        throw new Error(error.message || "Gagal menambahkan produk");
    }
}

export async function addProductStock(product_id: string, additionalStock: number) {
    if (!product_id) throw new Error("ID produk wajib ditentukan");
    if (isNaN(additionalStock) || additionalStock <= 0) throw new Error("Jumlah tambahan stok tidak valid");

    try {
        const result = await pool.query(
            `UPDATE product 
             SET stock = stock + $1 
             WHERE product_id = $2 
             RETURNING *`,
            [additionalStock, product_id]
        );
        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error: any) {
        console.error("Error updating product stock:", error);
        throw new Error(error.message || "Gagal menambahkan stok produk");
    }
}

export async function editProduct(form: FormData) {
    const product_id = form.get("product_id") as string;
    const product_name = form.get("product_name") as string;
    const price = Number(form.get("price"));
    const stock = Number(form.get("stock"));

    if (!product_id) throw new Error("ID produk wajib ditentukan");
    if (!product_name) throw new Error("Nama produk wajib diisi");
    if (isNaN(price) || price <= 0) throw new Error("Harga produk tidak valid");
    if (isNaN(stock) || stock < 0) throw new Error("Jumlah stok tidak valid");

    try {
        const result = await pool.query(
            `UPDATE product 
             SET product_name = $1, price = $2, stock = $3 
             WHERE product_id = $4 
             RETURNING *`,
            [product_name, price, stock, product_id]
        );
        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error: any) {
        console.error("Error editing product:", error);
        throw new Error(error.message || "Gagal memperbarui produk");
    }
}