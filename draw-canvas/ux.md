# Excalidraw UX Diagram Generation Guide

## Overview

This guide explains how to create detailed wireframes and UI diagrams from user prompts. As an AI agent, you'll interpret design requirements and generate a structured `ux.json` file containing Excalidraw elements that represent the user's desired web interface.

## Purpose

The `ux.json` file serves as an intermediate representation between a user's design request and the final HTML/CSS implementation. This file will be processed by another agent that converts the visual design into production-ready Tailwind CSS code.

## User Prompt Interpretation

When processing a user's design request:

1. **Identify key UI components** (navigation, headers, content sections, forms, etc.)
2. **Determine layout structure** (single page, multi-column, card-based, etc.)
3. **Extract design preferences** (color themes, styling, typography, etc.)
4. **Recognize interaction patterns** (navigation flows, form submissions, etc.)
5. **Note responsive design requirements** (mobile, tablet, desktop layouts)

## Excalidraw Element Structure

The `ux.json` file must contain valid Excalidraw elements with these properties:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    // Array of elements representing UI components
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  }
}
```

## Element Types and Properties

### Common Properties

All elements must have:

```json
{
  "id": "unique-id-string",
  "type": "rectangle|text|line|arrow|ellipse",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 50,
  "angle": 0,
  "strokeColor": "#000000",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "groupIds": [],
  "seed": 123456,
  "version": 1,
  "versionNonce": 123456,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1617702641084,
  "link": null
}
```

### Text Elements

For UI text (headings, paragraphs, labels):

```json
{
  "type": "text",
  "text": "Button Text",
  "fontSize": 20,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "middle",
  "baseline": 18
}
```

### Container Elements (Rectangles)

For cards, sections, or containers:

```json
{
  "type": "rectangle",
  "roundness": {
    "type": 3,
    "value": 10
  }
}
```

### Input Fields

Represent form inputs using rectangles with text:

```json
{
  "type": "rectangle",
  "strokeColor": "#ced4da",
  "backgroundColor": "#ffffff",
  "fillStyle": "solid"
}
```

Paired with a text element for placeholder/label:

```json
{
  "type": "text",
  "text": "Email address",
  "fontSize": 16,
  "opacity": 50
}
```

## UI Component Patterns

### Navigation Bar

```json
{
  "type": "rectangle",
  "x": 0,
  "y": 0,
  "width": 1280,
  "height": 64,
  "backgroundColor": "#ffffff",
  "strokeColor": "#e0e0e0"
}
```

### Buttons

```json
{
  "type": "rectangle",
  "width": 120,
  "height": 40,
  "backgroundColor": "#4f46e5",
  "roundness": {
    "type": 3,
    "value": 8
  }
}
```

### Cards

```json
{
  "type": "rectangle",
  "width": 320,
  "height": 240,
  "backgroundColor": "#ffffff",
  "strokeColor": "#e0e0e0",
  "roundness": {
    "type": 3,
    "value": 8
  }
}
```

### Mobile Components

Create mobile-specific components with appropriate dimensions:

```json
{
  "type": "rectangle",
  "width": 375,
  "height": 667,
  "strokeColor": "#000000",
  "backgroundColor": "#ffffff"
}
```

## Layout Guidelines

### Component Positioning

- Position elements with appropriate spacing (8px, 16px, 24px, 32px increments)
- Maintain consistent alignment (left, center, right)
- Group related elements using appropriate nesting

### Screen Sizes

Create designs for standard screen widths:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1280px width

### Grid System

Align elements to a 12-column grid:
- Full width: 1280px (desktop)
- Column width: ~106px with 16px gutters
- Elements should align to column boundaries where possible

## Common UI Patterns

Include these standard patterns when applicable:

### Hero Sections

```json
[
  {
    "type": "rectangle",
    "x": 0,
    "y": 64,
    "width": 1280,
    "height": 600,
    "backgroundColor": "#f8fafc"
  },
  {
    "type": "text",
    "x": 320,
    "y": 240,
    "width": 640,
    "height": 60,
    "text": "Main Headline",
    "fontSize": 48,
    "textAlign": "center"
  }
]
```

### Feature Sections

Three-column layout:

```json
[
  {
    "type": "rectangle",
    "x": 0,
    "y": 700,
    "width": 1280,
    "height": 400
  },
  {
    "type": "rectangle",
    "x": 80,
    "y": 800,
    "width": 340,
    "height": 200
  },
  {
    "type": "rectangle",
    "x": 470,
    "y": 800,
    "width": 340,
    "height": 200
  },
  {
    "type": "rectangle",
    "x": 860,
    "y": 800,
    "width": 340,
    "height": 200
  }
]
```

### Forms

```json
[
  {
    "type": "rectangle",
    "x": 400,
    "y": 300,
    "width": 480,
    "height": 400,
    "backgroundColor": "#ffffff"
  },
  {
    "type": "rectangle",
    "x": 440,
    "y": 380,
    "width": 400,
    "height": 40,
    "backgroundColor": "#f1f5f9"
  }
]
```

## Element Generation Process

Follow these steps to generate the `ux.json` file:

1. **Create the canvas** with appropriate dimensions
2. **Define layout regions** (header, main content, sidebar, footer)
3. **Add container elements** (cards, sections, panels)
4. **Place UI controls** (buttons, inputs, selectors)
5. **Add text elements** for all content and labels
6. **Add visual details** (icons, images, dividers)
7. **Group related elements** to maintain structure
8. **Check for consistency** in spacing, sizing, and alignment

## Special Considerations

### Accessibility Indicators

Use specific stroke colors to indicate accessibility requirements:
- Blue (#1e88e5): Interactive elements
- Green (#43a047): Form elements requiring labels
- Purple (#9c27b0): Elements with keyboard navigation

### Component States

For elements with multiple states, create separate versions:
- Default state
- Hover state
- Focus/active state
- Disabled state

### Interactive Elements

Indicate interactive elements with appropriate visual cues:
- Buttons with distinctive styling
- Links with appropriate color
- Form controls with clear boundaries

## Implementation Workflow

1. **Read and analyze** the user's design prompt
2. **Sketch the main layout** structure
3. **Add core UI elements** based on the requirements
4. **Refine element properties** for visual accuracy
5. **Group related components** to maintain structure
6. **Review for completeness** against the prompt
7. **Generate the final `ux.json` file**

## ux.json Structure Example

Here's a simplified example of a `ux.json` file for a login page:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "id": "page-container",
      "type": "rectangle",
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 800,
      "backgroundColor": "#f8fafc",
      "fillStyle": "solid"
    },
    {
      "id": "login-card",
      "type": "rectangle",
      "x": 440,
      "y": 200,
      "width": 400,
      "height": 400,
      "backgroundColor": "#ffffff",
      "strokeColor": "#e0e0e0",
      "fillStyle": "solid",
      "roundness": {
        "type": 3,
        "value": 8
      }
    },
    {
      "id": "login-header",
      "type": "text",
      "x": 540,
      "y": 240,
      "width": 200,
      "height": 40,
      "text": "Log In",
      "fontSize": 24,
      "fontFamily": 1,
      "textAlign": "center"
    },
    {
      "id": "email-input",
      "type": "rectangle",
      "x": 480,
      "y": 320,
      "width": 320,
      "height": 40,
      "backgroundColor": "#ffffff",
      "strokeColor": "#e0e0e0",
      "fillStyle": "solid"
    },
    {
      "id": "email-label",
      "type": "text",
      "x": 480,
      "y": 300,
      "width": 100,
      "height": 20,
      "text": "Email",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left"
    },
    {
      "id": "password-input",
      "type": "rectangle",
      "x": 480,
      "y": 400,
      "width": 320,
      "height": 40,
      "backgroundColor": "#ffffff",
      "strokeColor": "#e0e0e0",
      "fillStyle": "solid"
    },
    {
      "id": "password-label",
      "type": "text",
      "x": 480,
      "y": 380,
      "width": 100,
      "height": 20,
      "text": "Password",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left"
    },
    {
      "id": "login-button",
      "type": "rectangle",
      "x": 480,
      "y": 480,
      "width": 320,
      "height": 40,
      "backgroundColor": "#4f46e5",
      "strokeColor": "#4f46e5",
      "fillStyle": "solid",
      "roundness": {
        "type": 3,
        "value": 8
      }
    },
    {
      "id": "login-button-text",
      "type": "text",
      "x": 480,
      "y": 480,
      "width": 320,
      "height": 40,
      "text": "Log In",
      "fontSize": 16,
      "fontFamily": 1,
      "textAlign": "center",
      "verticalAlign": "middle",
      "strokeColor": "#ffffff"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  }
}
```

## Common Design Patterns

Include these elements for standard webpage structures:

- **Navigation**: Top bar with logo and menu items
- **Hero**: Full-width section with heading and call-to-action
- **Features**: Multi-column layout with icons and descriptions
- **Testimonials**: Quote blocks with attribution
- **Pricing**: Comparative tables or cards
- **Contact**: Form with input fields and submit button
- **Footer**: Links organized in columns with copyright notice

## Final Checklist

Before generating the final `ux.json`:

1. Does the design accurately represent all user requirements?
2. Are all interactive elements clearly identifiable?
3. Is the layout logical and intuitive?
4. Are text elements properly sized and positioned?
5. Do container elements have appropriate dimensions?
6. Is there consistent spacing between elements?
7. Would the design work across multiple screen sizes?
8. Are all required form fields and controls included?

By following these guidelines, you'll create high-quality `ux.json` files that accurately represent user design prompts and provide a solid foundation for HTML/CSS implementation. 