"use client"

import { useState } from "react"
import { Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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
        <div className="fixed inset-0 bg-[url('/calculator_bg-2.webp')] bg-cover bg-center bg-no-repeat -z-10" />
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="w-full max-w-xl mx-auto p-8">
            <div className="bg-[#F1E2C7] rounded-3xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-5 pb-5 flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-medium">Baker&apos;s percentage calculator</h1>
              </div>

              {/* Ingredients List */}
              <div className="px-6 pb-5 space-y-[1px]">
                {ingredients.map((ingredient) => (
                  <Card key={ingredient.id} className="p-0 rounded-xl bg-white border-0">
                    {ingredient.isCustom ? (
                      <div className="flex gap-2">
                        <div className="flex-1 p-3">
                          <div>
                            <div className="mb-3">
                              <div className="text-base mb-0.5">Ingredient name</div>
                              <Input
                                type="text"
                                placeholder="Add name"
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                                className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium placeholder:text-gray-300"
                              />
                            </div>
                            <div className="border-b border-gray-200 my-3"></div>
                            <div className="grid grid-cols-[1fr,6px,1fr] gap-0">
                              <div>
                                <div className="text-base mb-0.5">Weight (g)</div>
                                <Input
                                  type="number"
                                  value={ingredient.weight || "0"}
                                  onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                                  onFocus={handleFocus}
                                  className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
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
                                  className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-12 bg-white rounded-xl flex items-stretch">
                          <Button
                            variant="ghost"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="w-full h-full rounded-xl hover:bg-transparent p-1"
                          >
                            <Trash2 className="h-[26px] w-[26px] text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-[1fr,6px,1fr] gap-0 relative p-3">
                        <div>
                          <div className="text-base mb-0.5">{ingredient.name} (g)</div>
                          <Input
                            type="number"
                            value={ingredient.weight || "0"}
                            onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                            onFocus={handleFocus}
                            className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
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
                            className={`text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 ${
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
              <div className="px-6 pb-5">
                <Button
                  onClick={addIngredient}
                  className="w-full bg-white text-black hover:bg-gray-100 border-0 shadow-sm h-14 text-lg font-normal rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add ingredient
                </Button>
              </div>

              {/* Footer Totals */}
              <div className="bg-[#312C2A] text-white px-6 pt-5 pb-5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[26px]">Total weight</span>
                  <span className="text-[26px]">{totalWeight.toFixed(0)} g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[26px]">Hydration</span>
                  <span className="text-[26px]">{hydration}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden min-h-screen bg-[#F1E2C7] pb-32">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-medium">Baker&apos;s percentage calculator</h1>
        </div>

        <div className="space-y-4">
          {/* Ingredients List */}
          <div className="px-4 space-y-0">
            {ingredients.map((ingredient) => (
              <Card key={ingredient.id} className="p-3 rounded-xl bg-white border border-[#F1E2C7]">
                {ingredient.isCustom ? (
                  <div className="flex gap-2">
                    <div className="flex-1 p-3">
                      <div>
                        <div className="mb-3">
                          <div className="text-base mb-0.5">Ingredient name</div>
                          <Input
                            type="text"
                            placeholder="Add name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                            className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium placeholder:text-gray-300"
                          />
                        </div>
                        <div className="border-b border-gray-200 my-3"></div>
                        <div className="grid grid-cols-[1fr,6px,1fr] gap-0">
                          <div>
                            <div className="text-base mb-0.5">Weight (g)</div>
                            <Input
                              type="number"
                              value={ingredient.weight || "0"}
                              onChange={(e) => updateIngredient(ingredient.id, "weight", e.target.value)}
                              onFocus={handleFocus}
                              className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
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
                              className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 bg-white rounded-xl flex items-stretch">
                      <Button
                        variant="ghost"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="w-full h-full rounded-xl hover:bg-transparent p-1"
                      >
                        <Trash2 className="h-[26px] w-[26px] text-gray-400" />
                      </Button>
                    </div>
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
                        className="text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 font-medium"
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
                        className={`text-4xl h-auto py-0.5 px-0 border-none focus-visible:ring-0 ${
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
              className="w-full bg-white text-black hover:bg-gray-100 border-0 shadow-sm h-14 text-lg font-normal rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add ingredient
            </Button>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#312C2A] text-white px-4 py-10 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[26px]">Total weight</span>
            <span className="text-[26px]">{totalWeight.toFixed(0)} g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[26px]">Hydration</span>
            <span className="text-[26px]">{hydration}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

