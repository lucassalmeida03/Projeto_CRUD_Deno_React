import { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '../services/userService';
import type { UserPagination } from '../services/userService';
import type { User } from '../types/User';

const PAGE_SIZE = 7;

interface UserError {
  response?: { data?: { message?: string } };
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as UserError).response?.data?.message ?? fallback;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<UserPagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadUsers() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getUsers(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setUsers(result.users);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(
            getErrorMessage(error, 'Não foi possível carregar os usuários.')
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadUsers();
    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  async function removeUser(user: User) {
    if (
      !window.confirm('Você realmente deseja deletar esse usuário do sistema?')
    )
      return;

    setErrorMessage('');
    setDeletingUserId(user._id);

    try {
      await deleteUser(user._id);
      if (users.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        const result = await getUsers(page, PAGE_SIZE);
        setUsers(result.users);
        setPagination(result.pagination);
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Não foi possível remover o usuário.')
      );
    } finally {
      setDeletingUserId(null);
    }
  }

  return {
    users,
    page,
    setPage,
    pagination,
    isLoading,
    deletingUserId,
    errorMessage,
    removeUser,
  };
}
