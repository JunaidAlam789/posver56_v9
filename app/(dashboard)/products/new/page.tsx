import { getCategories } from "@/lib/data/actions"
import { ProductForm } from "../components/product-form"

export const metadata = {
  title: "Add New Product",
  description: "Add a new product to your inventory",
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
