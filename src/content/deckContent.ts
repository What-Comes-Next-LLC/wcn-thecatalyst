export const deckContent = {
    root: {
      hero: {
        title: "Your Transformation Begins Here",
        subtitle: "Congratulations on taking the first step towards your transformation. What comes next is a journey we'll navigate together.",
        image: "/images/logo-official.png"
      },
      testimonials: [
        { 
          text: "The Catalyst helped me build sustainable habits that actually stuck.", 
          author: "Sarah K." 
        },
        { 
          text: "As a trainer, I've seen 3x better client retention with these tools.", 
          author: "Marcus J." 
        },
        { 
          text: "The behavior-first approach finally made fitness click for me.", 
          author: "David R." 
        }
      ],
      navigation: {
        onboard: {
          heading: "The Spark",
          description: "Take your first step towards transformation with our guided onboarding process.",
          link: "/onboard"
        },
        promo: {
          heading: "Discover Our Vision",
          description: "Learn how we're revolutionizing fitness through behavior-first transformation.",
          link: "/promo"
        },
        admin: {
          description: "Your hub for team management, onboarding, and account review.",
          link: "/admin",
          isAdminOnly: true
        }
      },
      footer: {
        quote: "Transformation begins with a question - What comes next?"
      }
    },
    about: {
      company: {
        hero: {
          title: "Transformation Begins With A Question...",
          image: "/images/about-hero.jpg",
          imageAlt: "What Comes Next? LLC - A different kind of coaching. Built for real life. Human-first. AI-assisted. Privacy always."
        },
        vision: {
          heading: "We help people who've had to start over.",
          content: "What Comes Next? LLC exists for people navigating life after the reset button. Whether that's recovering from illness, rediscovering your body, or just getting your footing again—this platform is designed to meet you where you are, not where someone else thinks you should be.\n\nOur mission is to bring real, human coaching into the AI era—without sacrificing privacy, dignity, or context. The Catalyst system blends behavioral science, adaptive tools, and a deeply personal approach to help you build routines that stick. No hype, no tracking cookies, no BS.\n\nWe're not here to sell you a dream. We're here to help you build one."
        },
        metrics: {
          heading: "Impact in Progress",
          stats: [
            { value: "120+", label: "Data points tracked per client to tailor each plan" },
            { value: "3x", label: "Average increase in client program adherence after 30 days" },
            { value: "100%", label: "Privacy-first: No third-party data sharing or ads" },
            { value: "1", label: "Human behind all of it (for now)" }
          ]
        }
      },
      founder: {
        heading: "Meet the Founder",
        portrait: {
          image: "/images/founder.jpg",
          imageAlt: "Jason Rashaad - Founder of What Comes Next? LLC"
        },
        sections: [
          {
            heading: "Personal Journey",
            content: "I didn't build What Comes Next? because I had a dream. I built it because I almost didn't get the chance to.\n\nAfter facing liver failure, dialysis, and the kind of medical \"go home and wait\" advice no one wants to hear, I chose a different path. Step by step—literally on a treadmill—I started over. From hospital bed to half marathon, from not knowing what came next to building a platform that helps people figure that out for themselves.\n\nThis company exists because the system didn't work for me. So I made one that might."
          },
          {
            heading: "Personal Mission",
            content: "I believe in earned wisdom, quiet strength, and tools that fit the person—not the other way around.\n\nThe Catalyst isn't about optimization for optimization's sake. It's about building trust. About seeing people. About using AI to make human coaching more personal, not less.\n\nThis isn't a startup in a hoodie chasing a market trend. It's a hand-built system rooted in real experience, designed to empower trainers and clients to build routines they can actually live with."
          }
        ],
        milestones: {
          heading: "Milestones",
          achievements: [
            "Reversed liver and kidney failure through self-led lifestyle change",
            "Completed two half marathons in 2023 (after regaining ability to walk)",
            "Launched The Catalyst MVP with live onboarding and AI-enhanced coaching",
            "Earned NASM Certified Personal Trainer credentials (April 2025)",
            "Founded What Comes Next? LLC to deliver privacy-first coaching tools",
            "Invited speaker and lecturer on Generative AI, behavioral change, and resilience"
          ]
        }
      },
      contactCta: {
        heading: "Connect With Us",
        content: "Have questions or want to learn more about What Comes Next? Reach out through our social channels or send us an email at coach@whatcomesnextllc.ai",
        socialMedia: [
          {
            name: "Instagram",
            url: "https://www.instagram.com/whatcomesnextllc/",
            icon: "instagram"
          },
          {
            name: "Threads",
            url: "https://www.threads.net/@jasonrashaad",
            icon: "threads"
          },
          {
            name: "LinkedIn",
            url: "https://www.linkedin.com/company/whatcomesnextllc",
            icon: "linkedin"
          },
          {
            name: "Facebook",
            url: "https://www.facebook.com/whatcomesnextllc",
            icon: "facebook"
          },
          {
            name: "GitHub",
            url: "https://github.com/what-comes-next-llc",
            icon: "github"
          }
        ]
      }
    },
    hero: {
      title: "The Catalyst",
      subtitle:
        "A behavior-first fitness system designed to keep clients engaged long after the 90-day hump. Built by a trainer. Powered by local AI. Ready to scale.",
      image: null,
      video: "/videos/promo.mp4",
    },
    problem: {
      heading: "The Problem",
      paragraphs: [
        "Most fitness apps are built for transactions, not transformations. They track reps and macros, but do nothing to address the real reason people quit: unsustainable behavior change.",
        "Trainers know this—but they lack scalable tools to close the gap. The result? Clients drop out within three months, and trainers burn out trying to keep them engaged.",
      ],
      image: "/images/habit-funnel.png",
    },
    solution: {
      heading: "Our Solution",
      paragraphs: [
        "The Catalyst is a trainer-powered AI system that generates behavior-first fitness plans designed for longevity.",
        "With scenario-based planning, contextual nudges, and longitudinal behavior modeling, trainers can create customized \"Day in the Life\" plans that drive better habits and improve client retention—without more admin overhead.",
      ],
      image: null,
    },
    product: {
      heading: "The System",
      bullets: [
        {
          label: "The Catalyst",
          description:
            "AI-driven engine generating behavior-first fitness scenarios.",
        },
        {
          label: "Day in the Life",
          description:
            "Personalized daily plans designed to create sustainable habits.",
        },
        {
          label: "Coach's Clipboard",
          description:
            "A trainer-facing dashboard for onboarding, planning, and tracking.",
        },
      ],
      image: "/images/system-map.png",
    },
    market: {
      heading: "Market Opportunity",
      paragraphs: [
        "The global digital fitness market exceeds $15B and continues to grow—especially post-pandemic.",
        "Most tools serve big gyms or general users. The Catalyst is purpose-built for personal trainers, fitness entrepreneurs, and the clients they actually serve.",
      ],
      chartPlaceholder: "TAM/SAM/SOM Chart Placeholder",
      image: "/images/market-opportunity.png",
    },
    competitive: {
      heading: "Competitive Landscape",
      paragraphs: [
        "Platforms like Trainerize and TrueCoach offer solid tracking tools—but they don't touch behavior.",
        "The Catalyst is built to support the human side of coaching: trust, behavior change, and long-term client success. It doesn't replace the coach—it amplifies them.",
      ],
      image: "/images/competitive-positioning.png",
    },
    whyNow: {
      heading: "Why Now?",
      paragraphs: [
        "Trainers are burning out. Clients are dropping off. AI adoption is exploding with cookie-cutter tools.",
        "This is the moment to give human coaches the tools they need to scale impact, not effort.",
      ],
      image: null,
    },
    goToMarket: {
      heading: "Go-to-Market Plan",
      paragraphs: [
        "Our MVP launches locally, starting with Detroit-area trainers and gyms.",
        "We're refining through real-world usage, building trainer feedback into the core, and preparing for a global expansion with culturally localized behavior systems.",
      ],
      image: null,
    },
    whoBenefits: {
      heading: "Who This Helps",
      bullets: [
        {
          label: "Trainers",
          description:
            "Automate behavioral planning without losing the human touch.",
        },
        {
          label: "Clients",
          description:
            "Get daily plans they'll actually follow, not just track.",
        },
        {
          label: "Communities",
          description:
            "Deploy culturally relevant coaching for underserved groups.",
        },
      ],
      image: null,
    },
    businessModel: {
      heading: "Business Model",
      bullets: [
        "Subscription SaaS pricing for trainers and gym partners.",
        "One-off \"Day in the Life\" PDFs sold a la carte.",
        "Whitelabel and licensing for international and franchise use.",
      ],
      image: "/images/how-we-make-money.png",
    },
    ourAsk: {
      heading: "What We Need",
      paragraphs: [
        "We're raising pre-seed funding to complete the MVP and begin onboarding with trainers. Our goal is to work through Memorial Day and prove our model.",
        "The system works. The tools exist. All we need is the runway.",
      ],
      image: null,
    },
    ctaPromo: {
      heading: "See It In Action",
      blurb:
        "Like what you see? Help bring The Catalyst to life. We're asking for a dollar to prove it works.",
      buttonText: "Can I Get A Dollar?",
      videoUrl: "https://whatcomesnextllc.ai/promo.mp4",
      buttonUrl: "https://www.whatcomesnextllc.us/product/a-dollar/",
      image: null,
    },
    combinedCta: {
      heading: "What We Need",
      paragraphs: [
        "We're raising pre-seed funding to complete the MVP and begin onboarding with trainers. Our goal is to work through Memorial Day and prove our model.",
        "The system works. The tools exist. All we need is the runway.",
        "Like what you see? Help bring The Catalyst to life. Choose your contribution level below."
      ],
      buttonText: "View All Options",
      buttonUrl: "https://www.whatcomesnextllc.us/product/a-dollar/",
      socialProof: "Join others who have already supported The Catalyst",
      finalEncouragement: "Every dollar counts. Let's build the future of fitness together.",
      products: [
        {
          name: "Pot of Coffee",
          price: "$10",
          url: "https://whatcomesnextllc.us/product/pot-of-coffee/"
        },
        {
          name: "Stack the Set",
          price: "$50",
          url: "https://whatcomesnextllc.us/product/stack-the-set/"
        },
        {
          name: "Lift Off",
          price: "$100",
          url: "https://whatcomesnextllc.us/product/lift-off/"
        },
        {
          name: "Rep for the Record",
          price: "$250",
          url: "https://whatcomesnextllc.us/product/rep-for-the-record/"
        },
        {
          name: "Founder Fuel",
          price: "$500",
          url: "https://whatcomesnextllc.us/product/founder-fuel/"
        },
        {
          name: "Custom Amount",
          price: "Variable",
          url: "https://www.whatcomesnextllc.us/product/a-dollar/"
        }
      ],
      socialMedia: [
        {
          name: "Instagram",
          url: "https://www.instagram.com/whatcomesnextllc/",
          icon: "instagram"
        },
        {
          name: "Threads",
          url: "https://www.threads.net/@whatcomesnextllc",
          icon: "threads"
        },
        {
          name: "Facebook",
          url: "https://www.facebook.com/whatcomesnextllc",
          icon: "facebook"
        },
        {
          name: "BlueSky",
          url: "https://bsky.app/profile/whatcomesnextllc.us",
          icon: "bluesky"
        }
      ]
    },
};