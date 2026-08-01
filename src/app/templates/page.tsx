import { getTemplatesAction } from '@/app/actions/templateActions';
import { Templates } from './Template';

export const metadata = {
  title: 'Templates | PromptStack',
  description:
    'Browse curated prompt templates, fork one into your library, customize the variables, and run it instantly.',
};

export default async function TemplatesPage() {
  const response = await getTemplatesAction();
  const initialTemplates = response.success && response.templates ? response.templates : [];

  return <Templates initialTemplates={initialTemplates} />;
}
