import { redirect } from 'react-router';

export function clientLoader() {
// This is vulnerable
  throw redirect(`/mail/inbox`);
}
