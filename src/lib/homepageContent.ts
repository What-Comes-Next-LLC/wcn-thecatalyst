import { supabase } from './supabaseClient';

export interface HomepageContentItem {
  section_id: string;
  title: string;
  subhead: string;
  body: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
}

export interface HomepageContent {
  hero: HomepageContentItem;
  howItWorks: HomepageContentItem[];
  pricing: HomepageContentItem[];
  about: HomepageContentItem;
  proof: HomepageContentItem;
  finalCta: HomepageContentItem;
}

/**
 * Fetch homepage content from Supabase homepage_content table
 * Server-side function to avoid hydration issues
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching homepage content:', error);
      return getFallbackContent();
    }
    
    if (!data || data.length === 0) {
      console.warn('No homepage content found, using fallback');
      return getFallbackContent();
    }
    
    // Group content by section_id
    const contentMap = data.reduce((acc, item) => {
      if (!acc[item.section_id]) {
        acc[item.section_id] = [];
      }
      acc[item.section_id].push(item);
      return acc;
    }, {} as Record<string, HomepageContentItem[]>);
    
    return {
      hero: contentMap.hero?.[0] || getFallbackContent().hero,
      howItWorks: contentMap.howItWorks || getFallbackContent().howItWorks,
      pricing: contentMap.pricing || getFallbackContent().pricing,
      about: contentMap.about?.[0] || getFallbackContent().about,
      proof: contentMap.proof?.[0] || getFallbackContent().proof,
      finalCta: contentMap.finalCta?.[0] || getFallbackContent().finalCta,
    };
  } catch (error) {
    console.error('Error in getHomepageContent:', error);
    return getFallbackContent();
  }
}

/**
 * Fallback content structure matching the new design
 * Used when Supabase content is unavailable
 */
function getFallbackContent(): HomepageContent {
  return {
    hero: {
      section_id: 'hero',
      title: 'The Only Way Out Is Through.',
      subhead: 'Start logging. Get a plan. Choose your path.',
      body: '',
      image_url: '',
      cta_text: 'Start Now – It Begins with a Spark',
      cta_link: '/the-spark',
      sort_order: 1
    },
    howItWorks: [
      {
        section_id: 'howItWorks',
        title: '1',
        subhead: 'Sign Up + Start Logging',
        body: 'Begin with The Spark – start tracking your habits and daily patterns.',
        image_url: '',
        cta_text: '',
        cta_link: '',
        sort_order: 1
      },
      {
        section_id: 'howItWorks',
        title: '2',
        subhead: 'Monitor Your Habits',
        body: 'Your habits are monitored and analyzed over several days.',
        image_url: '',
        cta_text: '',
        cta_link: '',
        sort_order: 2
      },
      {
        section_id: 'howItWorks',
        title: '3',
        subhead: 'Get Your Mini-Plan',
        body: 'Receive a personalized plan based on your real habits and patterns.',
        image_url: '',
        cta_text: '',
        cta_link: '',
        sort_order: 3
      },
      {
        section_id: 'howItWorks',
        title: '4',
        subhead: 'Choose Your Path',
        body: 'Decide: walk away satisfied or keep going with deeper coaching.',
        image_url: '',
        cta_text: '',
        cta_link: '',
        sort_order: 4
      }
    ],
    pricing: [
      {
        section_id: 'pricing',
        title: 'The Spark',
        subhead: 'It begins with a Spark.',
        body: '$0',
        image_url: '',
        cta_text: 'Start Logging',
        cta_link: '/the-spark',
        sort_order: 1
      },
      {
        section_id: 'pricing',
        title: 'Full DITL (Virtual)',
        subhead: 'A plan built for your real life.',
        body: '$99',
        image_url: '',
        cta_text: 'Buy Now',
        cta_link: '#woocommerce-placeholder',
        sort_order: 2
      },
      {
        section_id: 'pricing',
        title: 'Upgrade: In-Person DITL + Workout',
        subhead: 'Same plan. I just have to shower.',
        body: '+$100',
        image_url: '',
        cta_text: 'Book In-Person',
        cta_link: '#in-person-placeholder',
        sort_order: 3
      },
      {
        section_id: 'pricing',
        title: 'Coaching Plan',
        subhead: 'No clock watching. Just real coaching.',
        body: '$299',
        image_url: '',
        cta_text: 'Apply for Coaching',
        cta_link: '#coaching-placeholder',
        sort_order: 4
      }
    ],
    about: {
      section_id: 'about',
      title: "I'm Jason",
      subhead: 'I built the tools. I use them myself.',
      body: "I'm a NASM-certified trainer and nutrition coach, a former exec, and a researcher working on AI coaching systems. This isn't a PDF and a pep talk. This is a system.",
      image_url: '/api/placeholder/150/150',
      cta_text: '',
      cta_link: '',
      sort_order: 1
    },
    proof: {
      section_id: 'proof',
      title: 'What People Say',
      subhead: '',
      body: '',
      image_url: '',
      cta_text: '',
      cta_link: '',
      sort_order: 1
    },
    finalCta: {
      section_id: 'finalCta',
      title: "You've been meaning to 'get serious.'",
      subhead: "Here's how serious people start: $99 and a conversation.",
      body: '',
      image_url: '',
      cta_text: 'Start Here – Intake + Spark Setup',
      cta_link: '/the-spark',
      sort_order: 1
    }
  };
}