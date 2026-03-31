# Rassal: Simple Presentations

Rassal is a tool for creating simple, auto-sizing presentations from Markdown.

## Getting Started

1.  Clone this repository.
2.  Run `npm install`.
3.  Start the development server with `npm start`.
4.  Edit Markdown files in `md-docs/` and run `npm run convert-docs` to generate HTML slides in `html-docs/`.

## Features

### Slide Grouping

To ensure a consistent look and feel across related slides, you can group them. All slides in the same group will use the smallest optimal font size calculated for any slide in that group.

To group slides manually, add a comment in your Markdown:

```markdown
---
<!-- rsl-group: my-group-name -->
## Slide Title
Slide content...
```

### Auto-Grouping

If you want to quickly separate your presentation into "Initial" (the first slide) and "Main" (all other slides) groups without manual tagging, you can enable auto-grouping by adding a body class at the top of your Markdown file:

```markdown
<!-- body-class: auto auto-grouping -->
# Presentation Title
---
## Second Slide
...
```

With `auto-grouping` enabled:
- The **first slide** is placed in its own group (`rsl-auto-initial`).
- **All subsequent slides** are placed in a shared group (`rsl-auto-main`), ensuring they all have a consistent font size regardless of how much text is on each individual slide.

### Slide Size Guidelines

To maintain readability, follow these guidelines (enforced in `AGENTS.md`):
- Aim for a maximum of 5-6 bullet points per slide.
- Split content into multiple slides using `---` if it becomes too crowded.

## License

ISC
