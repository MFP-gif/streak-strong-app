import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { dateKey } from "@/utils/date";
import { toDisplayWeight, fromDisplayWeight } from "@/utils/units";
import type { Measurement, Preferences } from "@/types";

export const MeasurementsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({ units: "kg", language: "en", privateProfile: false, hideSuggested: false, defaultWorkoutVisibility: "private" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [formData, setFormData] = useState({
    date: dateKey(),
    weightKg: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    bodyFat: ''
  });

  useEffect(() => {
    const loadData = () => {
      const measurementsData = JSON.parse(localStorage.getItem('measurements') || '[]');
      const preferencesData = JSON.parse(localStorage.getItem('preferences') || '{}');
      
      setMeasurements(measurementsData.sort((a: Measurement, b: Measurement) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setPreferences({ ...preferences, ...preferencesData });
    };

    loadData();
  }, []);

  const openDialog = (measurement?: Measurement) => {
    if (measurement) {
      setEditingMeasurement(measurement);
      setFormData({
        date: measurement.date,
        weightKg: measurement.weightKg?.toString() || '',
        chest: measurement.chest?.toString() || '',
        waist: measurement.waist?.toString() || '',
        arms: measurement.arms?.toString() || '',
        thighs: measurement.thighs?.toString() || '',
        bodyFat: measurement.bodyFat?.toString() || ''
      });
    } else {
      setEditingMeasurement(null);
      setFormData({
        date: dateKey(),
        weightKg: '',
        chest: '',
        waist: '',
        arms: '',
        thighs: '',
        bodyFat: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.date) {
      toast({ title: "Error", description: "Date is required" });
      return;
    }

    const newMeasurement: Measurement = {
      id: editingMeasurement?.id || `measurement_${Date.now()}`,
      date: formData.date,
      ...(formData.weightKg && { weightKg: parseFloat(formData.weightKg) }),
      ...(formData.chest && { chest: parseFloat(formData.chest) }),
      ...(formData.waist && { waist: parseFloat(formData.waist) }),
      ...(formData.arms && { arms: parseFloat(formData.arms) }),
      ...(formData.thighs && { thighs: parseFloat(formData.thighs) }),
      ...(formData.bodyFat && { bodyFat: parseFloat(formData.bodyFat) })
    };

    let updatedMeasurements;
    if (editingMeasurement) {
      updatedMeasurements = measurements.map(m => 
        m.id === editingMeasurement.id ? newMeasurement : m
      );
    } else {
      updatedMeasurements = [newMeasurement, ...measurements];
    }

    updatedMeasurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setMeasurements(updatedMeasurements);
    localStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
    
    toast({ 
      title: editingMeasurement ? "Measurement updated" : "Measurement added",
      description: "Your measurement has been saved successfully" 
    });
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedMeasurements = measurements.filter(m => m.id !== id);
    setMeasurements(updatedMeasurements);
    localStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
    toast({ title: "Measurement deleted", description: "The measurement has been removed" });
  };

  const formatValue = (value: number | undefined, unit?: string) => {
    if (!value) return '-';
    if (unit) return `${value} ${unit}`;
    return value.toString();
  };

  const displayWeight = (weightKg: number | undefined) => {
    if (!weightKg) return '-';
    const displayed = toDisplayWeight(weightKg, preferences.units);
    const unit = preferences.units === 'kg' ? 'kg' : 'lbs';
    return `${displayed} ${unit}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Measurements</h1>
            <p className="text-muted-foreground">Track your body measurements</p>
          </div>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {measurements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No measurements recorded yet</p>
              <Button onClick={() => openDialog()}>
                <Plus size={16} className="mr-2" />
                Add your first measurement
              </Button>
            </CardContent>
          </Card>
        ) : (
          measurements.map((measurement) => (
            <Card key={measurement.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{new Date(measurement.date).toLocaleDateString()}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openDialog(measurement)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(measurement.id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Weight: </span>
                    <span className="font-medium">{displayWeight(measurement.weightKg)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chest: </span>
                    <span className="font-medium">{formatValue(measurement.chest, 'cm')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Waist: </span>
                    <span className="font-medium">{formatValue(measurement.waist, 'cm')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Arms: </span>
                    <span className="font-medium">{formatValue(measurement.arms, 'cm')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thighs: </span>
                    <span className="font-medium">{formatValue(measurement.thighs, 'cm')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Body Fat: </span>
                    <span className="font-medium">{formatValue(measurement.bodyFat, '%')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMeasurement ? 'Edit Measurement' : 'Add Measurement'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight ({preferences.units === 'kg' ? 'kg' : 'lbs'})</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData(prev => ({ ...prev, weightKg: e.target.value }))}
                placeholder="e.g., 70.5"
              />
            </div>
            <div>
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                value={formData.chest}
                onChange={(e) => setFormData(prev => ({ ...prev, chest: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={formData.waist}
                onChange={(e) => setFormData(prev => ({ ...prev, waist: e.target.value }))}
                placeholder="e.g., 85"
              />
            </div>
            <div>
              <Label htmlFor="arms">Arms (cm)</Label>
              <Input
                id="arms"
                type="number"
                step="0.1"
                value={formData.arms}
                onChange={(e) => setFormData(prev => ({ ...prev, arms: e.target.value }))}
                placeholder="e.g., 35"
              />
            </div>
            <div>
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                type="number"
                step="0.1"
                value={formData.thighs}
                onChange={(e) => setFormData(prev => ({ ...prev, thighs: e.target.value }))}
                placeholder="e.g., 55"
              />
            </div>
            <div>
              <Label htmlFor="bodyFat">Body Fat (%)</Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={formData.bodyFat}
                onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
                placeholder="e.g., 15.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingMeasurement ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};