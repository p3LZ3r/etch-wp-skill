# Automatic.css v4 - Konzepte & Best Practices

> **Diese Referenz erklärt die ACSS-Philosophie und -Konzepte. Für projektspezifische Variablen und Klassen siehe `.etch-acss-index.json` (wird bei Initialisierung generiert).**

---

## Kernphilosophie: Kontext statt Konkret

ACSS verwendet **Assignment Variables** - Variablen, die einen Kontext beschreiben, nicht einen konkreten Wert.

```css
/* ❌ FALSCH: Konkrete Farbe */
background: var(--base-ultra-light);
color: var(--base-ultra-dark);

/* ✅ RICHTIG: Kontextuelle Zuweisung */
background: var(--bg-light);     /* "Heller Hintergrund" */
color: var(--text-dark);         /* "Dunkler Text für helle BGs" */
```

**Warum?** Wenn sich die Farbpalette ändert, passen sich `--bg-light` und `--text-dark` automatisch an. Konkrete Farben bleiben fest.

---

## Variable Hierarchy

### 1. Assignment Variables (Primär)
Für Hintergründe und Text - immer diese verwenden:

```css
/* Hintergründe - von hell nach dunkel */
var(--bg-ultra-light)
var(--bg-light)
var(--body-bg-color)      /* Standard */
var(--bg-dark)
var(--bg-ultra-dark)

/* Text - für entsprechende Hintergründe */
var(--text-light)         /* Für dunkle Hintergründe */
var(--text-dark)          /* Für helle Hintergründe */
var(--text-dark-muted)    /* Sekundärer Text */
var(--heading-color)      /* Überschriften */
```

### 2. Funktionale Variablen (Sekundär)
Für Layout, Abstand, Typografie:

```css
/* Spacing */
var(--space-s) through var(--space-2xl)
var(--section-space-m)    /* Standard-Section-Padding */
var(--gutter)             /* Horizontaler Seitenabstand */

/* Grid */
var(--grid-auto-3)        /* Auto-responsive 3-Spalten */
var(--grid-2-1)           /* 2:1 Ratio */
var(--grid-gap)

/* Typografie */
var(--h1) through var(--h6)
var(--text-m)             /* Basis-Paragraph */
var(--heading-font-family)
```

### 3. Brand Colors (Ausnahmen)
Nur für explizite Brand-Elemente:

```css
var(--primary)            /* CTA-Buttons, Brand-Akzente */
var(--accent)             /* Hervorhebungen */
var(--success)            /* Status-Indikatoren */
```

---

## Automatisch Angewendete Styles

**ACSS wendet diese Styles automatisch an - nie manuell definieren:**

### Container (`data-etch-element="container"`)
```css
/* Diese Styles sind REDUNDANT - ACSS setzt sie automatisch: */
max-width: var(--content-width);
width: 100%;
margin-inline: auto;

/* Nur überschreiben wenn abweichend: */
max-width: var(--width-800);     /* Schmaler */
max-width: none;                  /* Volle Breite */
margin-inline: 0;                 /* Links ausgerichtet */
```

### Section (`data-etch-element="section"`)
```css
/* Automatisch gesetzt: */
padding-block: var(--section-space-m);
padding-inline: var(--gutter);

/* Nur bei Abweichung definieren: */
padding-block: var(--section-space-xl);   /* Mehr Abstand */
padding-block: 0;                          /* Kein Padding */
background: var(--bg-dark);                /* Dunkler Hintergrund */
```

### Text
```css
/* Automatisch: */
/* - Überschriften: var(--heading-color) */
/* - Body-Text: Default-Farbe */

/* Nur bei Abweichung: */
color: var(--text-light);        /* Auf dunklem Hintergrund */
color: var(--text-dark-muted);   /* Sekundärer Text */
```

### Gaps (ACSS 2.6+)
```css
/* Automatisch zwischen: */
/* - Containern in Sections: var(--container-gap) */
/* - Direkten Children von Sections: var(--content-gap) */
/* - Grid-Elementen: var(--grid-gap) */
```

---

## Container Queries

ACSS nutzt moderne Container Queries statt Media Queries:

```css
/* Der Container definiert den Query-Context */
.container {
  container-type: inline-size;
  container-name: card;
}

/* Responsive Styles basierend auf Container-Breite */
@container card (max-width: 400px) {
  .card {
    flex-direction: column;
  }
}
```

**Vorteile:** Komponenten sind unabhängig vom Viewport responsive.

---

## Utility Classes vs Custom CSS

### Utility Classes verwenden für:

| Aufgabe | ACSS Utility | Niemals Custom |
|---------|--------------|----------------|
| Buttons | `btn--primary`, `btn--large` | `.my-button` |
| Grid | `grid--3`, `grid--auto-3` | Custom Grid-CSS |
| Spacing | `space--m`, `pad-section--l` | `padding: 2rem` |
| Flex | `flex--row`, `flex--center` | `display: flex` |
| Visibility | `hide`, `hide-on--m` | Custom Media Queries |

### Custom CSS nur für:
- Komponenten-spezifisches Layout
- Visuelle Details (Borders, Shadows)
- Animationen/Transitions
- Z-Index und Positioning

---

## Modernes CSS mit ACSS

### color-mix() statt Transparenz-Token
```css
/* ✅ ACSS v4: color-mix für Transparenz */
background: color-mix(in oklch, var(--primary) 60%, transparent);
box-shadow: 0 2px 8px color-mix(in oklch, var(--base) 30%, transparent);

/* ❌ Veraltet: Transparenz-Variablen */
background: var(--primary-60);   /* Gibt es nicht mehr */
```

### calc() für Feinabstimmung
```css
/* 10% größer */
padding: calc(var(--space-l) * 1.1);

/* Überlappung erzeugen */
margin-block-start: calc(var(--section-space-m) * -1);
```

---

## Best Practices

1. **Denk in Kontexten** - "Light section with dark text" statt "White background with black text"
2. **Nie Variablen erfinden** - Wenn unsicher, in `.etch-acss-index.json` nachschlagen
3. **Utility Classes bevorzugen** - `btn--primary` statt Custom Button-CSS
4. **Nur Abweichungen definieren** - Wenn ACSS es standardmäßig macht, nicht wiederholen
5. **Assignment > Brand** - `--bg-light` statt `--base-ultra-light`
6. **Container Queries nutzen** - Für komponentenbasierte Responsiveness

---

## Projekt-spezifische Referenz

**Nach `node scripts/init-project.js` verfügbar:**

```bash
# Alle projektspezifischen Variablen
cat .etch-acss-index.json | jq '.variables'

# Verfügbare Utility-Klassen
cat .etch-acss-index.json | jq '.utilityClasses'

# ACSS-Konfigurations-Warnungen
cat .etch-acss-index.json | jq '.config.warnings'
```

---

## Zusammenfassung

| Konzept | Prinzip |
|---------|---------|
| **Assignment Variables** | Kontext beschreiben (`--bg-light`), nicht konkrete Werte (`--white`) |
| **Automatische Styles** | Nie manuell definieren was ACSS automatisch macht |
| **Utility First** | ACSS-Klassen bevorzugen, Custom CSS minimieren |
| **Container Queries** | Komponenten-basierte Responsiveness |
| **Modern CSS** | `color-mix()`, `calc()`, native Features nutzen |

> **Golden Rule:** Nur CSS schreiben, das vom ACSS-Standard abweicht. Wenn das Design dem Standard entspricht, ist kein CSS nötig.
