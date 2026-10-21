import {jsonLd} from '@/lib/seo';
export default function SeoJsonLd({data}:{data:unknown}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/>}
