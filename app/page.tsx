"use client"

import { useState } from "react"
import { Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from 'next/image'

const APP_VERSION = '1.0.2'; // Cache-busting version

interface Ingredient {
  id: string
  name: string
  weight: number
  percentage: number
  isBase?: boolean
  isCustom?: boolean
}

export default function BakersCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "flour", name: "Flour", weight: 1000, percentage: 100, isBase: true },
    { id: "water", name: "Water", weight: 0, percentage: 0 },
    { id: "salt", name: "Salt", weight: 0, percentage: 0 },
    { id: "starter", name: "Sourdough starter", weight: 0, percentage: 0 },
  ])

  const calculateWeightsAndPercentages = (ingredients: Ingredient[]) => {
    const flour = ingredients.find((i) => i.id === "flour")
    if (!flour) return ingredients

    return ingredients.map((ingredient) => {
      if (ingredient.id === "flour") {
        return { ...ingredient, percentage: 100 }
      }
      const weight = (ingredient.percentage / 100) * flour.weight
      return {
        ...ingredient,
        weight: Number(weight.toFixed(1)),
        percentage: Number(ingredient.percentage.toFixed(1)),
      }
    })
  }

  const updateIngredient = (id: string, field: "name" | "weight" | "percentage", value: string) => {
    setIngredients((prev) => {
      const updatedIngredients = prev.map((ingredient) => {
        if (ingredient.id === id) {
          const updatedIngredient = {
            ...ingredient,
            [field]: field === "name" ? value : Number(value) || 0,
          }
          if (field === "weight" && ingredient.id !== "flour") {
            const flour = prev.find((i) => i.id === "flour")
            if (flour) {
              updatedIngredient.percentage = Number(((updatedIngredient.weight / flour.weight) * 100).toFixed(1))
            }
          }
          return updatedIngredient
        }
        return ingredient
      })
      return calculateWeightsAndPercentages(updatedIngredients)
    })
  }

  const addIngredient = () => {
    const newId = `custom-${Date.now()}`
    setIngredients((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        weight: 0,
        percentage: 0,
        isCustom: true,
      },
    ])
  }

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
  }

  const calculateTotals = () => {
    const totalWeight = ingredients.reduce((sum, ingredient) => sum + ingredient.weight, 0)
    const waterContent = ingredients.reduce((sum, ingredient) => {
      if (ingredient.name.toLowerCase().includes("water")) {
        return sum + ingredient.weight
      }
      return sum
    }, 0)
    const flour = ingredients.find((i) => i.id === "flour")
    const hydration = flour ? Number(((waterContent / flour.weight) * 100).toFixed(1)) : 0

    return { totalWeight, hydration }
  }

  const { totalWeight, hydration } = calculateTotals()

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                <Image
                  src="/bakers-logo.svg?v=1"
                  alt="Baker's Calculator Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Baker&apos;s Percentage Calculator</h1>
                <p className="text-muted-foreground">Start easy, go for a hydration around 72%.</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Version: {APP_VERSION}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-8 mb-4">
                  <Label>Ingredient</Label>
                  <Label>Weight (g)</Label>
                  <Label>Percentage (%)</Label>
                  <div className="w-8" />
                </div>
                <div className="space-y-1">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 items-center">
                      {ingredient.isCustom ? (
                        <Input
                          className="text-base"
                          placeholder="0"
                          value={ingredient.name || "0"}
                          onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                        />
                      ) : (
                        <div className="py-2">{ingredient.name}</div>
                      )}
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.weight || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                      />
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.percentage || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                        disabled={ingredient.isBase}
                      />
                      {ingredient.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(ingredient.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {!ingredient.isCustom && <div className="w-8" />}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="ghost" className="text-primary" onClick={addIngredient}>
                <Plus className="mr-2 h-4 w-4" />
                Add ingredient
              </Button>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-[2fr,1fr,1fr] gap-4">
                  <div>Total weight:</div>
                  <div>{totalWeight.toFixed(1)}g</div>
                  <div>Hydration: {hydration}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden m-4">
        <div className="space-y-2">
          <div className="flex items-start gap-4 pt-1">
            <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
              <Image
                src="/bakers-logo.svg?v=1"
                alt="Baker's Calculator Logo"
                width={56}
                height={56}
                className="w-14 h-14"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Baker&apos;s Percentage Calculator</h1>
              <p className="text-muted-foreground">Start easy, go for a hydration around 72%.</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Version: {APP_VERSION}</div>
        </div>
        <div className="space-y-4 mt-8">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="space-y-4">
              {ingredient.isCustom ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium">Added ingredient</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        className="text-base"
                        value={ingredient.name || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (g)</Label>
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.weight || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Percentage (%)</Label>
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.percentage || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="text-muted-foreground hover:text-destructive w-full flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-lg font-medium">{ingredient.name}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight (g)</Label>
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.weight || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Percentage (%)</Label>
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.percentage || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                        disabled={ingredient.isBase}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button variant="ghost" className="text-primary w-full" onClick={addIngredient}>
            <Plus className="mr-2 h-4 w-4" />
            Add ingredient
          </Button>

          <div className="pt-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Total weight:</span>
                <span>{totalWeight.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Hydration:</span>
                <span>{hydration}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

