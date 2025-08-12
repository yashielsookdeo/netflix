export default function selectionFilter({ series, films } = []) {
  return {
    series: [
      { title: 'Popular Shows', data: series?.filter((item) => item.genre === 'popular') || [] },
      { title: 'Top Rated Shows', data: series?.filter((item) => item.genre === 'top-rated') || [] },
      { title: 'Drama Series', data: series?.filter((item) => item.genre === 'drama') || [] },
      { title: 'Comedy Series', data: series?.filter((item) => item.genre === 'comedy') || [] },
      { title: 'Documentaries', data: series?.filter((item) => item.genre === 'documentaries') || [] },
    ],
    films: [
      { title: 'Popular Movies', data: films?.filter((item) => item.genre === 'popular') || [] },
      { title: 'Top Rated Movies', data: films?.filter((item) => item.genre === 'top-rated') || [] },
      { title: 'Action Movies', data: films?.filter((item) => item.genre === 'action') || [] },
      { title: 'Comedy Movies', data: films?.filter((item) => item.genre === 'comedy') || [] },
      { title: 'Horror Movies', data: films?.filter((item) => item.genre === 'horror') || [] },
    ],
  };
}
