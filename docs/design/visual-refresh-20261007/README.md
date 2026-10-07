# MelonCactus visual refresh — 7 October 2026

This review package records the visual baseline and the refreshed design. The
before images were captured from `meloncactus.com` before implementation. The
after images were captured from a clean local production build of the review
branch. All images are full-page browser captures.

## Design direction

The refresh retains the MelonCactus wordmark, warm paper background and restrained
industrial character. It gives the site a clearer editorial hierarchy, more
consistent spacing and a stronger path from evidence to service selection and
contact. It deliberately avoids dashboard styling, decorative stock imagery and
unsubstantiated trust signals.

- Source Serif 4 gives headings and report-style accents a sober editorial voice.
- Source Sans 3 is used for body copy, navigation, forms, buttons, tables and
  findings, where legibility and density matter most.
- Primary actions use the dark-green surface; secondary actions remain outlined
  or underlined and visually subordinate.
- The report extract, service cards and contact form now share one border,
  spacing and label system.
- Mobile layouts preserve the reading order, use full-width actions where useful
  and limit automatic word breaking to headings with genuinely long compounds.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f4f2e9` | Page background |
| `--surface` | `#fbfaf6` | Cards and form surfaces |
| `--paper-deep` | `#e8e5d8` | Quiet separation and report depth |
| `--ink` | `#18201d` | Primary text |
| `--muted` | `#59635d` | Secondary text |
| `--line` | `#cbcfc6` | Decorative dividers |
| `--primary` | `#173d2d` | Primary actions and dark sections |
| `--primary-hover` | `#275a45` | Hover and supporting green |
| `--primary-soft` | `#dce5dc` | Evidence and decision highlights |
| `--accent-warm` | `#8f4938` | Focus, warning and uncertainty accent |
| `--accent-yellow` | `#d8c95d` | Labels on dark-green surfaces |

Spacing uses a fluid section token from 64 to 96 px, a 1180 px content container
and readable text measures of 68–78 characters. Main body text is 17 px on small
screens and 18 px on larger screens. Display headings use fluid scales: H1 is
40–68 px, H2 is 32–42 px and H3 is 22–26 px. Form controls are at least 48 px
high.

## Typography and licence

`next/font` downloads Source Sans 3 and Source Serif 4 during the build and serves
the resulting WOFF2 files from the application's own `/_next/static/media/`
path. There is no runtime request to Google Fonts. Only the Latin variable fonts
are preloaded; `font-synthesis: none` prevents synthetic weights or styles.

Both families are released under the SIL Open Font License 1.1. The repository
includes the licence and copyright notices in
`licenses/SOURCE_FONTS_OFL-1.1.txt`.

## Contrast checks

| Pair | Ratio | Result |
| --- | ---: | --- |
| Ink on paper | 14.82:1 | AAA |
| Muted text on paper | 5.56:1 | AA |
| Surface text on primary | 11.54:1 | AAA |
| Yellow accent on primary | 7.14:1 | AAA |
| Primary on surface | 11.54:1 | AAA |
| Warm accent on surface | 6.33:1 | AA |
| Placeholder on white | 5.05:1 | AA |
| Input border on white | 3.02:1 | Passes non-text contrast |
| Error text on error surface | 6.98:1 | AA |

The visible keyboard focus indicator is warm brown with a light two-pixel halo.
The first Tab stop is the skip link and Enter moves the URL to `#main-content`.

## Screenshots

### Homepage

| Before | After |
| --- | --- |
| [Desktop](before/home-desktop-1440x900.jpg) | [Desktop](after/home-desktop-1440x900.jpg) |
| [Mobile](before/home-mobile-390x844.jpg) | [Mobile](after/home-mobile-390x844.jpg) |

### Services

| Before | After |
| --- | --- |
| [Desktop](before/services-desktop-1440x900.jpg) | [Desktop](after/services-desktop-1440x900.jpg) |
| [Mobile](before/services-mobile-390x844.jpg) | [Mobile](after/services-mobile-390x844.jpg) |

### Contact

| Before | After |
| --- | --- |
| [Desktop](before/contact-desktop-1440x900.jpg) | [Desktop](after/contact-desktop-1440x900.jpg) |
| [Mobile](before/contact-mobile-390x844.jpg) | [Mobile](after/contact-mobile-390x844.jpg) |

## Browser review

Eighteen representative English and Dutch routes were checked at 320, 375, 390,
768, 1024 and 1440 px (108 route/viewport checks). A separate 720 px-wide reflow
pass represents a 1440 px desktop viewport at 200% zoom. The checks found no
horizontal overflow, clipped H1, language mismatch, heading-level skip or lost
contact-form preselection.

The review also covered active desktop and mobile navigation, the open mobile
menu, EN/NL contact forms, labels, control heights, Standard delivery defaults,
report preselection, polite status regions, loaded font families and browser
console output. No contact form was submitted.
