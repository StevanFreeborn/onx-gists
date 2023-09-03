import HeadingLinkButton from '@/components/HeadingLinkButton';

export default function Privacy() {
  return (
    <main className="flex flex-col items-center flex-1 p-4 text-primary-white">
      <article className="flex flex-col gap-6 w-full max-w-4xl">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Privacy Policy for OnxGists</h1>
          <p>
            At OnxGists, accessible from{' '}
            <a
              className="underline hover:text-primary-orange"
              href="https://onxgists.stevanfreeborn.com"
            >
              https://onxgists.stevanfreeborn.com
            </a>
            , one of our main priorities is the privacy of our visitors. This
            Privacy Policy document contains types of information that is
            collected and recorded by OnxGists and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about
            our Privacy Policy, do not hesitate to contact us.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="log-files">
            <h2 className="text-lg font-bold">Log Files</h2>
          </HeadingLinkButton>
          <p>
            OnxGists follows a standard procedure of using log files. These
            files log visitors when they visit websites. All hosting companies
            do this and a part of hosting services&apos; analytics. The
            information collected by log files include internet protocol (IP)
            addresses, browser type, Internet Service Provider (ISP), date and
            time stamp, referring/exit pages, and possibly the number of clicks.
            These are not linked to any information that is personally
            identifiable. The purpose of the information is for analyzing
            trends, administering the site, tracking users&apos; movement on the
            website, and gathering demographic information. Our Privacy Policy
            was created with the help of the{' '}
            <a
              className="underline hover:text-primary-orange"
              href="https://www.privacypolicyonline.com/privacy-policy-generator/"
            >
              Privacy Policy Generator
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="cookies-and-web-beacons">
            <h2 className="text-lg font-bold">Cookies and Web Beacons</h2>
          </HeadingLinkButton>
          <p>
            Like any other website, OnxGists uses &quot;cookies&quot;. These
            cookies are used to store information including visitors&apos;
            preferences, and the pages on the website that the visitor accessed
            or visited. The information is used to optimize the users&apos;
            experience by customizing our web page content based on
            visitors&apos; browser type and/or other information.
          </p>
          <p>
            For more general information on cookies, please read{' '}
            <a
              className="underline hover:text-primary-orange"
              href="https://www.privacypolicyonline.com/what-are-cookies/"
            >
              the &quot;Cookies&quot; article from the Privacy Policy Generator
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="privacy-policies">
            <h2 className="text-lg font-bold">Privacy Policies</h2>
          </HeadingLinkButton>
          <p>
            You may consult this list to find the Privacy Policy for each of the
            advertising partners of OnxGists.
          </p>
          <p>
            Third-party ad servers or ad networks uses technologies like
            cookies, JavaScript, or Web Beacons that are used in their
            respective advertisements and links that appear on OnxGists, which
            are sent directly to users&apos; browser. They automatically receive
            your IP address when this occurs. These technologies are used to
            measure the effectiveness of their advertising campaigns and/or to
            personalize the advertising content that you see on websites that
            you visit.
          </p>
          <p>
            Note that OnxGists has no access to or control over these cookies
            that are used by third-party advertisers.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="third-party-privacy-policies">
            <h2 className="text-lg font-bold">Third Party Privacy Policies</h2>
          </HeadingLinkButton>
          <p>
            OnxGists&apos;s Privacy Policy does not apply to other advertisers
            or websites. Thus, we are advising you to consult the respective
            Privacy Policies of these third-party ad servers for more detailed
            information. It may include their practices and instructions about
            how to opt-out of certain options.{' '}
          </p>
          <p>
            You can choose to disable cookies through your individual browser
            options. To know more detailed information about cookie management
            with specific web browsers, it can be found at the browsers&apos;
            respective websites. What Are Cookies?
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="childrens-information">
            <h2 className="text-lg font-bold">Children&apos;s Information</h2>
          </HeadingLinkButton>
          <p>
            Another part of our priority is adding protection for children while
            using the internet. We encourage parents and guardians to observe,
            participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            OnxGists does not knowingly collect any Personal Identifiable
            Information from children under the age of 13. If you think that
            your child provided this kind of information on our website, we
            strongly encourage you to contact us immediately and we will do our
            best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="online-privacy-policy">
            <h2 className="text-lg font-bold">Online Privacy Policy Only</h2>
          </HeadingLinkButton>
          <p>
            This Privacy Policy applies only to our online activities and is
            valid for visitors to our website with regards to the information
            that they shared and/or collect in OnxGists. This policy is not
            applicable to any information collected offline or via channels
            other than this website.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <HeadingLinkButton hash="consent">
            <h2 className="text-lg font-bold">Consent</h2>
          </HeadingLinkButton>
          <p>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its Terms and Conditions.
          </p>
        </section>
      </article>
    </main>
  );
}
