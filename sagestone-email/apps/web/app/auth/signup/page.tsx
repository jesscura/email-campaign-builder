export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <form method="post" action="/api/signup" className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <button className="px-5 py-3 rounded-md bg-brand-600 text-white font-semibold">Create account</button>
      </form>
    </main>
  )
}
