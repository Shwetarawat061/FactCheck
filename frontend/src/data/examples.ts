import { FactCheckResult } from '../types/factCheck';

export interface ExampleClaimItem {
  id: string;
  claim: string;
  category: 'Science' | 'Health' | 'Astronomy' | 'Geography' | 'Physics';
}

export const EXAMPLE_CLAIMS: ExampleClaimItem[] = [
  {
    id: 'flat-earth',
    claim: 'The Earth is flat.',
    category: 'Science'
  },
  {
    id: 'brain-10',
    claim: 'Humans only use 10% of their brains.',
    category: 'Science'
  },
  {
    id: 'great-wall-moon',
    claim: 'The Great Wall of China is visible from the Moon.',
    category: 'Astronomy'
  },
  {
    id: 'coffee-cancer',
    claim: 'Coffee causes cancer.',
    category: 'Health'
  },
  {
    id: 'water-boiling',
    claim: 'Water boils at 100°C at sea level.',
    category: 'Physics'
  }
];

export const DEMO_DATABASE: Record<string, FactCheckResult> = {
  'The Great Wall of China is visible from the Moon.': {
    id: 'res-great-wall-moon',
    claim: 'The Great Wall of China is visible from the Moon.',
    verdict: 'FALSE',
    confidence: 94,
    summary: 'The Great Wall of China is completely invisible from the Moon to the unaided human eye. Astronauts and optical physics confirm that resolving the 5-9 meter wide masonry from 384,400 km away is physically impossible without extreme telescopic magnification.',
    analysis: 'The myth that the Great Wall can be seen from space or the Moon dates back to the 18th century, well before space exploration. From lunar orbit (approx. 240,000 miles), even entire continents and mountain ranges appear as modest geographic features. At that distance, resolving a wall less than 10 meters across would require visual resolving power thousands of times greater than the human eye possesses. Apollo astronauts, including Neil Armstrong and Alan Bean, have explicitly stated that no human-made structures are distinguishable from the lunar surface.',
    reasoning: [
      {
        index: '01',
        title: 'Optical Resolution Physics',
        description: 'Human angular resolution is approximately 1 arcminute. From lunar distance, the wall subtends less than 0.005 arcseconds—vastly below visual detection thresholds.'
      },
      {
        index: '02',
        title: 'Astronaut Corroboration',
        description: 'NASA astronauts across Apollo 11 through 17 documented that only Earth’s blue oceans, clouds, polar caps, and continental landmasses are discernible.'
      },
      {
        index: '03',
        title: 'Material & Contrast Limitations',
        description: 'The wall was constructed primarily using local clay, stone, and quarry earth, blending into the surrounding topography with minimal spectral contrast.'
      },
      {
        index: '04',
        title: 'Historical Origin Analysis',
        description: 'The assertion originated in 1754 writings by antiquarian William Stukeley and was popularized by Henry Norman in 1895, decades before orbital photography existed.'
      }
    ],
    evidenceOverview: {
      total: 5,
      supports: 0,
      contradicts: 4,
      context: 1
    },
    evidence: [
      {
        source: 'NASA Earth Observatory',
        title: 'China’s Wall Less Visible from Space Than Legend Claims',
        url: 'https://earthobservatory.nasa.gov/images/4054/chinas-wall-less-and-more-visible-than-thought',
        quote: 'Astronauts report that the Great Wall is virtually impossible to distinguish without high-magnification lenses. From the Moon, only continental outlines and weather systems are visible.',
        date: 'NASA Science Feature',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'Scientific American',
        title: 'Is China’s Great Wall Really Visible from Space or the Moon?',
        url: 'https://www.scientificamerican.com/article/is-chinas-great-wall-visible-from-space/',
        quote: 'Resolving a feature roughly 10 meters across from lunar orbit exceeds the resolving limit of the human retina by several orders of magnitude.',
        date: 'Peer Review Review',
        relationship: 'CONTRADICTS',
        credibilityScore: 98
      },
      {
        source: 'European Space Agency (ESA)',
        title: 'Space Observation & Historical Fortifications',
        url: 'https://www.esa.int/Applications/Observing_the_Earth/Space_radar_image_of_the_Great_Wall_of_China',
        quote: 'Optical detection from high Earth orbit—let alone cis-lunar space—is impossible without active synthetic aperture radar sensors.',
        date: 'ESA Technical Report',
        relationship: 'CONTRADICTS',
        credibilityScore: 97
      },
      {
        source: 'Smithsonian National Air and Space Museum',
        title: 'Apollo Crew Debriefing Records',
        url: 'https://airandspace.si.edu',
        quote: 'Apollo 12 astronaut Alan Bean confirmed: "When you are on the Moon, you see the Earth as a beautiful sphere... you cannot see the Great Wall of China."',
        date: 'Apollo Lunar Exploration Records',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'Library of Congress',
        title: 'Origin of the Great Wall Visibility Legend',
        url: 'https://www.loc.gov',
        quote: 'Speculative assertions date to William Stukeley (1754) and Henry Norman (1895), written long before human spaceflight.',
        date: 'Historical Archives',
        relationship: 'CONTEXT',
        credibilityScore: 94
      }
    ],
    checkedAt: 'Checked just now',
    isDemo: true
  },

  'The Earth is flat.': {
    id: 'res-earth-flat',
    claim: 'The Earth is flat.',
    verdict: 'FALSE',
    confidence: 99,
    summary: 'The claim is directly contradicted by millennia of astronomical calculations, satellite telemetry, circumnavigational navigation, and planetary geodesy.',
    analysis: 'Planetary geodesy and space agency orbital telemetry establish that the Earth is an oblate spheroid with an equatorial radius of 6,378.1 km and a polar radius of 6,356.8 km. Celestial mechanics, differing constellations between northern and southern hemispheres, lunar eclipse geometry, and real-time imagery from DSCOVR:EPIC at the Sun-Earth L1 Lagrange point provide unequivocal empirical refutation of a planar model.',
    reasoning: [
      {
        index: '01',
        title: 'Satellite and Orbital Telemetry',
        description: 'More than 8,000 active satellites in geostationary and low-Earth orbits operate on orbital mechanics governed strictly by a spherical gravitational potential field.'
      },
      {
        index: '02',
        title: 'Geodetic Measurement',
        description: 'Laser ranging and GNSS constellations continuously map global planetary curvature and the geoid with sub-millimeter precision.'
      },
      {
        index: '03',
        title: 'Celestial Hemispheric Navigation',
        description: 'Stars rotate counterclockwise around Polaris in the north and clockwise around the Southern Cross in the south, which is geometrically impossible on a flat plane.'
      }
    ],
    evidenceOverview: {
      total: 6,
      supports: 0,
      contradicts: 6,
      context: 0
    },
    evidence: [
      {
        source: 'National Oceanic and Atmospheric Administration (NOAA)',
        title: 'Geodetic Science & The Figure of the Earth',
        url: 'https://oceanservice.noaa.gov/facts/earth-round.html',
        quote: 'Satellite geodetic measurements model the Earth as an oblate spheroid with an equatorial radius of 6,378.137 kilometers.',
        date: 'NOAA Ocean Service',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'NASA Space Science Data Coordinated Archive',
        title: 'Earth Planetary Fact Sheet',
        url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
        quote: 'Hourly photographs from DSCOVR:EPIC at Lagrange Point 1 show the illuminated rotating spherical disc of planet Earth in its entirety.',
        date: 'NASA Science Data',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'Royal Astronomical Society',
        title: 'Lunar Eclipse Shadow Projections',
        url: 'https://ras.ac.uk',
        quote: 'During every lunar eclipse regardless of rotational angle, the shadow cast by Earth on the Moon is consistently circular, a trait unique to spheres.',
        date: 'Astronomical Journal',
        relationship: 'CONTRADICTS',
        credibilityScore: 97
      }
    ],
    checkedAt: 'Checked just now',
    isDemo: true
  },

  'Humans only use 10% of their brains.': {
    id: 'res-brain-10',
    claim: 'Humans only use 10% of their brains.',
    verdict: 'FALSE',
    confidence: 98,
    summary: 'Modern functional neuroimaging, fMRI scans, and clinical lesion studies demonstrate that virtually 100% of the brain is metabolically active throughout everyday cognitive and sensory tasks.',
    analysis: 'The myth that 90% of the brain lies dormant arose in the early 20th century from misinterpretations of glial cell ratios and pioneer neurological research. Functional MRI and PET imaging reveal that even simple motor or linguistic tasks engage extensive distributed neural networks across both hemispheres. Evolutionary biology also contradicts the claim: the human brain accounts for 20% of resting metabolic energy despite representing only 2% of body mass, which natural selection would not preserve if 90% was useless.',
    reasoning: [
      {
        index: '01',
        title: 'Functional MRI Mapping',
        description: 'Comprehensive fMRI and PET studies show neural activation across all lobes during both waking activity and sleep stages.'
      },
      {
        index: '02',
        title: 'Clinical Lesion Evidence',
        description: 'Damage to even minute percentages of brain tissue typically produces localized deficits, disproving the idea of an unused 90% buffer.'
      },
      {
        index: '03',
        title: 'Metabolic Energetics',
        description: 'The brain consumes 20% of the body’s glucose and oxygen; maintaining inactive biological tissue would constitute an unsustainable evolutionary penalty.'
      }
    ],
    evidenceOverview: {
      total: 5,
      supports: 0,
      contradicts: 5,
      context: 0
    },
    evidence: [
      {
        source: 'National Institutes of Health (NIH / PMC)',
        title: 'Functional Imaging and Distributed Neural Systems',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2776484/',
        quote: 'Extensive neuroimaging demonstrates that normal cognitive tasks engage wide cortico-subcortical circuits; there is no unutilized 90% brain reserve.',
        date: 'Neuroscience Review',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'Scientific American Mind',
        title: 'Do People Only Use 10 Percent of Their Brains?',
        url: 'https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/',
        quote: 'Evidence would show no effect from damage to 90 percent of the brain if the myth were true. Instead, almost any area of the brain is vital when damaged.',
        date: 'Scientific American',
        relationship: 'CONTRADICTS',
        credibilityScore: 98
      }
    ],
    checkedAt: 'Checked just now',
    isDemo: true
  },

  'Coffee causes cancer.': {
    id: 'res-coffee-cancer',
    claim: 'Coffee causes cancer.',
    verdict: 'FALSE',
    confidence: 97,
    summary: 'Authoritative international health reviews (WHO/IARC, American Cancer Society, WCRF) conclude that coffee is not classified as a human carcinogen and actually exhibits protective associations against liver and endometrial cancers.',
    analysis: 'In 2016, the World Health Organization’s International Agency for Research on Cancer (IARC) re-evaluated over 1,000 observational studies and officially removed coffee from the list of possible carcinogens (Group 2B down to Group 3: unclassifiable as to carcinogenicity). Large umbrella reviews published in the British Medical Journal confirm that moderate coffee consumption (3-4 cups/day) is associated with reduced risk of several chronic diseases and specific malignancies, including hepatocellular carcinoma and endometrial cancer. The California Office of Environmental Health Hazard Assessment (OEHHA) formally adopted regulations in 2019 exempting coffee from Proposition 65 cancer warning labels.',
    reasoning: [
      {
        index: '01',
        title: 'WHO / IARC Official Classification',
        description: 'IARC Monographs Volume 116 formally downgraded coffee from Group 2B to Group 3 after analyzing over 1,000 human studies.'
      },
      {
        index: '02',
        title: 'Systematic Prospective Cohorts',
        description: 'Large prospective cohorts controlling for confounders like tobacco use confirm no increased general cancer risk.'
      },
      {
        index: '03',
        title: 'Documented Protective Correlations',
        description: 'Consistent inverse associations demonstrate significant protective benefits against liver and endometrial cancers.'
      },
      {
        index: '04',
        title: 'Legal and Regulatory Reversal',
        description: 'California OEHHA issued an official scientific determination exempting coffee from Prop 65 cancer warnings.'
      }
    ],
    evidenceOverview: {
      total: 6,
      supports: 0,
      contradicts: 5,
      context: 1
    },
    evidence: [
      {
        source: 'IARC / World Health Organization',
        title: 'IARC Monographs Volume 116: Evaluation of Carcinogenic Risks',
        url: 'https://www.iarc.who.int/featured-news/media-centre-iarc-news-mono116/',
        quote: 'Working Group found no consistent evidence of a carcinogenic effect of coffee drinking. Coffee was classified as Group 3: Not classifiable as to its carcinogenicity to humans.',
        date: 'WHO / Lancet Oncology',
        relationship: 'CONTRADICTS',
        credibilityScore: 99
      },
      {
        source: 'British Medical Journal (BMJ)',
        title: 'Coffee consumption and health: umbrella review of meta-analyses of multiple health outcomes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29167102/',
        quote: 'Coffee consumption was more often associated with benefit than harm... Lower risks were observed for several specific cancers including prostate cancer, endometrial cancer, and liver cancer.',
        date: 'BMJ 2017;359:j5024',
        relationship: 'CONTRADICTS',
        credibilityScore: 98
      },
      {
        source: 'World Cancer Research Fund (WCRF)',
        title: 'Coffee, Tea and Cancer Risk',
        url: 'https://www.wcrf.org/preventing-cancer/topics/coffee-tea-and-cancer/',
        quote: 'We have strong evidence that coffee reduces the risk of liver and endometrial cancer. There is no evidence that coffee increases overall cancer risk.',
        date: 'Global Cancer Update',
        relationship: 'CONTRADICTS',
        credibilityScore: 97
      },
      {
        source: 'California OEHHA (Proposition 65)',
        title: 'Coffee and Proposition 65: Scientific Consensus Ruling',
        url: 'https://www.p65warnings.ca.gov/fact-sheets/coffee-and-proposition-65-frequently-asked-questions',
        quote: 'A very large number of human studies, taken together, show inadequate evidence that drinking coffee causes cancer. Drinking coffee appears to reduce the risk of certain cancers.',
        date: 'State Regulatory Filing',
        relationship: 'CONTRADICTS',
        credibilityScore: 96
      }
    ],
    checkedAt: 'Checked just now',
    isDemo: true
  },

  'Water boils at 100°C at sea level.': {
    id: 'res-water-boil',
    claim: 'Water boils at 100°C at sea level.',
    verdict: 'TRUE',
    confidence: 99,
    summary: 'Under standard atmospheric pressure (1 atm or 101.325 kPa), pure water exhibits a boiling transition point of precisely 99.974°C (effectively 100°C) according to thermodynamic definition.',
    analysis: 'Thermodynamics dictates that liquid boils when its vapor pressure equals prevailing ambient atmospheric pressure. At standard sea level pressure (101.325 kPa), pure H2O transitions from liquid to vapor at 99.974°C on the International Temperature Scale of 1990 (ITS-90). The Celsius scale was originally defined around this thermodynamic milestone, making the assertion scientifically sound under standard physical parameters.',
    reasoning: [
      {
        index: '01',
        title: 'Thermodynamic Definition',
        description: 'Vapor pressure of pure liquid water equals 101.325 kPa at 99.974°C (standard convention 100°C).'
      },
      {
        index: '02',
        title: 'Atmospheric Dependence',
        description: 'The specified qualifier "at sea level" accurately fixes the pressure variable to 1 standard atmosphere.'
      }
    ],
    evidenceOverview: {
      total: 4,
      supports: 4,
      contradicts: 0,
      context: 0
    },
    evidence: [
      {
        source: 'National Institute of Standards and Technology (NIST)',
        title: 'Thermophysical Properties of Fluid Systems: Water',
        url: 'https://webbook.nist.gov/chemistry/fluid/',
        quote: 'Standard boiling point of pure water at 101.325 kPa is 373.124 K (99.974 °C), universally approximated as 100.0 °C.',
        date: 'NIST Reference Database',
        relationship: 'SUPPORTS',
        credibilityScore: 99
      },
      {
        source: 'IUPAC Compendium of Chemical Terminology',
        title: 'Normal Boiling Point Standard Definitions',
        url: 'https://goldbook.iupac.org',
        quote: 'The normal boiling temperature corresponds to vapor pressure equilibrium at 1.01325 bar.',
        date: 'Gold Book',
        relationship: 'SUPPORTS',
        credibilityScore: 99
      }
    ],
    checkedAt: 'Checked just now',
    isDemo: true
  }
};
