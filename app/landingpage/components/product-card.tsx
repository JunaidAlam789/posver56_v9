"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useLandingCart } from "@/lib/context/landing-cart-context"
import type { Product } from "@/lib/data/schema"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useLandingCart()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addItem(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/landingpage/products/${product.id}`} className="block">
        <div
          className="relative aspect-square overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.stock <= 10 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Low Stock
            </Badge>
          )}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button size="sm" variant="secondary">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/landingpage/products/${product.id}`} className="block">
          <div className="text-sm text-muted-foreground mb-1">{product.category?.name || "Uncategorized"}</div>
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <p className="text-primary font-bold mt-1">{formatCurrency(Number(product.price))}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
