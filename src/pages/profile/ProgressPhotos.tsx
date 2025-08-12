import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { dateKey } from "@/utils/date";
import type { ProgressPhoto } from "@/types";

export const ProgressPhotos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [formData, setFormData] = useState({
    date: dateKey(),
    caption: '',
    file: null as File | null
  });

  useEffect(() => {
    const loadData = () => {
      const photosData = JSON.parse(localStorage.getItem('photos') || '[]');
      setPhotos(photosData.sort((a: ProgressPhoto, b: ProgressPhoto) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    };

    loadData();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Error", description: "File size must be less than 5MB" });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSave = async () => {
    if (!formData.file || !formData.date) {
      toast({ title: "Error", description: "Please select a photo and date" });
      return;
    }

    try {
      const dataUrl = await compressImage(formData.file);
      
      const newPhoto: ProgressPhoto = {
        id: `photo_${Date.now()}`,
        date: formData.date,
        caption: formData.caption,
        dataUrl
      };

      const updatedPhotos = [newPhoto, ...photos].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setPhotos(updatedPhotos);
      localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      
      toast({ title: "Photo added", description: "Your progress photo has been saved" });
      
      setFormData({ date: dateKey(), caption: '', file: null });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save photo" });
    }
  };

  const handleDelete = (id: string) => {
    const updatedPhotos = photos.filter(p => p.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));
    toast({ title: "Photo deleted", description: "The photo has been removed" });
    setIsViewDialogOpen(false);
  };

  const openPhoto = (photo: ProgressPhoto) => {
    setSelectedPhoto(photo);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Photos</h1>
            <p className="text-muted-foreground">Track your visual progress</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No progress photos yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add your first photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group cursor-pointer" onClick={() => openPhoto(photo)}>
              <img
                src={photo.dataUrl}
                alt={photo.caption || 'Progress photo'}
                className="w-full aspect-square object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
                <div className="p-2 text-white text-xs">
                  <p className="font-medium">{new Date(photo.date).toLocaleDateString()}</p>
                  {photo.caption && <p className="truncate">{photo.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo-date">Date *</Label>
              <Input
                id="photo-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="photo-file">Photo *</Label>
              <Input
                id="photo-file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
            </div>
            <div>
              <Label htmlFor="photo-caption">Caption (optional)</Label>
              <Textarea
                id="photo-caption"
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Add a note about this photo..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Photo Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {selectedPhoto && new Date(selectedPhoto.date).toLocaleDateString()}
              {selectedPhoto && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.caption || 'Progress photo'}
                className="w-full rounded-lg"
              />
              {selectedPhoto.caption && (
                <p className="text-sm text-muted-foreground">{selectedPhoto.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};