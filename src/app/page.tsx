import { auth } from '@/src/lib/auth'
import { redirect, RedirectType } from 'next/navigation'
import { headers } from 'next/headers'

export default async function HomePage() {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session) {
        redirect('/login', RedirectType.push)
    }
    
    redirect('/hotels', RedirectType.push)
}
