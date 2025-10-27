import mjml2html from 'mjml';

export function compileMJML(mjmlContent: string): { html: string; errors: any[] } {
  const result = mjml2html(mjmlContent, {
    validationLevel: 'soft',
  });

  return {
    html: result.html,
    errors: result.errors,
  };
}
