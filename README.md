# Admin Dashboard

A comprehensive analytics and management dashboard designed for real-time monitoring of user activity, engagement metrics, and sales performance. This dashboard provides a centralized interface for tracking key business metrics, user engagement patterns, and geographical sales distribution.


> 🌐 **Live Demo**: [admindashboard.vercel.app](https://ui-admin-delta.vercel.app/)

## Overview

This Admin Dashboard offers a complete solution for businesses to monitor their digital presence through an intuitive interface. The system aggregates data across multiple dimensions including user activity, session analytics, engagement rates, acquisition channels, device usage, and geographical sales distribution. It's designed to provide actionable insights through clean, easily digestible visualizations and metrics.


## 🔧 Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Linting:** [ESLint](https://eslint.org/) via `eslint.config.mjs`

## ✅ Suggestions for README Improvement

- Include this folder structure in your `README.md` to help contributors understand the layout.
- Briefly describe the purpose of each main directory and configuration file.
- Optionally, include setup steps and usage examples.

Let me know if you'd like this integrated directly into the existing README file or formatted for presentation.


## Features

**Core Analytics:**

* Total user tracking with active/inactive status monitoring 
* Session duration analytics with average time calculations 
* Real-time engagement rate calculations and trend analysis 
* Interactive user activity graphs with historical comparison
* Comprehensive user acquisition channel breakdown 

**User Insights:**

* Active users tracking with trend visualization
* Historical comparison capabilities for identifying patterns
* User acquisition source attribution (direct, organic search, unassigned)
* Detailed segmentation of traffic sources with percentage breakdowns
* User interaction metrics including engagement rates

**Sales & Geographic Analysis:**

* Country-based sales mapping with visual representations
* Percentage-based geographical distribution analysis
* Top countries ranking by sales volume 
* Regional performance comparison
* Market penetration visualization

**Device & Platform Analytics:**

* Device category breakdown (desktop vs. mobile)
* Cross-platform usage analysis
* Device-specific engagement metrics
* User distribution across device types

**Content Performance:**

* Most viewed pages tracking
* Content engagement analytics
* Page performance metrics
* View count statistics with trend indicators

**Dashboard Functionality:**

* Clean, intuitive user interface with sidebar navigation
* Real-time data updates
* Light/dark mode toggle
* User management section
* Settings and configuration options

## Installation

### Prerequisites

* Node.js (v14.0.0 or higher)
* npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)

### Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/KaoriKunimasu/AdminDashboard.git
cd AdminDashboard
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Start the development server:**

```bash
npm start
# or
yarn start
```

4. **Build for production:**

```bash
npm run build
# or
yarn build
```

## Usage

### Dashboard Navigation

The main dashboard is divided into several sections:

1. **Overview Panel**: Displays summary metrics including total users, active users, session duration, and engagement rate.

2. **User Activity Section**: Shows the active users graph with historical data and trend analysis, displaying fluctuations over time.

3. **User Acquisition Panel**: Breaks down how users are finding your platform with percentage distributions across direct, organic search, and unassigned sources.

4. **Sales Mapping Area**: Visualizes geographical sales distribution with country-specific metrics.

5. **Device Category Section**: Shows the distribution of users by device type (mobile vs. desktop) in a pie chart visualization.

6. **Most Viewed Pages**: Lists top-performing content by view counts, with Dashboard, Products, and Login pages being the most popular.

### Left Sidebar Navigation

The dashboard includes a sidebar with the following options:

* Dashboard (main view)
* User Management
* Change Password
* SEO
* Settings
* Subaccount Users
* Logout

# AdminDashboard – Project Structure Overview

This project uses **Next.js** with the App Router structure, **TypeScript**, and **Tailwind CSS** for styling. 



```
AdminDashboard/
├── app/ # Next.js App Router pages and routes
│ ├── (admin)/ # Admin-specific routes and layouts
│ ├── dashboard/ # Dashboard page route
│ ├── layout.tsx # Root layout for the app
│ └── page.tsx # Root page
├── components/ # Reusable React components
│ ├── analytics/ # Components for analytics panels
│ ├── charts/ # Chart components (e.g., line, pie, bar)
│ ├── core/ # Core layout components (e.g., sidebar)
│ └── shared/ # Shared UI elements
├── lib/ # Utility functions and helpers
│ ├── constants.ts # Global constants
│ └── utils.ts # Reusable utility functions
├── public/ # Static assets (images, icons, etc.)
├── styles/ # Custom styles (if any)
├── components.json # Component mappings or exports
├── eslint.config.mjs # ESLint configuration
├── next.config.ts # Next.js configuration
├── package.json # Project metadata and dependencies
├── postcss.config.mjs # PostCSS config for Tailwind
├── tailwind.config.ts # Tailwind CSS configuration (TypeScript)
├── tsconfig.json # TypeScript compiler options
└── README.md # Project documentation
```

## Performance Features

The dashboard implements several performance optimizations:

* Data visualization with efficient rendering techniques
* Responsive design principles for cross-device compatibility
* Clean component architecture for maintainability
* Intuitive user interface with clear data presentation
* Interactive elements for data exploration

## Contributing

Contributions to the Admin Dashboard are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

* Follow the established code style and naming conventions
* Add appropriate comments for complex logic
* Write unit tests for new features
* Update documentation to reflect changes

## Contact


Project Link: [https://github.com/KaoriKunimasu/AdminDashboard](https://github.com/KaoriKunimasu/AdminDashboard)

## Acknowledgements

* [React](https://reactjs.org/)
* [Material-UI](https://mui.com/)
* [Chart.js](https://www.chartjs.org/)
* [React Router](https://reactrouter.com/)

---

Last Updated: May 2025
