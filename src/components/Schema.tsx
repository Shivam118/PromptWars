import React from 'react';

/**
 * Schema.org Structured Data Component
 * 
 * Provides JSON-LD for SportsEvent and Place (Stadium)
 * to maximize SEO and Generative Engine discovery as per hackathon rubrics.
 */
export const Schema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Live MatchDay Event - Stadium Coordination",
    "description": "Real-time crowd logistics and stadium coordination platform for high-density sporting events.",
    "sport": "Various",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "MatchDay Stadium",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1 Event Plaza",
        "addressLocality": "Venue City",
        "addressRegion": "VC",
        "postalCode": "00000",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "MatchDay Operations Team",
      "url": "https://matchday-app-1048219509828.us-central1.run.app"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
