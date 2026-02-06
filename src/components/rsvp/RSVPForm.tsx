import { useState, FormEvent } from 'react';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { useRSVP } from '../../hooks/useRSVP';
import { triggerConfetti } from '../../utils/confetti';
import type { CreateRSVPInput } from '../../types';

interface RSVPFormProps {
  onRSVPAdded?: () => void;
}

export function RSVPForm({ onRSVPAdded }: RSVPFormProps = {}) {
  const { addRSVP, checkNameExists, loading: rsvpLoading } = useRSVP();
  const [formData, setFormData] = useState<CreateRSVPInput>({
    name: '',
    partySize: 1,
    attending: true,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else {
      const exists = await checkNameExists(formData.name.trim());
      if (exists) {
        newErrors.name = 'This name is already registered';
      }
    }

    if (formData.partySize < 1) {
      newErrors.partySize = 'Party size must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setSubmitting(true);
      await addRSVP({
        name: formData.name.trim(),
        partySize: formData.partySize,
        attending: formData.attending,
        notes: formData.notes?.trim() || undefined,
      });

      // Trigger confetti if attending
      if (formData.attending) {
        triggerConfetti();
      }

      // Notify parent to refresh
      if (onRSVPAdded) {
        onRSVPAdded();
      }

      // Reset form
      setFormData({
        name: '',
        partySize: 1,
        attending: true,
        notes: '',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit RSVP' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Your Name | שמך"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="John Doe / יוחנן כהן"
      />

      <div>
        <label className="block text-sm font-bold mb-2 text-dark">
          Will you be attending? | האם תגיע/י? <span className="text-vintage-red">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={formData.attending}
              onChange={() => setFormData({ ...formData, attending: true })}
              className="w-5 h-5 mr-2 accent-vintage-orange"
            />
            <span className="font-medium">Yes, I'll be there!</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={!formData.attending}
              onChange={() => setFormData({ ...formData, attending: false })}
              className="w-5 h-5 mr-2 accent-vintage-orange"
            />
            <span className="font-medium">Sorry, can't make it</span>
          </label>
        </div>
      </div>

      {formData.attending && (
        <Input
          label="Number of Guests | מספר אורחים"
          type="number"
          min="1"
          required
          value={formData.partySize}
          onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
          error={errors.partySize}
        />
      )}

      <Textarea
        label="Additional Notes (optional) | הערות נוספות"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Any special requirements or messages... / כל דרישה או הודעה מיוחדת..."
        rows={3}
      />

      {errors.submit && (
        <div className="p-4 bg-vintage-red/10 border-2 border-vintage-red text-vintage-red rounded">
          {errors.submit}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border-2 border-green-600 text-green-800 rounded">
          Thank you for your RSVP! We can't wait to celebrate with you!
        </div>
      )}

      <Button type="submit" fullWidth disabled={submitting || rsvpLoading}>
        {submitting ? 'Submitting...' : 'Submit RSVP'}
      </Button>
    </form>
  );
}
