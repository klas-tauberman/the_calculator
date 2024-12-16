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

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

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
    let totalFlourWeight = 0;
    let totalWaterWeight = 0;

    ingredients.forEach((ingredient) => {
      if (ingredient.id === "flour") {
        totalFlourWeight += ingredient.weight;
      } else if (ingredient.name.toLowerCase().includes("water")) {
        totalWaterWeight += ingredient.weight;
      } else if (ingredient.name.toLowerCase().includes("starter")) {
        // Assume starter is 50% water, 50% flour
        totalFlourWeight += ingredient.weight * 0.5;
        totalWaterWeight += ingredient.weight * 0.5;
      }
    });

    const totalWeight = ingredients.reduce((sum, ingredient) => sum + ingredient.weight, 0);
    const hydration = totalFlourWeight > 0 ? (totalWaterWeight / totalFlourWeight) * 100 : 0;

    return { 
      totalWeight, 
      hydration: Number(hydration.toFixed(1)),
      totalFlourWeight: Number(totalFlourWeight.toFixed(1)),
      totalWaterWeight: Number(totalWaterWeight.toFixed(1))
    };
  };

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
                        <div className="relative">
                          <div className="mb-3">
                            <div className="text-base mb-1">Ingredient name</div>
                            <Input
                              type="text"
                              placeholder="Add name"
                              value={ingredient.name}
                              onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                              className="text-4xl h-auto py-2 px-0 border-none focus-visible:ring-0 font-medium placeholder:text-gray-300"
                            />
                          </div>
                          <div className="border-b border-gray-200 my-3"></div>
                          <div className="grid grid-cols-[1fr,6px,1fr] gap-0 relative">
                            <div>
                              <div className="text-base mb-1">Weight (g)</div>
                              <Input
                                type="number"
                                value={ingredient.weight || "0"}
                                onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                                onFocus={handleFocus}
                                className="text-4xl h-auto py-2 px-0 border-none focus-visible:ring-0 font-medium"
                              />
                            </div>
                            <div className="w-px bg-gray-200 h-full" aria-hidden="true"></div>
                            <div className="pl-1.5">
                              <div className="text-base mb-1">Percentage (%)</div>
                              <Input
                                type="number"
                                value={ingredient.percentage || "0"}
                                onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                                onFocus={handleFocus}
                                className="text-4xl h-auto py-2 px-0 border-none focus-visible:ring-0 font-medium"
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="absolute top-0 right-0 text-gray-400"
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </div>
                      ) : (
                        <div className="py-2">{ingredient.name}</div>
                      )}
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.weight || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                        onFocus={handleFocus}
                      />
                      <Input
                        className="text-base"
                        type="number"
                        value={ingredient.percentage || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                        onFocus={handleFocus}
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

      {/* Mobile View - New Design */}
      <div className="md:hidden min-h-screen bg-[#F1E2C7] pb-32"> {/* Updated background color */}
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center"> {/* Updated logo container size */}
            <Plus className="w-4 h-4 text-white" /> {/* Updated Plus icon size */}
          </div>
          <h1 className="text-xl font-medium">Baker&apos;s percentage calculator</h1> {/* Update 1 */}
        </div>

        <div className="space-y-4"> {/* New wrapper div */}
          {/* Ingredients List */}
          <div className="px-4 space-y-px">
            {ingredients.map((ingredient) => (
              <Card key={ingredient.id} className="p-3 rounded-xl bg-[#F1E2C7] border border-[#F1E2C7]"> {/* Updated background and border color */}
                {ingredient.isCustom ? (
                  <div className="relative">
                    <div className="mb-3">
                      <div className="text-base mb-0.5">Ingredient name</div>
                      <Input
                        type="text"
                        placeholder="Add name"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                        className="text-4xl h-auto py-1.5 px-0 border-none focus-visible:ring-0 font-medium placeholder:text-gray-300"
                      />
                    </div>
                    <div className="border-b border-gray-200 my-3"></div>
                    <div className="grid grid-cols-[1fr,6px,1fr] gap-0 relative">
                      <div>
                        <div className="text-base mb-0.5">Weight (g)</div>
                        <Input
                          type="number"
                          value={ingredient.weight || "0"}
                          onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                          onFocus={handleFocus}
                          className="text-4xl h-auto py-1.5 px-0 border-none focus-visible:ring-0 font-medium"
                        />
                      </div>
                      <div className="w-px bg-gray-200 h-full" aria-hidden="true"></div>
                      <div className="pl-1.5">
                        <div className="text-base mb-0.5">Percentage (%)</div>
                        <Input
                          type="number"
                          value={ingredient.percentage || "0"}
                          onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                          onFocus={handleFocus}
                          className="text-4xl h-auto py-1.5 px-0 border-none focus-visible:ring-0 font-medium"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="absolute top-0 right-0 text-gray-400"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr,6px,1fr] gap-0 relative">
                    <div>
                      <div className="text-base mb-0.5">{ingredient.name} (g)</div>
                      <Input
                        type="number"
                        value={ingredient.weight || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                        onFocus={handleFocus}
                        className="text-4xl h-auto py-1.5 px-0 border-none focus-visible:ring-0 font-medium"
                      />
                    </div>
                    <div className="w-px bg-gray-200 h-full" aria-hidden="true"></div>
                    <div className="pl-1.5">
                      <div className="text-base mb-0.5">Percentage (%)</div>
                      <Input
                        type="number"
                        value={ingredient.percentage || "0"}
                        onChange={(e) => updateIngredient(ingredient.id, "percentage", e.target.value)}
                        onFocus={handleFocus}
                        disabled={ingredient.isBase}
                        className={`text-4xl h-auto py-1.5 px-0 border-none focus-visible:ring-0 ${
                          ingredient.isBase ? "text-gray-400" : "font-medium"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Add Ingredient Button */}
          <div className="px-4">
            <Button
              onClick={addIngredient}
              className="w-full bg-[#F1E2C7] text-black hover:bg-[#E5D6BB] border border-[#F1E2C7] shadow-sm h-14 text-lg font-normal rounded-xl" {/* Updated background color */}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add ingredient
            </Button>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#312C2A] text-white p-4 space-y-1"> {/* Updated background color */}
          <div className="flex justify-between items-center">
            <span className="text-3xl">Total weight</span>
            <span className="text-3xl">{totalWeight.toFixed(0)} g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-3xl">Hydration</span>
            <span className="text-3xl">{hydration}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

