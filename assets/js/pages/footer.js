import { $$ } from '../utils/utils';
import { handleSendEmail } from './general';

const newsletterForm = $$.getElementById('email-form');

newsletterForm.addEventListener('submit', handleSendEmail);

