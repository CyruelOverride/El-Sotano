// CONTENIDO DE DEMOSTRACIÓN.
// Todo lo de este archivo es ficticio y sólo se usa cuando el servidor no devuelve datos.
// No representa eventos, artistas ni fechas reales de ElSotano.
// Las imágenes están en null a propósito: la UI muestra placeholders visuales.

const demo = { _demo: true };

export const fallbackData = {
  home: {
    ...demo,
    site: {
      name: 'El Sotano',
      address: 'Dirección a confirmar',
      email: 'contacto@elsotano.example',
      phone: '',
      hours: [
        { days: 'Jueves a sábado', time: '20:00 — 03:00' },
        { days: 'Domingo', time: '12:00 — 17:00' },
      ],
      social: [
        { label: 'Instagram', url: '#' },
        { label: 'Facebook', url: '#' },
        { label: 'YouTube', url: '#' },
      ],
    },
    hero: {
      image: null,
      tagline: 'Cocina con carácter y ruido bien hecho. Bajá.',
    },
    restaurant: {
      title: 'Comer también es hacer ruido',
      text: 'Una cocina sin vueltas, pensada para acompañar la noche. Platos para compartir, bebidas honestas y una mesa siempre cerca del escenario.',
      image: null,
    },
  },

  about: {
    ...demo,
    who: {
      title: 'Un bar bajo tierra',
      text: 'El Sotano es un bar con restaurante donde la música manda. Un lugar de encuentro para bandas, público y cocina, pensado como un fanzine en tres dimensiones.',
    },
    history: [
      { year: 'Origen', title: 'Un sótano, una idea', text: 'Texto de demostración: acá va el relato de cómo empezó el espacio.' },
      { year: 'Evolución', title: 'Se suma la cocina', text: 'Texto de demostración: acá va la historia de la propuesta gastronómica.' },
      { year: 'Hoy', title: 'Escena y comunidad', text: 'Texto de demostración: acá van los hitos que definen al bar hoy.' },
    ],
    identity: {
      text: 'Cultura underground, volumen alto y puertas abiertas. Acá se mezclan los géneros, las generaciones y las ganas de que pase algo.',
      pillars: ['Música en vivo', 'Cocina de autor', 'Comunidad', 'Irreverencia'],
    },
    space: [
      { src: null, alt: 'El espacio — barra' },
      { src: null, alt: 'El espacio — escenario' },
      { src: null, alt: 'El espacio — salón' },
    ],
  },

  guests: {
    ...demo,
    items: [
      { id: 'g1', name: 'Banda de Ejemplo', category: 'Banda', description: 'Invitado de demostración.', image: null, eventId: 'e1' },
      { id: 'g2', name: 'DJ Demostración', category: 'DJ', description: 'Invitado de demostración.', image: null, eventId: 'e2' },
      { id: 'g3', name: 'Dúo Placeholder', category: 'Músicos', description: 'Invitado de demostración.', image: null, eventId: 'e3' },
      { id: 'g4', name: 'Voz Anónima', category: 'Spoken word', description: 'Invitado de demostración.', image: null, eventId: null },
    ],
  },

  events: {
    ...demo,
    items: [
      { id: 'e1', slug: 'noche-demo-uno', name: 'Noche Demo Uno', date: '2025-03-15', category: 'LIVE', type: 'Recital', location: 'ElSotano', description: 'Evento de demostración. Reemplazar por contenido real desde el servidor.', image: null, images: [], guests: ['Banda de Ejemplo'], featured: true, participation: false },
      { id: 'e2', slug: 'noche-demo-dos', name: 'Noche Demo Dos', date: '2025-06-21', category: 'LIVE', type: 'Fiesta', location: 'ElSotano', description: 'Evento de demostración. Reemplazar por contenido real desde el servidor.', image: null, images: [], guests: ['DJ Demostración'], featured: true, participation: false },
      { id: 'e3', slug: 'ciclo-demo', name: 'Ciclo Demo', date: '2024-09-07', category: 'ARCHIVE', type: 'Ciclo', location: 'ElSotano', description: 'Evento de demostración. Reemplazar por contenido real desde el servidor.', image: null, images: [], guests: ['Dúo Placeholder'], featured: true, participation: false },
      { id: 'e4', slug: 'cena-demo', name: 'Cena Demo', date: '2024-05-18', category: 'FOOD', type: 'Gastronómico', location: 'ElSotano', description: 'Evento de demostración. Reemplazar por contenido real desde el servidor.', image: null, images: [], guests: [], featured: false, participation: false },
      { id: 'e5', slug: 'festival-demo', name: 'Festival Demo', date: '2024-11-30', category: 'LIVE', type: 'Festival', location: 'Sede externa de ejemplo', description: 'Participación de demostración en un festival externo.', image: null, images: [], guests: [], featured: false, participation: true },
      { id: 'e6', slug: 'encuentro-demo', name: 'Encuentro Demo', date: '2023-10-12', category: 'ARCHIVE', type: 'Encuentro', location: 'Sede externa de ejemplo', description: 'Participación de demostración en un encuentro externo.', image: null, images: [], guests: [], featured: false, participation: true },
    ],
  },

  restaurant: {
    ...demo,
    intro: { title: 'Resto', text: 'Cocina de sótano: intensa, generosa y sin solemnidad.' },
    proposal: { title: 'Nuestra propuesta', text: 'Texto de demostración: acá se describe la cocina, las especialidades y la forma de comer en ElSotano.' },
    categories: [
      { id: 'c1', name: 'Para picar' },
      { id: 'c2', name: 'Principales' },
      { id: 'c3', name: 'Bebidas' },
    ],
    dishes: [
      { id: 'd1', categoryId: 'c1', name: 'Plato de ejemplo 1', description: 'Descripción de demostración.', price: null, image: null },
      { id: 'd2', categoryId: 'c1', name: 'Plato de ejemplo 2', description: 'Descripción de demostración.', price: null, image: null },
      { id: 'd3', categoryId: 'c2', name: 'Plato de ejemplo 3', description: 'Descripción de demostración.', price: null, image: null },
      { id: 'd4', categoryId: 'c2', name: 'Plato de ejemplo 4', description: 'Descripción de demostración.', price: null, image: null },
      { id: 'd5', categoryId: 'c3', name: 'Bebida de ejemplo', description: 'Descripción de demostración.', price: null, image: null },
    ],
    gallery: [
      { src: null, alt: 'Plato' }, { src: null, alt: 'Bebida' }, { src: null, alt: 'Preparación' },
    ],
    space: [
      { src: null, alt: 'Salón del resto' }, { src: null, alt: 'Barra' },
    ],
    info: { reservations: 'Reservas: a confirmar.', note: '' },
  },

  upcoming: {
    ...demo,
    items: [
      { id: 'u1', slug: 'proximo-demo-uno', name: 'Próximo Demo Uno', date: '2027-02-12', description: 'Evento de demostración. No es un evento real.', image: null, guests: ['Banda de Ejemplo'], tickets: 'Entradas: a confirmar', url: '', category: 'UPCOMING' },
      { id: 'u2', slug: 'proximo-demo-dos', name: 'Próximo Demo Dos', date: '2027-03-05', description: 'Evento de demostración. No es un evento real.', image: null, guests: ['DJ Demostración'], tickets: '', url: '', category: 'UPCOMING' },
      { id: 'u3', slug: 'proximo-demo-tres', name: 'Próximo Demo Tres', date: '2027-04-17', description: 'Evento de demostración. No es un evento real.', image: null, guests: [], tickets: '', url: '', category: 'UPCOMING' },
    ],
  },

  gallery: {
    ...demo,
    items: [
      { src: null, alt: 'Público' }, { src: null, alt: 'Escenario' }, { src: null, alt: 'Barra' },
      { src: null, alt: 'Banda' }, { src: null, alt: 'Cocina' }, { src: null, alt: 'Salón' },
    ],
  },
};
