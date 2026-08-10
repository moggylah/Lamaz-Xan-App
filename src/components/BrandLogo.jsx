export default function BrandLogo({ className = '', variant = 'full' }) {
  return (
    <img
      className={className}
      src={variant === 'mark' ? '/lamaz-xan-logo.png' : '/lamaz-xan-header.png'}
      alt="Lamaz Xan"
      draggable="false"
    />
  );
}
