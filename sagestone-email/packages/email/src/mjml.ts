import mjml2html from 'mjml'

export type CompileResult = { html: string; errors: any[] }

export function compileMjml(mjml: string, options?: { minify?: boolean }): CompileResult {
  const { html, errors } = mjml2html(mjml, { validationLevel: 'soft', minify: options?.minify ?? true })
  return { html, errors }
}
