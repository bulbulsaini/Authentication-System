// Shared design tokens for the authentication flow (Login, Signup, Forgot/Reset Password).
// Centralizing these means changing one value here updates every auth screen.

export const theme = {
  color: {
    plum: "#2D1B3D",        // deep anchor — used in headings, panel overlay
    plumSoft: "#4A3158",    // lighter plum for secondary text on dark panel
    paper: "#FBF9F6",       // warm white — form panel background
    sand: "#E8DFD3",        // borders, dividers, input backgrounds
    sandDeep: "#D9CCBA",    // hover/active border
    terracotta: "#C9683D",  // primary accent — buttons, links, focus ring
    terracottaDeep: "#A8512E",
    charcoal: "#1F1B24",    // primary text
    charcoalSoft: "#6B6470", // secondary text / placeholders
    error: "#B3432F",
    errorBg: "#F8E9E4",
    success: "#3D6B4A",
  },
  font: {
    display: "'Fraunces', 'Iowan Old Style', 'Georgia', serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
  },
};

// Google Fonts import — add once in your index.html <head>, or via this string in a <style> tag:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">