import React from 'react';

// Authentic Khmer Lucky Lottery Cover (ឆ្នោតសំណាង)
export const GoldIngotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 70, className = '' }) => {
  return (
    <img
      src="/assets/aistudio/f8a5d8e0-4865-44e6-94ab-7b9f436a53fd_3aa68070.jpg"
      alt="ឆ្នោតសំណាង"
      className={`object-cover rounded shadow-md pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// SVG Zodiac Artwork for each of the 12 Khmer figures
export const AnimalArtwork: React.FC<{ number: number; className?: string }> = ({ number, className = 'w-full h-full' }) => {
  switch (number) {
    case 1:
      // ជូត (Rat) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_56958bf8.png"
          alt="1. ជូត"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 2:
      // ឆ្លូវ (Ox) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_db618d8c.png"
          alt="2. ឆ្លូវ"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 3:
      // ខាល (Tiger) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_f12e60ed.png"
          alt="3. ខាល"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 4:
      // ថោះ (Rabbit) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_da2dada5.png"
          alt="4. ថោះ"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 5:
      // រោង (Dragon) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_d13f2d73.png"
          alt="5. រោង"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 6:
      // ម្សាញ់ (Snake) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_200a760b.png"
          alt="6. ម្សាញ់"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 7:
      // មមី (Horse) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_50856913.png"
          alt="7. មមី"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 8:
      // មមែ (Goat) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_c0557994.png"
          alt="8. មមែ"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 9:
      // វក (Monkey) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_799af351.png"
          alt="9. វក"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 10:
      // រកា (Rooster) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_a48a72a3.png"
          alt="10. រកា"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 11:
      // ច (Dog)
      return (
        <img
          src="/assets/aistudio/image_512554a0.png"
          alt="11. ច"
          className={`${className} object-contain rounded-md`}
        />
      );

    case 12:
      // កុរ (Pig) - User's official card image
      return (
        <img
          src="/assets/aistudio/image_64be13af.png"
          alt="12. កុរ"
          className={`${className} object-contain rounded-md`}
        />
      );

    default:
      return null;
  }
};
