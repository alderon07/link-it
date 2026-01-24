# Styling Guide

## Tailwind CSS v4

Utility-first CSS. Theme colors via CSS variables.

```tsx
<div className="flex flex-col gap-4 p-4 bg-card text-foreground">
  <h2 className="text-xl font-bold">Title</h2>
  <p className="text-muted-foreground">Content</p>
</div>
```

## Pixel Art Components

### shadcn/ui Variants

Use pixel art variants on shadcn/ui components:

```tsx
<Button variant="pixel" size="lg">Click Me</Button>
<Card variant="pixel-glow">Content</Card>
<Badge variant="retro">Tag</Badge>
```

### Pixel Art Utilities

CSS classes in `globals.css`:

| Class | Effect |
|-------|--------|
| `.pixel-shadow` | Neobrutalism shadow with hover animation |
| `.pixel-border` | 2px solid border |
| `.pixel-glow` | Glow animation |
| `.pixel-bounce` | Bounce animation |
| `.pixel-shake` | Shake animation |
| `.scanlines` | CRT scanline effect |

### Pixel Art Components

Located in `src/components/pixel-art/`:

- `PixelBorder` - 8-bit style borders with shadow variants
- `PixelIcon` - SVG pixel icons (star, heart, arrow, check)
- `PixelCorner` - Corner decorations
- `PixelDivider` - Horizontal dividers with patterns

## Color Palette

CSS variables for pixel art colors:

```css
--pixel-pink
--pixel-teal
--pixel-yellow
--pixel-mint
--pixel-coral
--pixel-purple
```

## Example Usage

```tsx
// Pixel art styled card with animation
<Card variant="pixel-glow" className="pixel-shadow">
  <CardHeader>
    <PixelIcon icon="star" />
    <span>Title</span>
  </CardHeader>
  <CardContent className="pixel-border">
    Content here
  </CardContent>
</Card>
```
