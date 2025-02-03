# Draft.js Text Editor

A simple text editor built with [Draft.js](https://draftjs.org/) in a React application using [Yarn](https://yarnpkg.com/) for fast development and bundling.

## Features

- Markdown-like formatting triggers:
  - `#` followed by space → Heading (H1)
  - `*` followed by space → Bold text
  - `**` followed by space → Red-colored text
  - `***` followed by space → Underlined text
- Real-time content editing
- Auto-hide formatting symbols after applying styles
- Save and load content from `localStorage`

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS version)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/rohu0510/draft-text-editor.git
   cd draftjs-editor
   ```

2. **Install dependencies**

   ```sh
   yarn install
   ```

### Running the Project

To start the development server, run:

```sh
yarn dev
```

This will start the Yarn development server, and you can access the application in your browser at:

```
http://localhost:3000
```

### Building for Production

To create an optimized production build, run:

```sh
yarn build
```

The output will be generated in the `dist/` folder.

### Previewing Production Build

To preview the production build locally, run:

```sh
yarn preview
```

### Contributing

If you'd like to contribute, feel free to fork the repository and submit a pull request.

### License

This project is licensed under the MIT License.

---

Happy coding! 🚀

