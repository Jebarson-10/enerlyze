import HomeClient from './home-client';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import StartupIntro from './startup-intro';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const {content}=await getPublishedState();return pageMetadata({title:contentValue(content,'seo.home.title'),description:contentValue(content,'seo.home.description'),path:'/'})}
export default async function HomePage(){const {content}=await getPublishedState();return <><HomeClient content={content}/><StartupIntro/></>}
