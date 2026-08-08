import { LegalScreen } from '@/components/LegalScreen';
import { termsSections } from '@/data/legal';

export default function TermsScreen() { return <LegalScreen title="Terms of Use" subtitle="The rules and responsibilities for using the app." sections={termsSections} />; }
