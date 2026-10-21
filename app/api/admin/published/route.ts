import {fail,requireAdmin} from '@/lib/admin-auth';
import {getPublishedState} from '@/lib/published';
export const dynamic='force-dynamic';
export async function GET(request:Request){if(!await requireAdmin(request))return fail('Admin access required',403);return Response.json(await getPublishedState(),{headers:{'Cache-Control':'no-store'}})}
