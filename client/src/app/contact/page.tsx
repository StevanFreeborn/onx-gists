import ContactForm from '@/components/ContactForm';

export default function Contact() {
  return (
    <main className="w-full h-full flex flex-col items-center flex-1 p-4 text-primary-white">
      <div className="w-full h-full flex flex-col gap-6 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-1">
            Got questions about the site? Something not working right? Wanna
            just talk formulas? Send it our way.
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
