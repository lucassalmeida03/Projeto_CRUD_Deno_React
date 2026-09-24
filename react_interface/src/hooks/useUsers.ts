import { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '../services/userService';
import type { User } from '../types/User';

interface UserError {
  response?: { data?: { message?: string } };
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as UserError).response?.data?.message ?? fallback;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        setUsers(await getUsers());
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, 'Não foi possível carregar os usuários.')
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  async function removeUser(user: User) {
    if (
      !window.confirm('Você realmente deseja deletar esse usuário do sistema?')
    )
      return;

    setErrorMessage('');
    setDeletingUserId(user._id);

    try {
      await deleteUser(user._id);
      setUsers((current) =>
        current.filter((currentUser) => currentUser._id !== user._id)
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Não foi possível remover o usuário.')
      );
    } finally {
      setDeletingUserId(null);
    }
  }

  return { users, isLoading, deletingUserId, errorMessage, removeUser };
}
