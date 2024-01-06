# OnxGists

A site to save and share useful snippets of Onspring formulas.

## Background

I've been writing formulas in Onspring since 2020 and fell in love with their ease of use and power immediately. It gives you all the power of JavaScript, but in a user-friendly, no-code environment. Which means you can write formulas without having to know how to code, but if you do have a use case that requires a bit more finesse it's no big deal.

I've always been a fan of [GitHub's Gists](https://gist.github.com/). They're a great way to share code snippets with others. It's the platform I've primarily been using to safe keep helpful Onspring formulas to quickly and readily share with other admins. But there are a couple drawbacks to using Gists for this purpose:

- Onspring formulas, while basically just JavaScript, do have a few specific additional features that make the syntax unique. Things like built-in functions, field tokens, and list tokens.
- Github's Gists contain a lot of other types of code snippets that many Onspring admins may not be interested in so using it to try and find helpful formulas can be a bit of a chore.

So I thought what if there was a place very similar to Gists, but specifically for Onspring formulas? And the result is OnxGists!

OnxGists is a place for Onspring admins to share and discover helpful formulas. You can:

- Browse through the formulas that have already been shared by other admins.
- Search for formulas by keyword to find something specific.
- Share your own formulas with the community by creating a new public gist.
- Keep a library of your own private formulas by creating private gists.

My hope is that OnxGists can be a place for admins to find and share useful Onspring formulas and be a helpful resource for the community.

## Technologies Used

### [Next.js](https://nextjs.org/)

Next.js is used for the frontend of the site. It's a React framework that makes it easy to create apps that support both server-side rendering and client-side rendering. It also has a lot of other great features like automatic code splitting, file-system routing, and more.

It also supports serverless functions which in this case are used in conjuction with NextAuth.js to create the API routes for authentication.

### [NextAuth.js](https://next-auth.js.org/)

NextAuth.js is used for the authentication of the site. It's a complete open source authentication solution for Next.js apps. It supports authentication with email/password, social providers, and more. In this case I used it to support authentication with GitHub, Azure AD, and Google.

I also have used the NextAuth hooks and middleware to essentially act as an identity server for the gist service. Essentially the gist service is a protected API that can only be accessed by authenticated users. In the NextAuth middleware I handle the issuing and refreshing of the access tokens for the API. This allows me to use the same authentication for both the frontend and the API.

### [Prisma](https://www.prisma.io/)

Prisma is used in the Next app to connect to the database. It's an open source database toolkit that makes it easy to access and manipulate data in a database. It also has a lot of other great features like migrations, schema management, and more. In this case I used it to connect to the MongoDB database and do a lot of the heavy lifting of the CRUD operations for user management.

### [Tailwind CSS](https://tailwindcss.com/)

Tailwind CSS is used for the styling of the site. It's a utility-first CSS framework that makes it easy to create custom designs without having to write a lot of custom CSS. It also has a lot of other great features like responsive design and dark mode support.

### [MongoDB](https://www.mongodb.com/)

MongoDB is used for the database of the site. It's a NoSQL database that makes it easy to store and retrieve data in JSON-like documents.

### [.NET](https://dotnet.microsoft.com/)

.NET is used for building the API that is the gist service. It's a free, cross-platform, open source developer platform for building many different types of applications. It's used here to create a REST API that can be used to create, read, update, and delete gists. I decided to specifically develop the gist service in .NET because I wanted to learn more about building API's using the newer minimal API approach.

### [CodeMirror](https://codemirror.net/)

CodeMirror is used for the code editor on the site. It's a versatile text editor implemented in JavaScript for the browser. It's used here to provide the syntax highlighting for the formula snippets.

### [Vercel](https://vercel.com/)

Vercel is used for hosting the Next.js frontend of the site. It's a cloud platform for static sites and serverless functions. It's used here to host the frontend of the site and the serverless functions that are used for authentication.

### [Azure](https://azure.microsoft.com/)

Azure is used for hosting the .NET API of the site. It's a cloud computing service created by Microsoft. It's used here to host the gist service API.

### [GitHub Actions](https://github.com/features/actions)

GitHub Actions is used for the CI/CD of the site. It's a CI/CD service created by GitHub. It's used here to automatically build and deploy the site to Vercel and Azure when changes are pushed to the main branch. This allows for a fully automated CI/CD pipeline. When changes are made to either the frontend or the API and pushed to the main branch, GitHub Actions will automatically build and deploy the changes to the appropriate hosting service.

## Issues

If you find any issues with the site please feel free to [create an issue](https://github.com/StevanFreeborn/onx-gists/issues/new) and I'll take a look at it.

## Contributing

If you'd like to contribute to the site please feel free to:

- Fork the repo
- Create a new branch
- Make your changes
- Create a pull request

I'll take a look at it and if the changes make sense and are in line with the goals of the site I'll merge them in.

## License

This project is licensed under the MIT License - see the [LICENSE](License.md) file for details.

## Acknowledgments

- [Onspring](https://www.onspring.com/) - For creating such a great platform to work with.
