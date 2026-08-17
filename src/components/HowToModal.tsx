"use client";

interface HowToModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HowToModal({ open, onClose }: HowToModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative glass-panel-heavy max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
        >
          ✕
        </button>

        <h2 className="font-display text-2xl font-bold text-white mb-6">
          How To Use PickFlick
        </h2>

        <div className="space-y-5 text-sm text-white/70 leading-relaxed">
          <Step num={1} title="Create Profiles">
            Go to <strong className="text-white">Settings</strong> and add a
            profile for each household member. Pick an emoji, name, and age
            tier (Kid / Teen / Adult). Optionally set a 4-digit PIN.
          </Step>

          <Step num={2} title="Start a Movie Night">
            Open PickFlick and tap each person joining tonight. Their card
            highlights when selected. Tap <strong className="text-white">Continue</strong>.
          </Step>

          <Step num={3} title="Shuffle a Genre">
            Tap <strong className="text-white">Shuffle &amp; Deal</strong> to
            deal a genre card. Don&apos;t like it? Hit{" "}
            <strong className="text-white">Reshuffle</strong> to deal another
            from the same list, or <strong className="text-white">New Genres</strong>{" "}
            to fetch fresh options from Jellyfin (one reroll per night).
          </Step>

          <Step num={4} title="Nominate Movies">
            Each person takes a turn picking 1–2 movies. Tap a poster to
            nominate, tap again to remove. When finished, tap{" "}
            <strong className="text-white">Done</strong> — a animated handoff
            passes the device to the next person.
          </Step>

          <Step num={5} title="Vote">
            Everyone picks their name, then taps movies to vote. Tap again
            to change your vote. When ready, hit{" "}
            <strong className="text-white">Reveal Winner</strong>.
          </Step>

          <Step num={6} title="Winner!">
            Confetti, the winning poster, and a link to open it in Jellyfin.
          </Step>

          <div className="border-t border-white/10 pt-4 mt-4">
            <h3 className="font-semibold text-white mb-2">Tips</h3>
            <ul className="space-y-1.5 text-white/50 text-xs">
              <li>• Profiles with a PIN show a lock icon</li>
              <li>• Each person can nominate up to 2 movies</li>
              <li>• Reshuffles are unlimited, New Genres is once per night</li>
              <li>• Content is filtered by the youngest participant</li>
              <li>• Install as an app from your browser&apos;s share menu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-theater-red/20 border border-theater-red/30 flex items-center justify-center text-theater-red font-bold text-xs flex-shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
