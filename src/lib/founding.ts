// Founding Member-program: de N första riktiga registreringarna får en badge.
//
// ENKELT ATT JUSTERA/STÄNGA AV:
//  - Sätt FOUNDING_MEMBER_LIMIT till 0 → inga nya tilldelas (befintliga behålls
//    tills du även rensar flaggan i Firestore).
//  - Sätt FOUNDING_BADGE_ENABLED till false → badgen slutar visas överallt,
//    utan att röra datan.
//
// Tilldelning sker server-side i /api/founding/claim (transaktion + räknare i
// meta/stats), så endast riktiga signups räknas — seed-användare går aldrig via
// routen och tar därför inga platser.

export const FOUNDING_MEMBER_LIMIT = 30;
export const FOUNDING_BADGE_ENABLED = true;
