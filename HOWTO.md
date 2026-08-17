# PickFlick — How To Guide

PickFlick is a movie night picker for your household. It pulls movies from your Jellyfin library, lets everyone nominate and vote, then picks a winner.

---

## Setup

1. **Create profiles** — Go to **Settings** and add a profile for each household member. Pick an emoji avatar, name, and age tier (Kid / Teen / Adult). Optionally set a 4-digit PIN.

2. **Install on your phone** — Open PickFlick in your mobile browser, tap **Share → Add to Home Screen** (iOS) or **Install App** (Android). The app icon will appear on your home screen.

---

## Starting a Movie Night

1. **Open PickFlick** from your home screen or browser.

2. **Select who's watching** — Tap each person joining tonight. Their card highlights in red when selected. Tap **Continue →**.

3. **Pick a genre** — You'll see a deck of genre cards. Tap **🔀 Shuffle & Deal** to shuffle and deal a genre.
   - **🔀 Reshuffle** — Didn't like it? Reshuffle deals a new genre from the same list instantly.
   - **🎲 New Genres** — Want completely different options? This fetches a fresh set from Jellyfin (one reroll per night).

4. **Nominate movies** — Each participant takes a turn picking 1–2 movies from the list.
   - Browse or search the movie grid. Tap a poster to nominate it (gold border = nominated).
   - Tap a nominated movie again or use **✕ Remove** in the nominated list to undo.
   - Tap **Done — Next Person →** when finished. The last person taps **Done — Start Voting →**.

5. **Vote** — Everyone picks their name at the top, then taps movies to vote. You can change your vote by tapping again. Vote counts and voter avatars show in real time.

6. **Reveal the winner** — Tap **Reveal Winner! 🎉**. Confetti, the winning movie poster, and a link to open it in Jellyfin.

---

## Rating Safety

PickFlick automatically filters movies by the most restrictive participant:
- **Kid** → PG and below only
- **Teen** → PG-13 and below
- **Adult** → No restriction

---

## Tips

- Profiles with a PIN show a lock icon. Tap, enter the 4-digit code, and you're in.
- Each person can nominate up to **2 movies** per turn.
- The genre reroll (🎲 New Genres) can only be used **once** per night.
- Reshuffling (🔀) can be done unlimited times.
- Movie posters load through the app's image proxy — they work even on mobile outside your home network.
