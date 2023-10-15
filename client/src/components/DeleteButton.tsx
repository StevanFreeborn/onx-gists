'use client';

import { useAuthClient } from '@/hooks/useAuthClient';
import { useRouter } from '@/hooks/useRouter';
import { gistService } from '@/services/gistService';
import { BsFillTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

export default function DeleteButton({ id }: { id: string }) {
  const { client } = useAuthClient();
  const { deleteGist } = gistService(client);
  const router = useRouter();

  async function handleDeleteButtonClick() {
    var confirmResult = confirm('Are you sure you want to delete this gist?');

    if (confirmResult === false) {
      return;
    }

    const deleteResult = await deleteGist(id);

    if (deleteResult.ok === false) {
      toast.error(deleteResult.error.message);
      return;
    }

    router.back();
    router.refresh();
  }

  return (
    <button
      onClick={handleDeleteButtonClick}
      type="button"
      className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600 hover:bg-red-600 group/delete"
    >
      <BsFillTrashFill className="w-3 h-3 text-red-600 group-hover/delete:text-primary-white" />
      Delete
    </button>
  );
}
