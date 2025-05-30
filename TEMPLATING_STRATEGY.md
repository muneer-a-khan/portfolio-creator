# Basic Templating Strategy

## Initial Approach
Use simple HTML string templates embedded within the portfolio generation logic.

## Template Function
Each template will be a function accepting `PortfolioData` and returning an HTML string.

## Styling
Primarily TailwindCSS. Template-specific global styles via `<style>` tags or linked CSS if complex.

## First Template
Start with a `DefaultStandardTemplate`.

## Selection Logic
Generator selects template based on `PortfolioData.theme.id` and `PortfolioData.layout.id`.

## Future
Consider separate `.html` files and engines like Handlebars/EJS for future needs.
