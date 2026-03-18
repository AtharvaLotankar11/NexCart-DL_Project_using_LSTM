export default function ScrollReveal({ children, delay = 0, direction = "up" }) {
  // Use Tailwind's built-in transition/opacity for a simple fallback
  // The actual Framer Motion animations will be better once installed
  return (
    <div 
      className="transition-all duration-1000 transform opacity-100 translate-y-0"
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
