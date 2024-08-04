

const CookiePolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Cookie Policy</h1>
      <p className="mb-4 dark:text-gray-300">
        This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.
      </p>

      <h2 className="text-xl font-semibold mb-2 dark:text-white">What Are Cookies?</h2>
      <p className="mb-4 dark:text-gray-300">
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to
        make websites work more efficiently, as well as to provide information to the site owners.
      </p>

      <h2 className="text-xl font-semibold mb-2 dark:text-white">How We Use Cookies</h2>
      <p className="mb-4 dark:text-gray-300">
        We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry
        standard options for disabling cookies without completely disabling the functionality and features they add to
        this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in
        case they are used to provide a service that you use.
      </p>

      <h2 className="text-xl font-semibold mb-2 dark:text-white">Types of Cookies We Use</h2>
      <ul className="list-disc list-inside mb-4 dark:text-gray-300">
        <li>
          <strong className="dark:text-white">Essential Cookies</strong>: These cookies are essential for the website to function properly. They
          ensure basic functionalities and security features of the website.
        </li>
        <li>
          <strong className="dark:text-white">Analytics Cookies</strong>: These cookies help us understand how visitors interact with our website.
          They provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.
        </li>
        <li>
          <strong className="dark:text-white">Marketing Cookies</strong>: These cookies are used to deliver personalized advertisements to you. They
          track visitors across websites and collect information to provide customized ads.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 dark:text-white">Managing Your Preferences</h2>
      <p className="dark:text-gray-300">
        You can manage your cookie preferences at any time by clicking the "Manage your preferences" button in the cookie
        notice. You can also adjust your browser settings to block or delete cookies. However, doing so may affect your
        browsing experience and the functionality of this site.
      </p>
    </div>
  );
};

export default CookiePolicy;
