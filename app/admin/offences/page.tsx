"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { getOffencesBySchool, createOffence, updateOffence, deleteOffence } from "@/lib/firestore"
import type { Offence } from "@/lib/models"

export default function OffencesManagement() {
  const { user } = useAuth()
  const [offences, setOffences] = useState<Offence[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingOffence, setEditingOffence] = useState<Offence | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsToDeduct: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.schoolId) {
      loadOffences()
    }
  }, [user?.schoolId])

  const loadOffences = async () => {
    if (!user?.schoolId) return

    try {
      setLoading(true)
      const data = await getOffencesBySchool(user.schoolId)
      setOffences(data)
    } catch (error) {
      console.error("Failed to load offences:", error)
      toast({
        title: "Error",
        description: "Failed to load offences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pointsToDeduct: "",
    })
    setEditingOffence(null)
  }

  const handleAdd = () => {
    resetForm()
    setShowAddDialog(true)
  }

  const handleEdit = (offence: Offence) => {
    setFormData({
      name: offence.name,
      description: offence.description,
      pointsToDeduct: offence.pointsToDeduct.toString(),
    })
    setEditingOffence(offence)
    setShowEditDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.schoolId) return

    const points = parseInt(formData.pointsToDeduct)
    if (isNaN(points) || points < 1 || points > 100) {
      toast({
        title: "Invalid Points",
        description: "Points to deduct must be between 1 and 100.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      if (editingOffence) {
        // Update existing offence
        await updateOffence(editingOffence.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          pointsToDeduct: points,
        })
        toast({
          title: "Success",
          description: "Offence updated successfully.",
        })
        setShowEditDialog(false)
      } else {
        // Create new offence
        await createOffence({
          schoolId: user.schoolId,
          name: formData.name.trim(),
          description: formData.description.trim(),
          pointsToDeduct: points,
        })
        toast({
          title: "Success",
          description: "Offence created successfully.",
        })
        setShowAddDialog(false)
      }

      resetForm()
      await loadOffences()
    } catch (error) {
      console.error("Failed to save offence:", error)
      toast({
        title: "Error",
        description: "Failed to save offence. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (offence: Offence) => {
    try {
      await deleteOffence(offence.id)
      toast({
        title: "Success",
        description: "Offence deleted successfully.",
      })
      await loadOffences()
    } catch (error) {
      console.error("Failed to delete offence:", error)
      toast({
        title: "Error",
        description: "Failed to delete offence. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (points: number) => {
    if (points >= 15) return "destructive"
    if (points >= 8) return "default"
    return "secondary"
  }

  const getSeverityLabel = (points: number) => {
    if (points >= 15) return "High"
    if (points >= 8) return "Medium"
    return "Low"
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Offence Management</h1>
              <p className="text-muted-foreground">Configure discipline offences and point deductions</p>
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Offence
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>School Offences</CardTitle>
            <CardDescription>
              Manage the types of offences that can be issued to students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : offences.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Offences Configured</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first offence type to start managing student discipline.
                </p>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Offence
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offence Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Points Deducted</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offences.map((offence) => (
                    <TableRow key={offence.id}>
                      <TableCell className="font-medium">{offence.name}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={offence.description}>
                          {offence.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-red-600">
                          -{offence.pointsToDeduct}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(offence.pointsToDeduct)}>
                          {getSeverityLabel(offence.pointsToDeduct)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(offence)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Offence</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{offence.name}"? This action cannot be undone.
                                  Existing discipline records will not be affected.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(offence)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Offence Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Offence</DialogTitle>
              <DialogDescription>
                Create a new offence type that teachers can issue to students.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Offence Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Late to Class"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe when this offence should be applied..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="points">Points to Deduct</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.pointsToDeduct}
                    onChange={(e) => setFormData(prev => ({ ...prev, pointsToDeduct: e.target.value }))}
                    placeholder="5"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Students start with 100 discipline points. Enter 1-100.
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Offence"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Offence Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Offence</DialogTitle>
              <DialogDescription>
                Update the offence details. Changes will apply to future discipline records only.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Offence Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Late to Class"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe when this offence should be applied..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-points">Points to Deduct</Label>
                  <Input
                    id="edit-points"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.pointsToDeduct}
                    onChange={(e) => setFormData(prev => ({ ...prev, pointsToDeduct: e.target.value }))}
                    placeholder="5"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Students start with 100 discipline points. Enter 1-100.
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Offence"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
