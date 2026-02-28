import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { providersApi, categoriesApi } from '@/lib/api';
import type { Provider, Category, CreateProviderDto, UpdateProviderDto } from '@/lib/types';
import { Loader2, X, Plus } from 'lucide-react';

interface ProviderProfileFormProps {
  provider?: Provider | null;
  onSuccess?: () => void;
}

export function ProviderProfileForm({ provider, onSuccess }: ProviderProfileFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    categoryId: provider?.categoryId || '',
    bio: provider?.bio || '',
    hourlyRate: provider?.hourlyRate || 0,
    yearsExperience: provider?.yearsExperience || 0,
    serviceRadius: provider?.serviceRadius || 10,
    responseTime: provider?.responseTime || '< 2 hours',
  });

  const [skills, setSkills] = useState<string[]>(provider?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  const [certifications, setCertifications] = useState<string[]>(provider?.certifications || []);
  const [newCertification, setNewCertification] = useState('');

  const [portfolio, setPortfolio] = useState<string[]>(provider?.portfolio || []);
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const handleAddPortfolio = () => {
    if (newPortfolioUrl.trim() && !portfolio.includes(newPortfolioUrl.trim())) {
      setPortfolio([...portfolio, newPortfolioUrl.trim()]);
      setNewPortfolioUrl('');
    }
  };

  const handleRemovePortfolio = (url: string) => {
    setPortfolio(portfolio.filter(p => p !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        categoryId: formData.categoryId,
        bio: formData.bio || undefined,
        hourlyRate: formData.hourlyRate,
        skills,
        yearsExperience: formData.yearsExperience,
        serviceRadius: formData.serviceRadius,
        portfolio,
        certifications,
      };

      if (provider) {
        // Update existing profile
        await providersApi.updateProfile(provider.id, data as UpdateProviderDto);
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        await providersApi.createProfile(data as CreateProviderDto);
        toast.success('Profile created successfully!');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div>
        <Label htmlFor="category">Service Category *</Label>
        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">Bio / Description</Label>
        <Textarea
          id="bio"
          placeholder="Tell clients about your experience, specializations, and what makes you unique..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/1000 characters</p>
      </div>

      {/* Hourly Rate & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="yearsExperience">Years of Experience *</Label>
          <Input
            id="yearsExperience"
            type="number"
            min="0"
            value={formData.yearsExperience}
            onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Service Radius & Response Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="serviceRadius">Service Radius (km) *</Label>
          <Input
            id="serviceRadius"
            type="number"
            min="1"
            value={formData.serviceRadius}
            onChange={(e) => setFormData({ ...formData, serviceRadius: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="responseTime">Response Time</Label>
          <Select value={formData.responseTime} onValueChange={(value) => setFormData({ ...formData, responseTime: value })}>
            <SelectTrigger id="responseTime">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="< 1 hour">Less than 1 hour</SelectItem>
              <SelectItem value="< 2 hours">Less than 2 hours</SelectItem>
              <SelectItem value="< 4 hours">Less than 4 hours</SelectItem>
              <SelectItem value="< 24 hours">Less than 24 hours</SelectItem>
              <SelectItem value="1-2 days">1-2 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skills */}
      <div>
        <Label>Skills & Expertise *</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add a skill (e.g., Plumbing, Pipe Fitting)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          />
          <Button type="button" onClick={handleAddSkill} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <Label>Certifications (Optional)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add a certification"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
          />
          <Button type="button" onClick={handleAddCertification} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {certifications.map((cert) => (
            <Badge key={cert} variant="secondary" className="pl-3 pr-1 py-1">
              {cert}
              <button
                type="button"
                onClick={() => handleRemoveCertification(cert)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <Label>Portfolio Images (Optional)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add image URL"
            value={newPortfolioUrl}
            onChange={(e) => setNewPortfolioUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPortfolio())}
          />
          <Button type="button" onClick={handleAddPortfolio} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {portfolio.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {portfolio.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Portfolio ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemovePortfolio(url)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" variant="hero" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          provider ? 'Update Profile' : 'Create Profile'
        )}
      </Button>
    </form>
  );
}

