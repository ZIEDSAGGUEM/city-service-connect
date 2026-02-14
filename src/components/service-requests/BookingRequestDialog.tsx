import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, DollarSign, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { serviceRequestsApi } from '@/lib/api';
import type { Provider } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface BookingRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider;
}

export function BookingRequestDialog({ isOpen, onClose, provider }: BookingRequestDialogProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    preferredDate: '',
    preferredTime: '',
    estimatedBudget: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.preferredDate || !formData.preferredTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.description.length < 20) {
      toast.error('Description must be at least 20 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const request = await serviceRequestsApi.create({
        providerId: provider.id,
        categoryId: provider.categoryId,
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined,
      });

      toast.success('Service request sent!', {
        description: `${provider.user?.name} will review your request soon.`,
      });

      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        preferredDate: '',
        preferredTime: '',
        estimatedBudget: '',
      });

      // Navigate to client dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to create service request:', error);
      toast.error('Failed to send request', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Service from {provider.user?.name}</DialogTitle>
          <DialogDescription>
            Fill out the form below to request {provider.category?.name} services
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Service Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Fix leaking kitchen sink"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Provide a brief, clear title for the service you need
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the work you need done in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/1000 characters (minimum 20 required)
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Service Location
            </Label>
            <Input
              id="location"
              placeholder="Enter service address (optional)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use your account location
            </p>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                required
                min={getTomorrowDate()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="preferredTime"
                type="time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Estimated Budget */}
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Estimated Budget (Optional)
            </Label>
            <Input
              id="estimatedBudget"
              type="number"
              placeholder="Enter your budget"
              value={formData.estimatedBudget}
              onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
              min="0"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Provider's hourly rate: ${provider.hourlyRate}/hr
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

