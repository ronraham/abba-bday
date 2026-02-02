import { useState, FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLogin({ isOpen, onClose }: AdminLoginProps) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(password);

    if (success) {
      setPassword('');
      onClose();
    } else {
      setError('Incorrect password');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin Login" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-gray-700">
          Enter the admin password to view private messages and manage content.
        </p>

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          placeholder="Enter admin password"
        />

        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Modal>
  );
}
