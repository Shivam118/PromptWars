<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Architecture (MatchDay)
MatchDay is an internal event coordination application designed for high-density environments like sports stadiums.

## Key Instructions for Agents:
1. **Design Guidelines**: Use a premium aesthetic design strictly with Dark Mode support (Tailwind classes). No flashy graphics, only minimalistic micro-animations (e.g. pulse, glow, translation on hover).
2. **State Management**: Using LocalStorage mock layer `src/store/EventContext.tsx` via React Context while backend goes under construction.
3. **Data Schema (JSON-LD)**: Assume the application requires Schema.org `Event` and `SportsEvent` objects for event specifics if public endpoints are added.
