-- Correct only the original sample copy, preserving any subsequent client edits.
UPDATE "faq"
SET "question" = 'Can I book a viewing?',
    "answer" = 'Viewings by appointment basis only, so the bike is ready when you arrive. Call or use the form above to book.'
WHERE "section" = 'contact'
  AND "question" = 'Can I test ride a bike?'
  AND "answer" = 'Yes, by appointment. Bring your licence and your own kit. Call or use the form above to book.';
