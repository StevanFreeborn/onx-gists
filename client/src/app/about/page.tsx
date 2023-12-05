export default function About() {
  return (
    // TODO: Write about page
    <main className="w-full h-full flex flex-col items-center flex-1 p-4 text-primary-white">
      <article className="w-full h-full flex flex-col gap-6 max-w-4xl">
        <section className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Welcome to OnxGists</h1>
          <p>
            Hey there, fellow admin! I'm Stevan, the creator behind OnxGists.
            I'd like to share a little bit about why I created OnxGists and what
            I hope you get out of it.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Onspring Formulas Rock</h2>
          <p>
            I've been writing formulas in Onspring since 2020 and fell in love
            with their ease of use and power immediately. It gives you all the
            power of JavaScript, but in a user-friendly, no-code environment.
            Which means you can write formulas without having to know how to
            code, but if you do have a use case that requires a bit more finesse
            it's no big deal.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Why OnxGists Tho?</h2>
          <p>
            I've always been a fan of GitHub's Gists. They're a great way to
            share code snippets with others. It's the platform I've primarily
            been using to safe keep helpful Onspring formulas to quickly and
            readily share with other admins. But there are a couple drawbacks to
            using Gists for this purpose:
          </p>
          <ul className="flex flex-col gap-2 list-disc ml-4">
            <li>
              Onspring formulas, while basically just JavaScript, do have a few
              specific additional features that make the syntax unique. Things
              like built-in functions, field tokens, and list tokens.
            </li>
            <li>
              Github's Gists contain a lot of other types of code snippets that
              many Onspring admins may not be interested in so using it to try
              and find helpful formulas can be a bit of a chore.
            </li>
          </ul>
          <p>
            So I thought what if there was a place very similar to Gists, but
            specifically for Onspring formulas? And the result is OnxGists!
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">What Can You Do Here?</h2>
          <p>
            OnxGists is a place for Onspring admins to share and discover
            helpful formulas. You can:
          </p>
          <ul className="flex flex-col gap-2 list-disc ml-4">
            <li>
              Browse through the formulas that have already been shared by other
              admins.
            </li>
            <li>Search for formulas by keyword to find something specific.</li>
            <li>
              Share your own formulas with the community by creating a new
              public gist.
            </li>
            <li>
              Keep a library of your own private formulas by creating private
              gists.
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">In Short</h2>
          <p>
            My hope is that OnxGists can be a place for admins to find and share
            useful Onspring formulas and be a helpful resource for the
            community.
          </p>
        </section>
      </article>
    </main>
  );
}
