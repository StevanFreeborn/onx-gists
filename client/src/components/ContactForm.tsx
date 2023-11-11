'use client';

import { getKeysFromObject, toTitleCase } from '@/utils/utils';
import emailjs from '@emailjs/browser';
import { Formik } from 'formik';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { object, string } from 'yup';

export default function ContactForm() {
  const formFields = { name: '', email: '', subject: '', message: '' };
  const formFieldKeys = getKeysFromObject(formFields);

  const validationSchema = object({
    [formFieldKeys.name]: string().required(
      `${toTitleCase(formFieldKeys.name)} is required`
    ),
    [formFieldKeys.email]: string()
      .required(`${toTitleCase(formFieldKeys.email)} is required`)
      .email(
        `${toTitleCase(formFieldKeys.email)} should be a valid email address`
      ),
    [formFieldKeys.subject]: string()
      .required(`${toTitleCase(formFieldKeys.subject)} is required`)
      .max(
        150,
        `${toTitleCase(formFieldKeys.subject)} should be 150 characters or less`
      ),
    [formFieldKeys.message]: string()
      .required(`${toTitleCase(formFieldKeys.message)} is required`)
      .max(
        150,
        `${toTitleCase(
          formFieldKeys.message
        )} should be 5000 characters or less`
      ),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formFields}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

        try {
          const res = await emailjs.send(
            serviceId,
            templateId,
            values,
            publicKey
          );

          if (res.status !== 200) {
            throw new Error(
              `Message failed to send: ${res.status} - ${res.text}`
            );
          }

          resetForm({ values: formFields });
          toast.success('Message sent!');
        } catch (error) {
          toast.error('Message failed to send. Please try again');
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
            <label htmlFor={formFieldKeys.name}>
              {toTitleCase(formFieldKeys.name)}
            </label>
            <input
              type="text"
              name={formFieldKeys.name}
              id={formFieldKeys.name}
              className={`bg-primary-black rounded-md p-2 ${
                errors.name && touched.name ? 'border border-red-600' : ''
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              placeholder="Your name"
            />
            <span className="text-red-600">
              {errors.name && touched.name ? errors.name : ''}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={formFieldKeys.email}>
              {toTitleCase(formFieldKeys.email)}
            </label>
            <input
              type="text"
              name={formFieldKeys.email}
              id={formFieldKeys.email}
              className={`bg-primary-black rounded-md p-2 ${
                errors.email && touched.email ? 'border border-red-600' : ''
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder="Your email"
            />
            <span className="text-red-600">
              {errors.email && touched.email ? errors.email : ''}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={formFieldKeys.subject}>
              {toTitleCase(formFieldKeys.subject)}
            </label>
            <input
              type="text"
              name={formFieldKeys.subject}
              id={formFieldKeys.subject}
              className={`bg-primary-black rounded-md p-2 ${
                errors.subject && touched.subject ? 'border border-red-600' : ''
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.subject}
              placeholder="A subject"
            />
            <span className="text-red-600">
              {errors.subject && touched.subject ? errors.subject : ''}
            </span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor={formFieldKeys.message}>
              {toTitleCase(formFieldKeys.message)}
            </label>
            <textarea
              name={formFieldKeys.message}
              id={formFieldKeys.message}
              className={`flex-1 bg-primary-black rounded-md p-2 resize-none ${
                errors.message && touched.message ? 'border border-red-600' : ''
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.message}
              placeholder="Your message"
            />
            <span className="text-red-600">
              {errors.message && touched.message ? errors.message : ''}
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
              Send Message
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
