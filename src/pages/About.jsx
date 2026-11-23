import { useContent } from '../hooks/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../hooks/useAuth';
import { AdminBar, EditButton } from '../components/admin/AdminControls';
import { whoFields } from '../components/admin/fields';
import { merge } from '../services/contentActions';
import HistorySection from '../components/about/HistorySection';
import IdentitySection from '../components/about/IdentitySection';
import GuestSection from '../components/about/GuestSection';
import Banner from '../components/shared/Banner';
import SectionTitle from '../components/shared/SectionTitle';
import ImageGallery from '../components/shared/ImageGallery';
import Reveal from '../components/shared/Reveal';
import { Loading, DemoBanner } from '../components/shared/StateViews';

export default function About() {
  usePageMeta('Nosotros', 'La historia, la identidad y los invitados de El Sótano.');
  const { isAdmin } = useAuth();
  const { data, loading, isFallback } = useContent('about', 'guests');
  if (loading) return <Loading />;
  const about = data.about || {};

  return (
    <>
      <DemoBanner show={isFallback} />
      <section className="page-head">
        <span className="mono">01 — Quiénes somos</span>
        <Reveal><h1 className="display">{about.who?.title}</h1></Reveal>
        <Reveal delay={0.1}><p className="lead">{about.who?.text}</p></Reveal>
        <AdminBar>
          <EditButton title="Editar presentación" label="Texto" fields={whoFields} value={about.who} onSave={(v) => merge('about', 'who', v)} />
        </AdminBar>
      </section>
      <Banner slot="about-1" label="Banner nosotros 1" />
      <HistorySection items={about.history} />
      <IdentitySection identity={about.identity} />
      <Banner slot="about-2" label="Banner nosotros 2" />
      <GuestSection guests={data.guests?.items} />
      {(about.space?.length > 0 || isAdmin) && (
        <section className="section">
          <SectionTitle number={5} label="Fotos">El espacio</SectionTitle>
          <ImageGallery images={about.space} admin={{ section: 'about', path: 'space' }} />
        </section>
      )}
    </>
  );
}
