'use client';

import { useUserSession } from '@/auth/useUserSession';
import { UserProfile } from '@/types';
import { getKeysFromObject, toTitleCase } from '@/utils/utils';
import { Formik } from 'formik';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { object, string } from 'yup';

export default function ProfileForm({ profile }: { profile: UserProfile }) {
  const { update } = useUserSession();
  const formFields = { username: profile.username ?? '' };
  const formFieldKeys = getKeysFromObject(formFields);

  const validationSchema = object({
    [formFieldKeys.username]: string()
      .required(`${toTitleCase(formFieldKeys.username)} is required`)
      .matches(/^\S*$/, 'Spaces are not allowed in the username'),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formFields}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await fetch(`/api/users/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: profile.userId,
              ...values,
            }),
          });

          if (res.status !== 200) {
            throw new Error(
              `Profile failed to save: ${res.status} - ${res.statusText}`
            );
          }

          await update();
          toast.success('Profile saved successfully');
        } catch (error) {
          let errorMessage = 'Failed to save profile';

          if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast.error(errorMessage);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor={formFieldKeys.username}></label>
            <input
              type="text"
              name={formFieldKeys.username}
              id={formFieldKeys.username}
              className={`bg-primary-black rounded-md p-2 ${
                errors.username && touched.username
                  ? 'border border-red-600'
                  : ''
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder="Username"
            />
            <span className="text-red-600">
              {errors.username && touched.username ? errors.username : ''}
            </span>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-primary-green px-2 py-1 text-sm font-semibold rounded-md hover:bg-secondary-green disabled:bg-secondary-gray"
            >
              {isSubmitting ? (
                <CgSpinner className="animate-spin w-5 h-5" />
              ) : null}
              Save Profile
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
