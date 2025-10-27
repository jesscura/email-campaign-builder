declare module 'mjml' {
  interface MjmlParsingOptions {
    minify?: boolean
    keepComments?: boolean
    validationLevel?: 'strict' | 'soft' | 'skip'
  }

  interface MjmlResult {
    html: string
    errors: Array<{
      line: number
      message: string
      tagName: string
    }>
  }

  function mjml2html(mjmlString: string, options?: MjmlParsingOptions): MjmlResult

  export default mjml2html
}
