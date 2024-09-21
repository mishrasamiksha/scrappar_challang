import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";
import { links } from "../config";

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Pricing",
    url: "#pricing",
  },
  {
    id: "2",
    title: "How to use",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "#roadmap",
  },
  {
    id: "4",
    title: "Get Started",
    url: links.sourceCode,
    onlyMobile: true,
    external: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];
export const devopsServices = [
  "Automated Deployments",
  "Proactive Monitoring",
  "Scalable Infrastructure",
];

export const devopsServicesIcons = [
  recording03,  // Keeping the same icons as before
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "AI-Powered CI/CD",
    text: "Implement AI-driven Continuous Integration and Continuous Deployment pipelines to streamline development and release processes.",
    date: "July 2023",
    status: "done",
    imageUrl: roadmap1,  // Keeping the same images as before
    colorful: true,
  },
  {
    id: "1",
    title: "Predictive Analytics",
    text: "Integrate predictive analytics to anticipate infrastructure needs and prevent potential bottlenecks.",
    date: "August 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Intelligent Scaling",
    text: "Enable automatic scaling of resources based on AI-driven demand forecasting.",
    date: "September 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Incident Response Automation",
    text: "Deploy AI to automatically detect, analyze, and respond to incidents in real-time, reducing downtime.",
    date: "October 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With AI-driven automation and robust security, it’s the ultimate solution for teams aiming to optimize their DevOps processes.";

export const collabContent = [
  {
    id: "0",
    title: "Automated Workflows",
    text: collabText,
  },
  {
    id: "1",
    title: "Proactive Monitoring",
    text: "Stay ahead of potential issues with AI that monitors and alerts in real-time.",
  },
  {
    id: "2",
    title: "Scalable Security",
    text: "Ensure your infrastructure is secure and scalable with AI-driven solutions.",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Jenkins",
    icon: figma,  // Keeping the same icons as before
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Kubernetes",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Docker",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Terraform",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Ansible",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Prometheus",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Grafana",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Elastic Stack",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Starter",
    description: "Basic DevOps automation tools, standard support",
    price: "0",
    features: [
      "Automated deployments for small projects",
      "Standard monitoring and alerting",
      "Access to community support",
    ],
    premium: false,
  },
  {
    id: "1",
    title: "Professional",
    description: "Advanced automation, AI-driven insights, priority support",
    price: "49.99",
    features: [
      "AI-powered CI/CD pipelines",
      "Predictive analytics for infrastructure",
      "Priority support with dedicated assistance",
    ],
    premium: true,
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom solutions, advanced security, dedicated account management",
    price: null,
    features: [
      "Custom automation workflows",
      "Advanced security and compliance features",
      "Dedicated account management and 24/7 support",
    ],
    premium: true,
  },
];

export const benefits = [
  {
    id: "0",
    title: "Automated Deployments",
    text: "Streamline your release process with AI-driven automation that handles deployments with precision and speed.",
    backgroundUrl: "/src/assets/benefits/card-1.svg",  // Keeping the same background and icon images
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Proactive Monitoring",
    text: "Stay ahead of issues with AI-driven monitoring that detects anomalies and suggests fixes before they escalate.",
    backgroundUrl: "/src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Intelligent Scaling",
    text: "Optimize resource allocation with AI that predicts demand and automatically scales your infrastructure.",
    backgroundUrl: "/src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Incident Response Automation",
    text: "Reduce downtime with AI that autonomously detects and resolves incidents in real-time.",
    backgroundUrl: "/src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Comprehensive Analytics",
    text: "Gain insights into your infrastructure with advanced analytics powered by AI.",
    backgroundUrl: "/src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Continuous Improvement",
    text: "Leverage AI-driven recommendations to continuously improve your DevOps processes.",
    backgroundUrl: "/src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "GitHub",
    iconUrl: discordBlack,  // Keeping the same icons as before
    url: "#",
  },
  {
    id: "1",
    title: "LinkedIn",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Twitter",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Reddit",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Slack",
    iconUrl: facebook,
    url: "#",
  },
];
