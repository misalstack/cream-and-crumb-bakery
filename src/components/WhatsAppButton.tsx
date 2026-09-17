import { whatsappLink } from "@/lib/bakery-info";

export function WhatsAppButton() {
  // The glyph is dark rather than white: white on WhatsApp green is only
  // 1.98:1, under the 3:1 minimum for a meaningful icon. The brand green stays.
  return (
    <a
      href={whatsappLink("Hello Crème & Crumb! I'd like to ask about an order.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Crème & Crumb on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#0a2e1f] shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.34.65 4.53 1.78 6.4L4 29l7.76-1.73a12.9 12.9 0 0 0 4.26.73c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.8c-1.4 0-2.77-.31-4-.9l-.29-.15-4.6 1.02 1.05-4.48-.18-.3a9.7 9.7 0 0 1-1.5-5.17c0-5.4 4.4-9.8 9.8-9.8 5.4 0 9.8 4.4 9.8 9.8-.02 5.4-4.42 9.98-9.82 9.98Zm5.4-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
