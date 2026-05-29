/**
 * ALL USER-FACING TEXT for SEDNA lives in this file.
 *
 * To change any wording, edit the strings here. The components read from this
 * module — you do not need to touch JSX or component logic to change copy.
 *
 * Keep the keys, change the strings. Multi-line strings use backticks (`) so
 * you can write naturally with apostrophes and quotes inside.
 */

export const copy = {
  // ───────────────────────────────────────────────────────────────────
  // Site-wide identity
  // ───────────────────────────────────────────────────────────────────
  site: {
    title: "SEDNA — energetic charge release technique",
    description:
      "A 10-minute web practice for the moment after something just got loud. From Occultics.",
    brand: "SEDNA",
    parentBrand: "Occultics",
  },

  // ───────────────────────────────────────────────────────────────────
  // The disclaimer that appears in every footer
  // ───────────────────────────────────────────────────────────────────
  disclaimer: `Sedna is a self-reflection and self-regulation tool. It is not therapy or medical care. If you are in acute mental health crisis, please contact a qualified professional or your local crisis line. By using Sedna you confirm you are 18 or older.`,

  // ───────────────────────────────────────────────────────────────────
  // Footer
  // ───────────────────────────────────────────────────────────────────
  footer: {
    brandLine: "An Occultics practice · occultics.ai",
    nav: {
      home: "Home",
      practice: "Practice",
      account: "Account",
      terms: "Terms",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // Landing page (the `/` route)
  // ───────────────────────────────────────────────────────────────────
  landing: {
    nav: {
      signIn: "Sign in",
      startTrialShort: "Start free trial",
    },
    hero: {
      titleLineA: "Release the stuck energy.",
      titleLineB: "Create the reality you want.",
      subline:
        "A 10-minute web practice for the moment after something just got loud.",
      ctaTrial: "Start 3-day free trial",
      ctaHow: "See how it works",
      pricingHint: "$14.99/month or $89/year after trial. Cancel anytime.",
    },
    pitch: {
      heading: "The 10-minute window",
      paragraphs: [
        `Something just got loud. A message landed wrong. A meeting went sideways. A familiar fear came back in the door. There is a window — maybe ten minutes long — where the charge of that moment can be met, named, and metabolized before it lodges in the body as another story you carry.`,
        `Sedna is the practice for that window. Nine short prompts, one breath cycle, one becoming. You arrive shaken. You leave with one small, true thing to do next.`,
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "1",
          title: "Name the charge",
          body: "Write the situation and your reaction in one sentence. You will already feel something soften.",
        },
        {
          n: "2",
          title: "Look at what it costs",
          body: "Walk through belief, body, cost, secondary gain, and the emotion's goal. Each prompt is one breath wide.",
        },
        {
          n: "3",
          title: "Choose a becoming",
          body: "Three slow breaths. Then name the person you are becoming, and one concrete thing you do today.",
        },
      ],
    },
    pricing: {
      heading: "One practice. Two ways to pay.",
      monthlyLabel: "Monthly",
      monthlyPrice: "$14.99",
      monthlyPer: "per month",
      annualLabel: "Annual",
      annualPrice: "$89",
      annualPer: "/yr",
      annualSavings: "Save ~50%",
      features: [
        "· 3-day free trial. Card required.",
        "· Save sessions across devices.",
        "· See your patterns over time.",
        "· Cancel anytime in your account.",
      ],
      cta: "Start 3-day free trial",
      finePrint:
        "No refunds. EU/UK 14-day withdrawal right waived for immediate access. Full terms at checkout.",
    },
    founder: {
      heading: "From the founder",
      paragraphs: [
        `I built Sedna because the technique was the only thing that consistently brought me back to myself when the day went loud. It is not a substitute for therapy. It is a practice — a small, repeatable thing you do in the ten minutes after something hits, so that what hit you does not become who you are.`,
      ],
      byline: "— Occultics",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // The 9-screen session flow (/app)
  //
  // Each screen has the same shape. Edit titles, helpers, examples freely.
  // `examples` always render above the input as the "FOR EXAMPLE" card.
  // ───────────────────────────────────────────────────────────────────
  wizard: {
    accountLink: "Account",
    nav: {
      back: "← Back",
      next: "Continue",
    },
    bodyOptions: [
      "head",
      "throat",
      "chest",
      "belly",
      "hands",
      "legs",
      "all over",
      "not sure",
    ],

    welcome: {
      kicker: "A ritual to begin",
      title: "Welcome",
      lines: [
        "Drink a glass of water.",
        "Sit somewhere quiet for the next few minutes.",
        "Two breaths in through the nose, out through the mouth.",
      ],
      cta: "I'm ready",
    },

    problem: {
      kicker: "Step 1 of 9",
      title: "Define the problem.",
      helper:
        "It consists of situation and reaction. Both, in one sentence.",
      fieldLabel: "The problem",
      placeholder: "I feel ____ because ____",
      examples: [
        "I feel sad and angry because I don't have money right now.",
        "I feel anxious because my partner didn't text me back today.",
        "I feel resentful because my mother criticized my career choice again.",
      ],
    },

    belief: {
      kicker: "Step 2 of 9",
      title:
        "What thoughts or limiting beliefs are you experiencing right now in regards to this problem?",
      beliefLabel: "Belief",
      beliefPlaceholder: "The story underneath the feeling",
      beliefExamples: [
        "I am not worth enough to make 10K per month.",
        "Love always leaves me.",
        "I will never live up to what my parents wanted.",
      ],
      emotionLabel: "Emotion",
      emotionPlaceholder: "Name the feeling. Be specific.",
      emotionExamples: [
        "Sadness, energetic heaviness.",
        "Anxiety, fear, a knot in the throat.",
        "Resentment, exhaustion, quiet rage.",
      ],
      bodyLabel: "Where do you feel it in the body?",
    },

    cost: {
      kicker: "Step 3 of 9",
      title: "What is this emotion costing you right now?",
      helper: "What's being lost right now, in this state.",
      fieldLabel: "The cost",
      examples: [
        "My ability to have fun and experience life fully.",
        "The trust I had in my own worth.",
        "Time I could be spending on what actually matters.",
      ],
    },

    secondaryGain: {
      kicker: "Step 4 of 9",
      title:
        "What secondary gain do you get while feeling this emotion?",
      helper: "Every emotional charge gives us something.",
      fieldLabel: "The secondary gain",
      examples: [
        "I get to stay small and not risk being seen.",
        "I get sympathy and attention from people who would otherwise overlook me.",
        "I get to avoid the harder conversation I know I need to have.",
      ],
    },

    emotionGoal: {
      kicker: "Step 5 of 9",
      title: "What do you think is the goal of this emotion?",
      helper:
        "Every emotion has a job. What is this one trying to do for you?",
      fieldLabel: "Its goal",
      examples: [
        "To get me out of my comfort zone, or to keep me stuck in a nervous-system shutdown.",
        "To protect me from being rejected again.",
        "To tell me that my old strategies are not working anymore.",
      ],
    },

    becomesPossible: {
      kicker: "Step 6 of 9",
      title:
        "What do you think will happen when the initial problem disappears? What becomes possible?",
      fieldLabel: "What becomes possible",
      examples: [
        "I lead a more joyful life and become a happy human.",
        "I trust myself enough to ask for what I actually want.",
        "I have the energy to build the work I'm here to build.",
      ],
    },

    resolution: {
      kicker: "Step 7 of 9",
      title: "What is the one resolution available to you right now?",
      helper:
        "One concrete thing you can do. Small enough that it's impossible to fail.",
      fieldLabel: "The resolution (present tense)",
      examples: [
        "I create the mini web app and start charging for it.",
        "I have one honest conversation this week.",
        "I commit to my work for 90 days without checking if it's working.",
      ],
    },

    becoming: {
      kicker: "Step 8 of 9",
      title:
        "Take three slow breaths. Then name who you are becoming without the initial problem.",
      fieldLabel:
        "I am becoming the person who… (be as specific as possible)",
      examples: [
        "I am becoming a self-confident individual who makes ten grand a month selling AI apps from a Mediterranean island.",
        "I am becoming someone who trusts her own knowing more than other people's opinions.",
        "I am becoming the person who finishes what she starts.",
      ],
      breathHint: "Take the breath cycle first. The words come easier after.",
    },

    final: {
      kicker: "Step 9 of 9",
      title: "Now go and be that person.",
      paywallTitle: "Save your sessions",
      paywallBody:
        "Save your sessions across devices and see your patterns over time — start your 3-day free trial. $14.99/month or $89/year. Cancel anytime.",
      paywallCta: "Start 3-day free trial",
      newSessionCta: "Start a new session",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // The breath circle (used inside step 8)
  // ───────────────────────────────────────────────────────────────────
  breath: {
    inhale: "inhale",
    hold: "hold",
    exhale: "exhale",
    tapToStart: "Tap to start",
    countLabel: (current: number, total: number) =>
      `Breath ${current} of ${total}`,
    instructions: (total: number) =>
      `${total} slow breaths · 5 in · 2 hold · 7 out`,
  },

  // ───────────────────────────────────────────────────────────────────
  // The share card (rendered after the wizard, exported as PNG)
  // ───────────────────────────────────────────────────────────────────
  shareCard: {
    prefix: "I am becoming",
    footer: "SEDNA · OCCULTICS.AI",
    saveCta: "Save card (PNG)",
  },

  // ───────────────────────────────────────────────────────────────────
  // Transactional emails
  // Edit subject lines / body copy here. Templates pull text from this
  // module — change once and every email updates.
  // ───────────────────────────────────────────────────────────────────
  emails: {
    fromName: "SEDNA",
    signature: "Adriana · Occultics",
    welcome: {
      subject: "Welcome to SEDNA",
      preheader:
        "A 10-minute practice for the moment after something just got loud.",
      headline: "Welcome to SEDNA",
      body: [
        "I'm glad you're here.",
        "SEDNA is a practice for the moment after you got triggered by something or someone. The nine prompts and the breath cycle take about ten minutes. You arrive shaken; you leave with one small, true thing to do next.",
        "If you ever want to reply to this email, you can. I read every one.",
      ],
      cta: "Open the practice",
      footerNote:
        "You're getting this because you signed in to SEDNA at sedna.occultics.ai.",
    },
    trialEnding: {
      subject: "Your SEDNA trial ends tomorrow",
      preheader:
        "Heads up — your free trial ends in 24 hours and your card will be charged.",
      headline: "Your trial ends tomorrow",
      body: [
        "Quick heads-up: your 3-day free trial ends in 24 hours. After that your card will be charged for your SEDNA subscription, and the practice continues uninterrupted.",
        "If SEDNA isn't for you right now, you can cancel anytime — no questions asked, no charge. The link below opens your account where you can manage your subscription.",
        "If SEDNA has been useful, thank you. Truly. You don't need to do anything — your subscription just continues.",
      ],
      cta: "Manage subscription",
      footerNote:
        "You're getting this because your SEDNA free trial is ending soon.",
    },
    cancellation: {
      subject: "Your SEDNA subscription is canceled",
      preheader: "Access continues until the end of your current period.",
      headline: "Your subscription is canceled",
      bodyWithEndDate: (endDate: string) => [
        `Got it — your SEDNA subscription is set to end on ${endDate}. You'll keep full access until then, and your sessions stay safe in your account.`,
        "If you change your mind before then, you can restart from your account page in one click.",
        "Thanks for trying SEDNA. If there's anything that didn't work, I'd love to hear about it — just reply.",
      ],
      cta: "Open your account",
      footerNote:
        "You're getting this because you canceled your SEDNA subscription.",
    },
    paymentFailed: {
      subject: "We couldn't charge your card",
      preheader:
        "Update your payment method to keep your SEDNA subscription active.",
      headline: "We couldn't charge your card",
      body: [
        "Your most recent SEDNA charge didn't go through. This usually means an expired card, a bank hold, or a card-issuer flag.",
        "Stripe will retry the charge automatically over the next few days. To skip the wait and avoid losing access, you can update your payment method now.",
      ],
      cta: "Update payment method",
      footerNote:
        "You're getting this because a recent SEDNA payment failed.",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // Checkout page
  // Legal language — change only with care. The EU waiver is required
  // to opt out of the 14-day cooling-off period for immediate access.
  // ───────────────────────────────────────────────────────────────────
  checkout: {
    title: "Start your 3-day free trial",
    subtitle:
      "Save your sessions across devices and see your patterns over time.",
    monthly: {
      label: "Monthly",
      price: "$14.99",
      per: "/month",
    },
    annual: {
      label: "Annual",
      price: "$89",
      per: "/year",
      savings: "Save ~50%",
    },
    termsHeading: "By starting your free trial, you agree to the following:",
    termsBullets: [
      "Your 3-day free trial begins immediately. On day 4, your card will be charged $14.99/month (or $89/year if annual selected) unless you cancel.",
      "You can cancel anytime in your account settings. Cancellation stops all future charges. You retain access until the end of your paid period.",
      "No refunds. All charges are non-refundable, including partial months/years.",
      "EU/UK users: I waive my 14-day withdrawal right under EU Directive 2011/83/EU and UK Consumer Contracts Regulations 2013, in exchange for immediate access to the service.",
    ],
    termsAgreeLabel: "I have read and agree to these terms.",
    cta: "Start free trial",
    signInPrompt: "Sign in to start your trial",
    signInCta: "Go to sign in",
  },
} as const;
