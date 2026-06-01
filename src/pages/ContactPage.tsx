import PageHero from '../components/PageHero'
import Contact from '../components/Contact'
import { site } from '../data/site'

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    site.address,
  )}&z=16&output=embed`

  return (
    <>
      <PageHero
        eyebrow="오시는 길"
        title={
          <>
            언제든 <span className="text-brand-600">편하게 찾아오세요</span>
          </>
        }
        desc="전화 또는 상담 신청서로 문의해 주시면 친절히 안내해 드립니다."
        crumbs={[{ label: '오시는 길' }]}
      />

      {/* Map */}
      <section className="pt-12">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <iframe
              title="키즈피지오 위치"
              src={mapSrc}
              className="h-[360px] w-full border-0 sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
