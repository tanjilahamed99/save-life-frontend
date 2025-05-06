'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/admin/loading-spinner';
import axiosInstance from '@/utils/axios';
import EditCategory from '@/components/admin/categories/edit-category';

export default function EditCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await axiosInstance.get(`/categories/${id}`);
        setLoading(false);

        setCategory(data?.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <EditCategory category={category} />;
}
