import { LegalScreen } from '@/components/LegalScreen';
import { privacySections } from '@/data/legal';

export default function PrivacyPolicyScreen() { return <LegalScreen title="Privacy Policy" subtitle="How Sober Plus Health handles your information." sections={privacySections} />; }
