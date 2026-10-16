# Francis Enterina Portfolio

The personal portfolio of **Francis Ronald Borja Enterina**, an Information
Systems graduate and software developer based in Iligan City, Philippines.
The site presents Francis's experience in software development, product work,
marketing, and digital operations.

Live site: [francisenterina.work](https://francisenterina.work)

## Built with

- [Astro](https://astro.build/) 7
- TypeScript
- Semantic HTML and custom CSS
- Native browser APIs for navigation, dialogs, animations, and form
  submission
- [Formspree](https://formspree.io/) for the contact form

The project is a static Astro site. It has no client-side framework or
server-side application dependency.

## Site content

The home page (`/`) is composed of the following sections:

- **Hero** - introduction, primary calls to action, and brand imagery
- **About** - Francis's background and career direction
- **Experience** - work history, education, recognition, and leadership
- **Skills** - working practices, a categorized tools directory, and
  certificates
- **Projects** - selected work, currently featuring the Red Carpet case study
- **Contact** - email, social links, Formspree contact form, and location

The Red Carpet project is also available as a dedicated page at
[`/projects/red-carpet`](https://francisenterina.work/projects/red-carpet).
It documents a multi-role wedding planning marketplace and admin dashboard
built with React Native, TypeScript, and Supabase.

## Interactions and accessibility

- Responsive navigation with a mobile menu and active-section tracking
- Smooth anchor navigation, with reduced-motion support
- Project and certificate dialogs with keyboard support and focus handling
- Scroll locking while dialogs are open
- Interactive tool chips that open and highlight the selected tool
- Native form validation and asynchronous Formspree submission states
- Semantic landmarks, labels, alternative text, focus-visible styles, and
  `aria-live` status messages

## Project structure

```text
/
├── public/
│   ├── Projects/             # Project imagery
│   ├── additionalCertificates/
│   ├── certificates/
│   ├── documents/            # Downloadable CV
│   └── images/               # Logos, portraits, and education imagery
├── src/
│   ├── components/           # Page sections and reusable Astro components
│   ├── data/tools.ts         # Categorized tools shown in the tools dialog
│   ├── i18n/en.ts            # Site copy, metadata, links, and credentials
│   ├── pages/
│   │   ├── index.astro      # Home page
│   │   └── projects/
│   │       └── red-carpet.astro
│   └── styles/global.css     # Shared layout, responsive, and component styles
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Updating content

Most portfolio copy is centralized in
[`src/i18n/en.ts`](./src/i18n/en.ts). Update that file for:

- Metadata and page title
- Navigation and hero copy
- About, experience, education, and recognition content
- Project cards
- Skills, certificates, and credential links
- Contact details, social links, and form messages
- Footer content

Update [`src/data/tools.ts`](./src/data/tools.ts) when adding or removing
tools. Each tool has a name, short badge label, color, and category.

Place new static files in `public/` and reference them with a root-relative
URL, such as `/images/example.png`. The CV is available from the navigation
at `/documents/ENTERINA_CV_PROF.pdf`.

The contact form endpoint is configured in `en.contact.form.endpoint`. Keep
that value aligned with the intended Formspree form before deploying.

## Getting started

### Requirements

- Node.js `>=22.12.0`
- npm

### Install dependencies

```sh
npm install
```

### Run the development server

```sh
npm run dev
```

Astro serves the site at `http://localhost:4321` by default.

### Build for production

```sh
npm run build
```

The production output is generated in `dist/`.

### Preview the production build

```sh
npm run preview
```

### Run Astro CLI commands

```sh
npm run astro -- --help
```

## Deployment

The canonical site URL is configured in
[`astro.config.mjs`](./astro.config.mjs) as
`https://francisenterina.work`. Build the project with `npm run build` and
deploy the generated `dist/` directory to a static host.
