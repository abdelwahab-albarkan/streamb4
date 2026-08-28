// Email functionality removed — static site has no SMTP backend.
// Stub exports prevent TypeScript errors if any legacy import remains.

export const transporter = null;
export const FROM = '';

export async function sendWelcomeEmail(_email: string): Promise<void> {}
export async function sendCommentNotification(_comment: unknown, _postTitle: string): Promise<void> {}
export async function sendNewPostNotification(_post: unknown, _subscribers: string[]): Promise<void> {}
