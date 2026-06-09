import { SOCIAL_LINKS } from '../config/socialLinks';

const socialItems = [
  {
    key: 'twitter',
    href: SOCIAL_LINKS.twitter,
    label: 'Follow on X',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.62 8.62 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9 12.12 12.12 0 01-8.8-4.46 4.28 4.28 0 001.33 5.71 4.2 4.2 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 003.99 2.97A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.19-6.53 12.19-12.19 0-.19-.01-.37-.02-.56A8.72 8.72 0 0024 5.35a8.55 8.55 0 01-2.54.7z" />
      </svg>
    )
  },
  {
    key: 'whatsapp',
    href: SOCIAL_LINKS.whatsappChannel,
    label: 'Join WhatsApp Channel',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.53 14.47c-.26-.13-1.55-.76-1.79-.84-.24-.08-.42-.11-.6.12-.17.22-.65.84-.8 1.01-.15.17-.3.19-.56.07-.26-.12-1.08-.4-2.05-1.28-.76-.68-1.27-1.52-1.42-1.77-.14-.24-.02-.37.11-.49.11-.11.26-.29.39-.43.13-.14.17-.24.26-.4.08-.17.04-.31-.02-.43-.07-.13-.6-1.44-.82-1.97-.22-.52-.45-.45-.62-.46-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.82 1.17 3.02c.14.21 2.02 3.08 4.9 4.32.69.3 1.23.48 1.65.61.69.21 1.32.18 1.82.11.56-.08 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.07-.11-.26-.18-.55-.31z" />
        <path d="M12.04 2C6.49 2 2 6.52 2 12.17c0 2.14.68 4.12 1.85 5.75L2 22l4.26-1.12A10.06 10.06 0 0012.04 22c5.55 0 10.04-4.52 10.04-9.83S17.59 2 12.04 2z" />
      </svg>
    )
  }
];

export function SocialLinkButtons({ ariaLabelPrefix = '' }) {
  return (
    <div className="social-link-grid">
      {socialItems.map(({ key, href, label, icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon-link social-icon-${key}`}
          aria-label={`${ariaLabelPrefix} ${label}`}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
