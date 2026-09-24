import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSchema } from '../schemas/userSchema';
import { createUser } from '../services/userService';
import type { UserRole } from '../types/UserRole';

export function useSignUp() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    const result = createUserSchema.safeParse({
      name,
      email,
      password,
      role: selectedRole,
    });

    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ?? 'Verifique os dados informados.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await createUser(result.data);
      navigate('/signIn');
    } catch {
      setErrorMessage(
        'Não foi possível criar a conta. Verifique os dados e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    selectedRole,
    setSelectedRole,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleSubmit,
  };
}
