"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SessionDraft,
  emptyDraft,
  loadDraft,
  saveDraft,
  clearDraft,
  appendToHistory,
  persistSessionToServer,
} from "@/lib/session";
import { copy } from "@/lib/copy";
import { createClient } from "@/lib/supabase/client";
import { ProgressDots } from "./ProgressDots";
import { Field, Chips } from "./Field";
import { BreathCircle } from "./BreathCircle";
import { ShareCard } from "./ShareCard";

const TOTAL = 10; // screens 0..9
const w = copy.wizard;

type FieldKey = keyof SessionDraft;

function canProceed(step: number, draft: SessionDraft): boolean {
  switch (step) {
    case 0:
      return true;
    case 1:
      return draft.problem.trim().length > 0;
    case 2:
      return (
        draft.belief.trim().length > 0 &&
        draft.emotion.trim().length > 0 &&
        draft.body_location.trim().length > 0
      );
    case 3:
      return draft.cost.trim().length > 0;
    case 4:
      return draft.secondary_gain.trim().length > 0;
    case 5:
      return draft.emotion_goal.trim().length > 0;
    case 6:
      return draft.becomes_possible.trim().length > 0;
    case 7:
      return draft.resolution.trim().length > 0;
    case 8:
      return draft.becoming.trim().length > 0;
    default:
      return true;
  }
}

export function Wizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<SessionDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [breathDone, setBreathDone] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  function update<K extends FieldKey>(key: K, value: SessionDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    if (step < TOTAL - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function persistThenReset() {
    appendToHistory(draft);
    // Best-effort server save when signed in. Failure falls back to history only.
    if (isAuthed) await persistSessionToServer(draft);
  }

  async function finishAndStartNew() {
    await persistThenReset();
    clearDraft();
    setDraft(emptyDraft);
    setBreathDone(false);
    setStep(0);
  }

  async function goPaywall() {
    await persistThenReset();
    router.push("/checkout");
  }

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-text-hint">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-16">
      <ProgressDots total={TOTAL} current={step} />

      <div key={step} className="animate-fade-in">
        {step === 0 && (
          <Screen title={w.welcome.title} kicker={w.welcome.kicker}>
            <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 sm:p-10 space-y-4 text-text-muted leading-relaxed">
              {w.welcome.lines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
            <PrimaryButton onClick={next}>{w.welcome.cta}</PrimaryButton>
          </Screen>
        )}

        {step === 1 && (
          <Screen
            title={w.problem.title}
            kicker={w.problem.kicker}
            helper={w.problem.helper}
          >
            <Field
              label={w.problem.fieldLabel}
              value={draft.problem}
              onChange={(v) => update("problem", v)}
              placeholder={w.problem.placeholder}
              examples={w.problem.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 2 && (
          <Screen title={w.belief.title} kicker={w.belief.kicker}>
            <Field
              label={w.belief.beliefLabel}
              value={draft.belief}
              onChange={(v) => update("belief", v)}
              placeholder={w.belief.beliefPlaceholder}
              examples={w.belief.beliefExamples}
            />
            <Field
              label={w.belief.emotionLabel}
              value={draft.emotion}
              onChange={(v) => update("emotion", v)}
              placeholder={w.belief.emotionPlaceholder}
              examples={w.belief.emotionExamples}
              rows={3}
            />
            <Chips
              label={w.belief.bodyLabel}
              options={w.bodyOptions}
              value={draft.body_location}
              onChange={(v) => update("body_location", v)}
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 3 && (
          <Screen
            title={w.cost.title}
            kicker={w.cost.kicker}
            helper={w.cost.helper}
          >
            <Field
              label={w.cost.fieldLabel}
              value={draft.cost}
              onChange={(v) => update("cost", v)}
              examples={w.cost.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 4 && (
          <Screen
            title={w.secondaryGain.title}
            kicker={w.secondaryGain.kicker}
            helper={w.secondaryGain.helper}
          >
            <Field
              label={w.secondaryGain.fieldLabel}
              value={draft.secondary_gain}
              onChange={(v) => update("secondary_gain", v)}
              examples={w.secondaryGain.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 5 && (
          <Screen
            title={w.emotionGoal.title}
            kicker={w.emotionGoal.kicker}
            helper={w.emotionGoal.helper}
          >
            <Field
              label={w.emotionGoal.fieldLabel}
              value={draft.emotion_goal}
              onChange={(v) => update("emotion_goal", v)}
              examples={w.emotionGoal.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 6 && (
          <Screen
            title={w.becomesPossible.title}
            kicker={w.becomesPossible.kicker}
          >
            <Field
              label={w.becomesPossible.fieldLabel}
              value={draft.becomes_possible}
              onChange={(v) => update("becomes_possible", v)}
              examples={w.becomesPossible.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 7 && (
          <Screen
            title={w.resolution.title}
            kicker={w.resolution.kicker}
            helper={w.resolution.helper}
          >
            <Field
              label={w.resolution.fieldLabel}
              value={draft.resolution}
              onChange={(v) => update("resolution", v)}
              examples={w.resolution.examples}
              autoFocus
            />
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 8 && (
          <Screen title={w.becoming.title} kicker={w.becoming.kicker}>
            <BreathCircle onComplete={() => setBreathDone(true)} />
            <Field
              label={w.becoming.fieldLabel}
              value={draft.becoming}
              onChange={(v) => update("becoming", v)}
              examples={w.becoming.examples}
            />
            {!breathDone && draft.becoming.trim().length === 0 && (
              <p className="text-text-hint text-xs text-center">
                {w.becoming.breathHint}
              </p>
            )}
            <NavRow
              onBack={back}
              onNext={next}
              canNext={canProceed(step, draft)}
            />
          </Screen>
        )}

        {step === 9 && (
          <Screen title={w.final.title} kicker={w.final.kicker}>
            <ShareCard becoming={draft.becoming} />

            <div className="rounded-2xl bg-bg-card border border-bg-elev p-6 space-y-3">
              <div className="font-serif text-lg text-accent">
                {w.final.paywallTitle}
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                {w.final.paywallBody}
              </p>
              <button
                type="button"
                onClick={goPaywall}
                className="w-full px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
              >
                {w.final.paywallCta}
              </button>
            </div>

            <button
              type="button"
              onClick={finishAndStartNew}
              className="w-full px-6 py-3 rounded-full border border-bg-elev text-text-muted hover:text-text hover:bg-bg-card transition"
            >
              {w.final.newSessionCta}
            </button>
          </Screen>
        )}
      </div>
    </div>
  );
}

function Screen({
  title,
  kicker,
  helper,
  children,
}: {
  title: string;
  kicker?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {kicker && (
          <div className="text-accent text-xs uppercase tracking-[0.25em]">
            {kicker}
          </div>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl leading-snug text-balance">
          {title}
        </h1>
        {helper && (
          <p className="text-text-muted text-sm leading-relaxed">{helper}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function NavRow({
  onBack,
  onNext,
  canNext,
}: {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="px-5 py-3 rounded-full text-text-muted hover:text-text transition"
      >
        {copy.wizard.nav.back}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="px-8 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copy.wizard.nav.next}
      </button>
    </div>
  );
}
