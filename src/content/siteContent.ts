export const siteContent = {
  // Homepage content
  homepage: {
    hero: {
      title: "Personal Transformation Through Human Coaching",
      subtitle: "You don't need another app. You need a plan that finally sticks.",
      description: "Privacy-first coaching platform built by someone who's lived it. Real coaching, local AI, zero bullshit."
    },
    
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          step: "1",
          title: "Express Interest",
          description: "Simple intake form to understand your goals and situation."
        },
        {
          step: "2", 
          title: "Coach Review",
          description: "We review your information and reach out to discuss next steps."
        },
        {
          step: "3",
          title: "Start Building",
          description: "Begin your transformation with personalized coaching support."
        }
      ]
    },

    pricing: {
      title: "Service Options",
      subtitle: "Choose the level of support that fits your journey",
      tiers: [
        {
          name: "Spark",
          price: "Free",
          description: "Initial intake and coach consultation",
          features: [
            "Goal assessment",
            "Coach consultation", 
            "Next steps guidance"
          ],
          cta: "Start Here",
          primary: false
        },
        {
          name: "Foundation", 
          price: "$99",
          description: "Basic coaching support and planning",
          features: [
            "Everything in Spark",
            "Personalized planning",
            "Weekly check-ins",
            "Progress tracking"
          ],
          cta: "Get Started",
          primary: true
        },
        {
          name: "Transformation",
          price: "$299", 
          description: "Full coaching experience with AI-enhanced tools",
          features: [
            "Everything in Foundation",
            "Daily coaching support",
            "AI-enhanced planning",
            "Priority access to new features"
          ],
          cta: "Transform Now",
          primary: false
        }
      ]
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

    finalCta: {
      title: "Ready to Start?",
      subtitle: "Take the first step toward sustainable transformation.",
      buttonText: "Start With Spark"
    }
  },

  // Intake form content
  intake: {
    title: "Express Your Interest",
    subtitle: "Simple intake to get started with personal transformation. We'll review your information and follow up.",
    
    form: {
      fields: {
        name: {
          label: "Name",
          placeholder: "Your full name"
        },
        email: {
          label: "Email", 
          placeholder: "Your email address"
        },
        goal: {
          label: "Your Goal",
          placeholder: "What is your primary fitness or wellness goal?"
        },
        notes: {
          label: "Additional Notes (Optional)",
          placeholder: "Anything else you'd like us to know?"
        }
      },
      submitButton: "Submit Interest",
      submittingText: "Submitting..."
    },

    confirmation: {
      title: "Check Your Email",
      message: "We'll follow up after reviewing your intake."
    },

    returningUser: {
      text: "Already have an account?",
      linkText: "Sign In"
    }
  },

  // Sign in content  
  signin: {
    title: "Sign In to Your Log",
    subtitle: "We'll send you a magic link to access your account.",
    
    form: {
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      submitButton: "Send Magic Link",
      submittingText: "Sending magic link..."
    },

    confirmation: {
      title: "Check Your Email", 
      message: "We've sent you a magic link to sign in. Click the link in your email to continue."
    }
  },

  // Navigation
  navigation: {
    about: "About",
    founderLetter: "Founder's Letter",
    signin: "Sign In"
  },

  // Footer
  footer: {
    tagline: "Privacy-first coaching for real transformation.",
    company: "What Comes Next? LLC"
  }
};