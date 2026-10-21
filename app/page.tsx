import HomeClient from './home-client';
import {getPublishedState} from '@/lib/published';
import {contentValue} from '@/lib/content-fields';
import type {Metadata} from 'next';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const {content}=await getPublishedState();return {title:{absolute:contentValue(content,'seo.home.title')},description:contentValue(content,'seo.home.description'),alternates:{canonical:'/'}}}
export default async function HomePage(){const {content}=await getPublishedState();return <HomeClient content={content}/>}
