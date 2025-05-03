"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { Category } from "./schema"

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const category = await db.category.findUnique({
      where: { id },
    })
    return category
  } catch (error) {
    console.error(`Failed to fetch category with id ${id}:`, error)
    return null
  }
}

export async function createCategory(data: {
  name: string
  description: string
}): Promise<Category> {
  try {
    const category = await db.category.create({
      data,
    })
    revalidatePath("/categories")
    revalidatePath("/products")
    return category
  } catch (error) {
    console.error("Failed to create category:", error)
    throw error
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string
    description: string
  },
): Promise<Category | null> {
  try {
    const category = await db.category.update({
      where: { id },
      data,
    })
    revalidatePath("/categories")
    revalidatePath("/products")
    return category
  } catch (error) {
    console.error(`Failed to update category with id ${id}:`, error)
    return null
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    // Check if category is used by any products
    const productsUsingCategory = await db.product.count({
      where: { categoryId: id },
    })

    if (productsUsingCategory > 0) {
      throw new Error("Category is in use by products and cannot be deleted")
    }

    await db.category.delete({
      where: { id },
    })
    revalidatePath("/categories")
    return true
  } catch (error) {
    console.error(`Failed to delete category with id ${id}:`, error)
    return false
  }
}
