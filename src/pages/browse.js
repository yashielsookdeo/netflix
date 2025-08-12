import React from 'react';
import { BrowseContainer } from '../containers/browse';
import useTMDBContent from '../hooks/use-tmdb-content';
import { selectionFilter } from '../utils';

export default function Browse() {
  const { series } = useTMDBContent('series');
  const { films } = useTMDBContent('films');
  const slides = selectionFilter({ series, films });

  return <BrowseContainer slides={slides} />;
}
