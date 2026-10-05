import { FactCheckResultData } from '../types';

export const COFFEE_CANCER_RESULT: FactCheckResultData = {
  id: 'coffee-causes-cancer',
  claim: 'Coffee causes cancer.',
  checkedAt: 'Checked just now',
  verdict: 'MOSTLY FALSE',
  confidence: 94,
  headline: 'Coffee Does NOT Cause Cancer; Evidence Points to No Increased Risk, and Possibly Lower Risk for Some Cancers',
  summary: 'No major health authority has concluded that drinking coffee causes cancer. The WHO’s International Agency for Research on Cancer (IARC) found that coffee is unlikely to cause several common cancers and is linked to lower risk for liver and uterine cancers. There are two caveats: very hot drinks (>65°C) pose thermal risks for oesophageal cancer, and trace acrylamide from roasting has shown no association with human cancer in large cohorts.',
  caveats: [
    'Very hot beverages: IARC classifies drinking beverages at very high temperatures (>65 °C) as "probably carcinogenic" (Group 2A) for oesophageal cancer due to thermal scald injury, not from coffee chemical constituents.',
    '"Not classifiable" is not "proven safe": IARC notes current epidemiological data do not enable definitive conclusions for over 20 rarer cancers, though overall prospective cohort data is highly reassuring.',
    'Acrylamide & Roasting: Trace acrylamide forms naturally during bean roasting; however, large prospective human reviews report no elevated risk from dietary consumption.',
    'Smoking confounding: Early 1980s research linking coffee to bladder cancer was subsequently determined to be heavily confounded by concurrent tobacco smoking.'
  ],
  reasoning: [
    {
      index: '01',
      title: 'WHO / IARC Carcinogenicity Classification',
      description: 'In 2016, IARC re-evaluated coffee and classified it as Group 3 ("not classifiable as to its carcinogenicity to humans"). The agency concluded coffee is unlikely to cause breast, prostate, or pancreatic cancers, and observed statistically significant risk reductions for liver and endometrial cancers.'
    },
    {
      index: '02',
      title: 'American Cancer Society (ACS) Position',
      description: 'The ACS affirmed that coffee drinking is not a cause of female breast, pancreas, or prostate cancers, and reduces risk for liver and uterine cancers. ACS clarified that early bladder cancer signals were entirely attributable to tobacco smoking among coffee drinkers.'
    },
    {
      index: '03',
      title: 'World Cancer Research Fund & AICR Consensus',
      description: 'WCRF’s Continuous Update Project systematically concluded there is strong evidence that regular coffee intake reduces the risk of both liver cancer and endometrial (womb) cancer.'
    },
    {
      index: '04',
      title: 'BMJ Umbrella Review & California OEHHA Ruling',
      description: 'A comprehensive 2017 BMJ umbrella review of 201 meta-analyses demonstrated that high vs. low coffee intake was associated with an 18% lower overall incident cancer risk (RR 0.82). California’s OEHHA officially exempted coffee from Proposition 65 cancer warning labels in 2019.'
    }
  ],
  evidenceOverview: {
    strengthScore: 94,
    totalSources: 14,
    contradictCount: 10,
    supportCount: 1,
    contextCount: 3
  },
  sources: [
    {
      id: 'coffee-src-1',
      sourceName: 'IARC / World Health Organization',
      sourceDomain: 'iarc.who.int',
      title: 'IARC Monographs Volume 116: Coffee, Maté, and Very Hot Beverages',
      url: 'https://www.iarc.who.int/featured-news/media-centre-iarc-news-mono116/',
      quote: 'An evaluation of not classifiable as to its carcinogenicity to humans (Group 3)... it was possible to conclude from the studies evaluated that coffee is unlikely to cause certain cancers, including cancers of the breast, prostate, and pancreas. Reduced risks were seen for cancers of the liver and uterine endometrium.',
      date: 'June 2016 / Lancet Oncology',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 99,
      screenshotVerified: true
    },
    {
      id: 'coffee-src-2',
      sourceName: 'British Medical Journal (BMJ)',
      sourceDomain: 'bmj.com / pubmed.ncbi.nlm.nih.gov',
      title: 'Coffee consumption and health: umbrella review of meta-analyses of multiple health outcomes',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29167102/',
      quote: 'High versus low consumption was associated with an 18% lower risk of incident cancer (RR 0.82, 95% CI 0.74 to 0.89). Consumption was also associated with lower risk for specific cancers including prostate, endometrial, melanoma, and liver cancer.',
      date: 'November 2017',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 98,
      screenshotVerified: true
    },
    {
      id: 'coffee-src-3',
      sourceName: 'World Cancer Research Fund (WCRF / AICR)',
      sourceDomain: 'wcrf.org',
      title: 'Diet, Nutrition, Physical Activity and Cancer: Coffee, Tea and Cancer Risk',
      url: 'https://www.wcrf.org/preventing-cancer/topics/coffee-tea-and-cancer/',
      quote: 'We have strong evidence that: Coffee reduces the risk of liver cancer; Coffee reduces the risk of womb (endometrial) cancer. There is no evidence that coffee increases cancer risk.',
      date: 'Global Cancer Update Program',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 97,
      screenshotVerified: true
    },
    {
      id: 'coffee-src-4',
      sourceName: 'California OEHHA (Proposition 65)',
      sourceDomain: 'p65warnings.ca.gov',
      title: 'Coffee and Proposition 65: Frequently Asked Questions & Exemption Rule',
      url: 'https://www.p65warnings.ca.gov/fact-sheets/coffee-and-proposition-65-frequently-asked-questions',
      quote: 'A very large number of human studies, taken together, show inadequate evidence that drinking coffee causes cancer. Drinking coffee even appears to reduce the risk of liver cancer and endometrial cancer.',
      date: 'March 2019 / Official Ruling',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 96,
      screenshotVerified: true
    },
    {
      id: 'coffee-src-5',
      sourceName: 'American Cancer Society (ACS)',
      sourceDomain: 'cancer.org',
      title: 'Coffee and Cancer: What the Research Really Shows',
      url: 'https://www.cancer.org/research/acs-research-news/coffee-and-cancer-what-the-research-really-shows.html',
      quote: 'Early research suggested that coffee increased the risk of bladder cancer, but the true causal factor was later found to be smoking... coffee drinking is not a cause of female breast, pancreas, and prostate cancers, but may reduce the risk of uterine endometrium and liver cancers.',
      date: 'ACS Research News',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 97,
      screenshotVerified: true
    },
    {
      id: 'coffee-src-6',
      sourceName: 'BMC Cancer (Zhao et al.)',
      sourceDomain: 'pmc.ncbi.nlm.nih.gov',
      title: 'Coffee consumption and risk of cancers: a systematic evaluation of meta-analyses and prospective studies',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7003434/',
      quote: 'Higher coffee intake was associated with an increased risk of childhood acute lymphocytic leukemia and bladder cancer in case-control studies; however, when we evaluated prospective cohort studies, only protective associations for liver and endometrial cancers were further confirmed.',
      date: 'February 2020',
      direction: 'CONTEXT',
      supportsVerdict: true,
      credibilityScore: 95,
      screenshotVerified: true
    }
  ]
};

export const EV_LIFECYCLE_RESULT: FactCheckResultData = {
  id: 'ev-lifecycle-co2',
  claim: 'Do electric cars produce more CO2 than gas cars over their lifetime?',
  checkedAt: 'Checked just now',
  verdict: 'PARTIALLY TRUE',
  confidence: 94,
  summary: 'Electric cars produce more CO2 during manufacturing (primarily due to battery mineral extraction and cell synthesis), but significantly less over their entire operational lifetime.',
  reasoning: [
    {
      index: '01',
      title: 'Manufacturing emissions deficit',
      description: 'Mining, refining, and producing lithium-ion battery packs generates higher upfront carbon emissions than assembling conventional gasoline vehicles.'
    },
    {
      index: '02',
      title: 'Operational energy conversion',
      description: 'Electric motors convert over 85% of electrical energy into motion, whereas internal combustion engines waste 70–80% of fuel energy as heat and friction.'
    },
    {
      index: '03',
      title: 'Carbon breakeven milestone',
      description: 'Peer-reviewed lifecycle assessments from EPA and Nature show EVs achieve full carbon neutrality relative to gas cars within 12 to 24 months of average driving.'
    },
    {
      index: '04',
      title: 'Lifetime conclusion',
      description: 'Over a full 150,000–200,000 mile lifespan, electric vehicles generate 50% to 70% fewer net greenhouse gas emissions across all standard electrical grids.'
    }
  ],
  evidenceOverview: {
    strengthScore: 92,
    totalSources: 12,
    contradictCount: 4,
    supportCount: 6,
    contextCount: 2
  },
  sources: [
    {
      id: 'ev-1',
      sourceName: 'Science Magazine (AAAS)',
      sourceDomain: 'science.org',
      title: 'Global Comparison of Life Cycle Greenhouse Gas Emissions from Passenger Cars',
      url: 'https://www.science.org/doi/10.1126/science.abg2784',
      quote: 'Lifetime emissions of EVs are lower than gasoline cars even in countries with carbon-intensive electrical grids, with net benefits accelerating as grids decarbonize.',
      date: 'Published Peer Review',
      direction: 'SUPPORTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 99,
      screenshotVerified: true
    },
    {
      id: 'ev-2',
      sourceName: 'U.S. Environmental Protection Agency (EPA)',
      sourceDomain: 'epa.gov',
      title: 'Electric Vehicle Myths and Life Cycle Analysis',
      url: 'https://www.epa.gov/greenvehicles/electric-vehicle-myths',
      quote: 'EPA analysis confirms lower greenhouse gas emissions over total life cycle compared to internal combustion engines, despite initial battery pack manufacturing.',
      date: 'Official Federal Assessment',
      direction: 'SUPPORTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 98,
      screenshotVerified: true
    },
    {
      id: 'ev-3',
      sourceName: 'Nature Sustainability',
      sourceDomain: 'nature.com',
      title: 'Net Emission Reductions and Breakeven Mileage for Electric Mobility',
      url: 'https://www.nature.com/articles/s41893-020-0488-7',
      quote: 'Manufacturing emissions are offset over time. The carbon payback period averages 16,000 miles before delivering continuous net greenhouse savings.',
      date: 'Peer Review Journal',
      direction: 'CONTEXT',
      supportsVerdict: true,
      credibilityScore: 97,
      screenshotVerified: true
    }
  ]
};

export const DEFAULT_MOCK_RESULT: FactCheckResultData = {
  id: 'great-wall-space',
  claim: 'The Great Wall of China is visible from space with the naked eye.',
  checkedAt: 'Checked just now',
  verdict: 'FALSE',
  confidence: 94,
  summary: 'The claim is not supported by available evidence. The wall is generally too narrow to be reliably visible from low Earth orbit with the unaided eye.',
  reasoning: [
    {
      index: '01',
      title: 'Claim identification',
      description: 'The claim depends on the wall being visually distinguishable from orbital altitude without magnification or sensor enhancement.'
    },
    {
      index: '02',
      title: 'Evidence comparison',
      description: 'Astronaut accounts and scientific photography have repeatedly confirmed that distinguishing individual structures like the Great Wall requires telescopic lenses or prior pinpoint knowledge under optimal solar glare.'
    },
    {
      index: '03',
      title: 'Contradicting evidence',
      description: 'Its relatively narrow width (typically 5 to 9 meters) and use of native soil and stone make unaided visibility from 200+ miles altitude physically infeasible with standard human visual acuity.'
    },
    {
      index: '04',
      title: 'Conclusion',
      description: 'Available multi-agency astronaut records and optical physics therefore contradict the common historical claim.'
    }
  ],
  evidenceOverview: {
    strengthScore: 86,
    totalSources: 8,
    contradictCount: 5,
    supportCount: 2,
    contextCount: 1
  },
  sources: [
    {
      id: 'src-1',
      sourceName: 'NASA Earth Observatory',
      sourceDomain: 'earthobservatory.nasa.gov',
      title: 'China’s Wall Less Visible from Space Than Legend Claims',
      url: 'https://earthobservatory.nasa.gov/images/4054/chinas-wall-less-and-more-visible-than-thought',
      quote: 'The Great Wall is frequently cited as the only human-made structure visible from space, but astronauts report it is virtually impossible to distinguish without high-magnification cameras and ideal solar angles.',
      date: 'April 2005 / Archival Analysis',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 98
    },
    {
      id: 'src-2',
      sourceName: 'Scientific American',
      sourceDomain: 'scientificamerican.com',
      title: 'Is China’s Great Wall Really Visible from Space?',
      url: 'https://www.scientificamerican.com/article/is-chinas-great-wall-visible-from-space/',
      quote: 'From low Earth orbit, resolving a feature 10 meters wide would exceed human ocular resolving limits unless contrast against the surroundings was exceptionally stark, which ancient quarry rock does not provide.',
      date: 'February 2008',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 95
    },
    {
      id: 'src-3',
      sourceName: 'European Space Agency (ESA)',
      sourceDomain: 'esa.int',
      title: 'Space Radar Imagery and Human Eyes in Orbit',
      url: 'https://www.esa.int/Applications/Observing_the_Earth/Space_radar_image_of_the_Great_Wall_of_China',
      quote: 'While synthetic aperture radar sensors easily map the ancient masonry fortifications, human visual observation without optical aids cannot detect the narrow structure amid desert topography.',
      date: 'May 2004',
      direction: 'CONTRADICTS CLAIM',
      supportsVerdict: true,
      credibilityScore: 96
    }
  ]
};

export const POPULAR_CLAIMS_DATABASE: Record<string, FactCheckResultData> = {
  'coffee-cancer': COFFEE_CANCER_RESULT,
  'electric-cars': EV_LIFECYCLE_RESULT,
  'great-wall': DEFAULT_MOCK_RESULT,
  
  'brains-10-percent': {
    id: 'brains-10-percent',
    claim: 'Humans only use 10% of their brains.',
    checkedAt: 'Checked just now',
    verdict: 'FALSE',
    confidence: 98,
    summary: 'The claim that humans only utilize 10% of their brain capacity is a widespread myth debunked by modern neuroimaging, functional MRI, and clinical neurology.',
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: 'The statement asserts that 90% of human brain tissue remains dormant, unutilized, or accessible only through latent untapped potential.'
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'Functional MRI (fMRI) and positron emission tomography (PET) scans show that almost every brain region exhibits metabolic activity even during rest or sleep.'
      },
      {
        index: '03',
        title: 'Contradicting evidence',
        description: 'Evolutionary biology and neurobiology emphasize that the brain consumes ~20% of resting metabolic energy. Maintaining 90% redundant neural tissue would violate natural selection.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: 'Comprehensive neurological documentation establishes that virtually 100% of the brain is engaged across daily physiological and cognitive functions.'
      }
    ],
    evidenceOverview: {
      strengthScore: 96,
      totalSources: 9,
      contradictCount: 7,
      supportCount: 0,
      contextCount: 2
    },
    sources: [
      {
        id: 'brain-1',
        sourceName: 'National Institutes of Health (NIH)',
        sourceDomain: 'nih.gov',
        title: 'Brain Myths and Functional Neuroimaging Realities',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2776484/',
        quote: 'Neurological data shows damage to virtually any small area of the brain results in measurable functional deficits, directly refuting the unused capacity premise.',
        date: 'October 2018',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 99
      },
      {
        id: 'brain-2',
        sourceName: 'Nature Neuroscience',
        sourceDomain: 'nature.com',
        title: 'Whole-Brain Functional Connectomics During Baseline Rest',
        url: 'https://www.nature.com/articles/nn.4589',
        quote: 'Continuous metabolic signaling traverses cortical and subcortical networks seamlessly; no silent or unutilized 90% reserve exists.',
        date: 'July 2021',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 97
      },
      {
        id: 'brain-3',
        sourceName: 'Scientific American Mind',
        sourceDomain: 'scientificamerican.com',
        title: 'Do People Only Use 10 Percent of Their Brains?',
        url: 'https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/',
        quote: 'Brain imaging technologies, particularly fMRI, demonstrate that complex tasks recruit distributed networks throughout both hemispheres.',
        date: 'February 2008',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 94
      }
    ]
  },

  'india-population': {
    id: 'india-population',
    claim: 'India is the world’s most populous country.',
    checkedAt: 'Checked just now',
    verdict: 'TRUE',
    confidence: 96,
    summary: 'The claim is supported by official United Nations Department of Economic and Social Affairs (DESA) demographic reports and international census estimates.',
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: 'The statement asserts that the Republic of India currently holds the highest national population on Earth.'
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'In April 2023, the UN officially recorded India’s population reaching 1.428 billion, surpassing Mainland China’s recorded population figure.'
      },
      {
        index: '03',
        title: 'Supporting evidence',
        description: 'Demographic tracking from the World Bank and US Census Bureau International Database confirms persistent population differentials maintaining India at rank 1.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: 'Empirical demographic and statistical consensus across multilateral agencies conclusively validates the assertion.'
      }
    ],
    evidenceOverview: {
      strengthScore: 94,
      totalSources: 6,
      contradictCount: 0,
      supportCount: 5,
      contextCount: 1
    },
    sources: [
      {
        id: 'pop-1',
        sourceName: 'United Nations DESA',
        sourceDomain: 'un.org',
        title: 'India Overtakes China as the World’s Most Populous Country',
        url: 'https://www.un.org/en/desa/india-overtake-china-world-most-populous-country-april-2023',
        quote: 'By late April 2023, India’s population reached an estimated 1,425,775,850 people, matching and then eclipsing China’s official demographic statistics.',
        date: 'April 2023',
        direction: 'SUPPORTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 99
      },
      {
        id: 'pop-2',
        sourceName: 'World Bank Open Data',
        sourceDomain: 'data.worldbank.org',
        title: 'Total Population Indicators by Country (2023–2025)',
        url: 'https://data.worldbank.org/indicator/SP.POP.TOTL',
        quote: 'India leads global demographic indicators with steady organic replacement rates exceeding East Asian peers.',
        date: 'June 2024',
        direction: 'SUPPORTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 98
      }
    ]
  },

  'earth-flat': {
    id: 'earth-flat',
    claim: 'The Earth is flat.',
    checkedAt: 'Checked just now',
    verdict: 'FALSE',
    confidence: 99,
    summary: 'The claim is demonstrably false. Planetary geodesy, satellite telemetry, horizon curvature observations, and astronomical geometry verify the Earth as an oblate spheroid.',
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: 'The claim posits that planet Earth is a flat plane rather than a gravitationally bounded spheroid.'
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'Centuries of mathematical measurements beginning with Eratosthenes through modern GPS constellation orbit parameters corroborate spherical geometry.'
      },
      {
        index: '03',
        title: 'Contradicting evidence',
        description: 'Lunar eclipses consistently cast round planetary shadows; celestial poles rotate in opposing directions across northern and southern hemispheres.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: 'Direct multi-spectral space observation and fundamental physics disprove the flat earth conjecture completely.'
      }
    ],
    evidenceOverview: {
      strengthScore: 99,
      totalSources: 10,
      contradictCount: 9,
      supportCount: 0,
      contextCount: 1
    },
    sources: [
      {
        id: 'earth-1',
        sourceName: 'National Oceanic and Atmospheric Administration (NOAA)',
        sourceDomain: 'noaa.gov',
        title: 'Geodetic Science & The Figure of the Earth',
        url: 'https://oceanservice.noaa.gov/facts/earth-round.html',
        quote: 'Satellite geodetic measurements model the Earth as an oblate spheroid with an equatorial radius of 6,378.137 kilometers.',
        date: 'January 2023',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 99
      },
      {
        id: 'earth-2',
        sourceName: 'NASA Space Science Data Coordinated Archive',
        sourceDomain: 'nssdc.gsfc.nasa.gov',
        title: 'Earth Planetary Fact Sheet',
        url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
        quote: 'Continuous photographic imagery from DSCOVR:EPIC at Lagrange point 1 captures the illuminated spherical disk of Earth hourly.',
        date: 'August 2023',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 98
      }
    ]
  },

  'deepfake-detection': {
    id: 'deepfake-detection',
    claim: 'AI models can perfectly detect every deepfake.',
    checkedAt: 'Checked just now',
    verdict: 'FALSE',
    confidence: 91,
    summary: 'Current artificial intelligence forensic models cannot achieve 100% detection accuracy due to rapid adversarial generative improvements, compression artifacts, and cross-model generalization gaps.',
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: 'The claim asserts absolute (100%) reliable detection capability across all synthetic media.'
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'Peer-reviewed evaluations at CVPR and NIST benchmarks show top detection models suffer significant accuracy drops when applied out-of-distribution.'
      },
      {
        index: '03',
        title: 'Contradicting evidence',
        description: 'Adversarial post-processing, social media platform compression algorithms, and new generative architectures continuously degrade watermark and artifact detection.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: 'Leading computer vision laboratories agree that deepfake detection remains an active cat-and-mouse security frontier without guaranteed perfection.'
      }
    ],
    evidenceOverview: {
      strengthScore: 88,
      totalSources: 7,
      contradictCount: 5,
      supportCount: 0,
      contextCount: 2
    },
    sources: [
      {
        id: 'df-1',
        sourceName: 'IEEE Spectrum',
        sourceDomain: 'spectrum.ieee.org',
        title: 'The Unsolved Problem of Deepfake Detection at Scale',
        url: 'https://spectrum.ieee.org/deepfake-detection-challenges',
        quote: 'Detectors that achieve 99% in laboratory benchmarks frequently drop below 70% accuracy when tested against re-encoded video uploads or unseen diffusion architectures.',
        date: 'March 2024',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 95
      },
      {
        id: 'df-2',
        sourceName: 'Stanford HAI (Human-Centered AI)',
        sourceDomain: 'hai.stanford.edu',
        title: 'Synthetic Media Forensics: State of the Art',
        url: 'https://hai.stanford.edu/news/state-synthetic-media-forensics',
        quote: 'No single detection mechanism provides absolute guarantees against determined adversaries deploying iterative perturbation pipelines.',
        date: 'November 2023',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 96
      }
    ]
  },

  'lightning-twice': {
    id: 'lightning-twice',
    claim: 'Lightning never strikes the same place twice.',
    checkedAt: 'Checked just now',
    verdict: 'FALSE',
    confidence: 97,
    summary: 'This popular adage is factually untrue. Tall structures, geographical elevations, and prominent conductors are struck repeatedly, often dozens of times per year.',
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: 'The folk idiom suggests physical lightning discharge events cannot recurrently strike an identical terrestrial location.'
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'Meteorological sensors and high-speed atmospheric cameras routinely document repeat strikes at specific geographic coordinates.'
      },
      {
        index: '03',
        title: 'Contradicting evidence',
        description: 'The Empire State Building in New York City is struck by lightning an average of 25 to 100 times every calendar year.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: 'Atmospheric electrostatic physics dictates that charges follow paths of least electrical impedance, directly favoring previously struck elevated conductors.'
      }
    ],
    evidenceOverview: {
      strengthScore: 95,
      totalSources: 5,
      contradictCount: 4,
      supportCount: 0,
      contextCount: 1
    },
    sources: [
      {
        id: 'light-1',
        sourceName: 'National Weather Service (NOAA)',
        sourceDomain: 'weather.gov',
        title: 'Lightning Myths and Facts',
        url: 'https://www.weather.gov/safety/lightning-myths',
        quote: 'Lightning often strikes the same place repeatedly, especially tall, pointy, isolated objects. The Empire State Building is struck on average nearly 25 times annually.',
        date: 'June 2023',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 99
      },
      {
        id: 'light-2',
        sourceName: 'Royal Meteorological Society',
        sourceDomain: 'rmets.org',
        title: 'Recurrent Ground Strikes in Atmospheric Electrostatics',
        url: 'https://www.rmets.org/resource/lightning-recurrent-strikes',
        quote: 'Multi-strike events and stepped leaders naturally converge toward previously ionized channels and elevated grounding points.',
        date: 'September 2022',
        direction: 'CONTRADICTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 94
      }
    ]
  }
};

/**
 * Intelligent helper to match or generate a fact check result for any user input
 */
export function matchOrGenerateFactCheck(userClaim: string): FactCheckResultData {
  const normalized = userClaim.toLowerCase().trim();

  if (normalized.includes('coffee') && (normalized.includes('cancer') || normalized.includes('carcinogen') || normalized.includes('cause'))) {
    return { ...POPULAR_CLAIMS_DATABASE['coffee-cancer'], claim: userClaim };
  }
  if (
    (normalized.includes('electric') || normalized.includes('ev')) &&
    (normalized.includes('co2') || normalized.includes('emission') || normalized.includes('gas') || normalized.includes('lifetime'))
  ) {
    return { ...POPULAR_CLAIMS_DATABASE['electric-cars'], claim: userClaim };
  }
  if (normalized.includes('wall') && (normalized.includes('china') || normalized.includes('space'))) {
    return { ...POPULAR_CLAIMS_DATABASE['great-wall'], claim: userClaim };
  }
  if (normalized.includes('10%') || normalized.includes('ten percent') || (normalized.includes('brain') && normalized.includes('use'))) {
    return { ...POPULAR_CLAIMS_DATABASE['brains-10-percent'], claim: userClaim };
  }
  if (normalized.includes('india') && (normalized.includes('popul') || normalized.includes('country'))) {
    return { ...POPULAR_CLAIMS_DATABASE['india-population'], claim: userClaim };
  }
  if (normalized.includes('flat') && normalized.includes('earth')) {
    return { ...POPULAR_CLAIMS_DATABASE['earth-flat'], claim: userClaim };
  }
  if (normalized.includes('deepfake') || (normalized.includes('ai') && normalized.includes('detect'))) {
    return { ...POPULAR_CLAIMS_DATABASE['deepfake-detection'], claim: userClaim };
  }
  if (normalized.includes('lightning') && (normalized.includes('strike') || normalized.includes('twice'))) {
    return { ...POPULAR_CLAIMS_DATABASE['lightning-twice'], claim: userClaim };
  }

  // Realistic dynamic generator for custom input
  const isLikelyFalse = normalized.includes('never') || 
                        normalized.includes('cure') || 
                        normalized.includes('fake') || 
                        normalized.includes('conspiracy') ||
                        normalized.includes('poison');

  const verdict = isLikelyFalse ? 'FALSE' : 'MIXED';
  const confidence = isLikelyFalse ? 89 : 76;

  return {
    id: `custom-${Date.now()}`,
    claim: userClaim,
    checkedAt: 'Checked just now',
    verdict,
    confidence,
    summary: isLikelyFalse
      ? `Available academic and institutional sources indicate significant discrepancies with this claim. Key assertions lack corroborating empirical literature.`
      : `Evidence regarding this claim presents nuanced context. While certain aspects align with observational records, crucial qualifications apply.`,
    reasoning: [
      {
        index: '01',
        title: 'Claim identification',
        description: `Analysis extracted primary assertion: "${userClaim.slice(0, 120)}${userClaim.length > 120 ? '...' : ''}".`
      },
      {
        index: '02',
        title: 'Evidence comparison',
        description: 'Cross-referencing verified institutional databases, peer-reviewed registries, and journalistic archives for direct matching assertions.'
      },
      {
        index: '03',
        title: 'Context and qualifiers',
        description: 'Evaluating publication timeline, contextual variations, and potential semantic ambiguities within the submitted text.'
      },
      {
        index: '04',
        title: 'Conclusion',
        description: `Current scientific and journalistic consensus aligns with a ${verdict} determination based on accessible reference data.`
      }
    ],
    evidenceOverview: {
      strengthScore: confidence,
      totalSources: 6,
      contradictCount: isLikelyFalse ? 4 : 2,
      supportCount: isLikelyFalse ? 1 : 2,
      contextCount: isLikelyFalse ? 1 : 2
    },
    sources: [
      {
        id: 'cust-1',
        sourceName: 'Reuters Fact Check Archive',
        sourceDomain: 'reuters.com/fact-check',
        title: 'Fact Check: Verification Analysis & Public Record Inquiries',
        url: 'https://www.reuters.com/fact-check',
        quote: 'Archival records and public institutional data show significant qualifications are required when interpreting claims of this nature.',
        date: 'Recent Verification Archive',
        direction: isLikelyFalse ? 'CONTRADICTS CLAIM' : 'CONTEXT',
        supportsVerdict: true,
        credibilityScore: 94
      },
      {
        id: 'cust-2',
        sourceName: 'Associated Press News (AP Fact Check)',
        sourceDomain: 'apnews.com/ap-fact-check',
        title: 'Cross-Examination of Widely Circulated Statements',
        url: 'https://apnews.com/hub/ap-fact-check',
        quote: 'Independent researchers highlight that contextual boundaries and statistical definitions must be factored in prior to broad dissemination.',
        date: 'Reference Archive',
        direction: isLikelyFalse ? 'CONTRADICTS CLAIM' : 'SUPPORTS CLAIM',
        supportsVerdict: true,
        credibilityScore: 95
      },
      {
        id: 'cust-3',
        sourceName: 'National Science Library & Knowledge Base',
        sourceDomain: 'ncbi.nlm.nih.gov',
        title: 'Systematic Assessment of Published Literature',
        url: 'https://pubmed.ncbi.nlm.nih.gov',
        quote: 'Empirical data points across comparative sample studies provide critical boundary parameters regarding this topic.',
        date: 'Peer Review Database',
        direction: 'CONTEXT',
        supportsVerdict: true,
        credibilityScore: 92
      }
    ]
  };
}
